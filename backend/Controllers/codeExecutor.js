const axios = require("axios");

// Language ID mappings for Judge0
const languageMap = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++
  c: 50,           // C
};

const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res
        .status(400)
        .json({ success: false, error: "Code and language are required" });
    }

    if (!languageMap[language]) {
      return res
        .status(400)
        .json({ success: false, error: `Language '${language}' not supported` });
    }

    const languageId = languageMap[language];
    const judge0ApiKey = process.env.JUDGE0_API_KEY;

    console.log("DEBUG: Checking API Key...");
    console.log("DEBUG: JUDGE0_API_KEY exists:", !!judge0ApiKey);
    console.log("DEBUG: JUDGE0_API_KEY length:", judge0ApiKey ? judge0ApiKey.length : 0);

    if (!judge0ApiKey) {
      return res
        .status(500)
        .json({ success: false, error: "JUDGE0_API_KEY not found in .env file. Please add it!" });
    }

    console.log("Submitting code to Judge0...");

    // Step 1: Submit code to Judge0
    const submitResponse = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
      {
        language_id: languageId,
        source_code: code,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": judge0ApiKey,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        timeout: 10000,
      }
    );

    const tokenId = submitResponse.data.token;
    console.log("Submission token received:", tokenId);

    // Step 2: Poll for execution results
    let result = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        const statusResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": judge0ApiKey,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            timeout: 10000,
          }
        );

        result = statusResponse.data;
        console.log(`Poll attempt ${attempts + 1}: Status ${result.status.id}`);

        // Status 1 and 2 mean still processing
        if (result.status.id > 2) {
          break;
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (pollErr) {
        console.error("Polling error:", pollErr.message);
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    if (!result) {
      return res.status(200).json({
        success: false,
        error: "Timeout waiting for code execution",
      });
    }

    // Step 3: Process results
    if (result.status.id === 3) {
      // Accepted (successful execution)
      const output = result.stdout || "Code executed successfully!";
      return res.status(200).json({
        success: true,
        output: output,
      });
    } else if (result.status.id === 4) {
      // Wrong Answer or Runtime Error
      const error = result.stderr || result.compile_output || "Execution error";
      return res.status(200).json({
        success: false,
        error: error,
      });
    } else if (result.status.id === 5) {
      // Time Limit Exceeded
      return res.status(200).json({
        success: false,
        error: "Time limit exceeded",
      });
    } else if (result.status.id === 6) {
      // Compilation Error
      return res.status(200).json({
        success: false,
        error: result.compile_output || "Compilation error",
      });
    } else {
      // Other errors
      return res.status(200).json({
        success: false,
        error: result.stderr || result.compile_output || `Execution failed: ${result.status.description}`,
      });
    }
  } catch (err) {
    console.error("Judge0 API Error:", err.message);
    
    let errorMessage = "Internal server error";
    
    if (err.response?.status === 403) {
      errorMessage = "Authentication failed (403). Check your JUDGE0_API_KEY in .env file.";
    } else if (err.response?.status === 429) {
      errorMessage = "Rate limit exceeded. Try again later.";
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else {
      errorMessage = err.message;
    }

    res.status(200).json({
      success: false,
      error: errorMessage,
    });
  }
};

module.exports = { executeCode };
