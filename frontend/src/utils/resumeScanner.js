

import pdfToText from 'react-pdftotext';

// Extract keywords from text
const extractKeywords = (text) => {
  if (!text) return [];
  
  // Convert to lowercase and split into words
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Filter out common English stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
    'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'any', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than', 'too',
    'very', 'just', 'more', 'most', 'if', 'before', 'after', 'above', 'below',
    'your', 'our', 'their', 'that', 'this', 'through', 'during', 'about'
  ]);
  
  // Filter stop words and return unique keywords
  const filtered = words
    .filter(word => !stopWords.has(word) && word.length > 2)
    .filter((word, idx, arr) => arr.indexOf(word) === idx); // unique
  
  return filtered;
};

// Calculate similarity score (0-100%)
// Simple stemmer: remove common suffixes
const stem = (word) => {
  return word.replace(/(ing|ed|ly|es|s|ment|ation|tion)$/,'');
};

// Normalize text: lowercase, remove non-word chars
const normalize = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Build term frequency map
const termFrequency = (text) => {
  const tf = Object.create(null);
  const tokens = normalize(text).match(/\b\w+\b/g) || [];
  tokens.forEach((t) => {
    const w = stem(t);
    if (w.length <= 2) return;
    tf[w] = (tf[w] || 0) + 1;
  });
  return tf;
};

// Cosine similarity between two term-frequency maps
const cosineSimilarity = (tfA, tfB) => {
  const intersection = Object.keys(tfA).filter(k => k in tfB);
  let dot = 0;
  intersection.forEach(k => { dot += tfA[k] * tfB[k]; });
  const magA = Math.sqrt(Object.values(tfA).reduce((s,v)=>s+v*v,0));
  const magB = Math.sqrt(Object.values(tfB).reduce((s,v)=>s+v*v,0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

// Compute skill match score (0-100)
const computeSkillScore = (resumeText, skills) => {
  if (!skills || skills.length === 0) return null;
  const resume = normalize(resumeText);
  let matches = 0;
  skills.forEach(skill => {
    if (!skill) return;
    const s = normalize(skill);
    // exact or partial match
    if (resume.includes(s) || s.includes(resume)) matches++;
    else {
      // try token-level matching
      const tokens = s.split(' ');
      const tokenMatch = tokens.every(tok => tok.length>2 ? resume.includes(tok) : true);
      if (tokenMatch) matches++;
    }
  });
  return Math.round((matches / skills.length) * 100);
};

// Calculate similarity score (0-100%) combining skills + description cosine
const calculateSimilarity = (resumeText, jobText, skills = []) => {
  // Skill score (if skills provided) weighted heavily
  const skillScore = computeSkillScore(resumeText, skills);

  // Cosine similarity for full job description
  const tfResume = termFrequency(resumeText);
  const tfJob = termFrequency(jobText);
  const cosine = cosineSimilarity(tfResume, tfJob); // 0..1
  const descScore = Math.round(cosine * 100);

  // Combine scores: if skills available, weight skills=0.6, desc=0.4
  let final = 0;
  if (skillScore !== null) {
    final = Math.round((skillScore * 0.6) + (descScore * 0.4));
  } else {
    final = descScore;
  }

  // clamp
  final = Math.max(0, Math.min(100, final));
  return final;
};

// Extract text from PDF using react-pdftotext
const extractTextFromPDF = async (file) => {
  try {
    const text = await pdfToText(file);
    return text;
  } catch (err) {
    console.error('PDF extraction error:', err);
    throw new Error('Could not extract text from PDF. Make sure it has text content (not scanned image).');
  }
};

// Extract text from plain text file
const extractTextFromPlain = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(new Error('Could not read text file'));
    reader.readAsText(file);
  });
};

// Main function to scan resume
export const scanResume = async (file, jobData) => {
  try {
    if (!file) throw new Error('No file selected');
    
    let resumeText = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      resumeText = await extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      resumeText = await extractTextFromPlain(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or TXT.');
    }
    
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('PDF appears to be empty. Please check the file.');
    }
    
    // Build job description from job card
    const jobDescription = `
      ${jobData.jobTitle || ''} 
      ${jobData.jobRole || ''} 
      ${jobData.companyName || ''} 
      ${jobData.location || ''} 
      ${jobData.salary || ''} 
      ${(jobData.primarySkills || []).join(' ')} 
      ${jobData.workType || ''}
      ${jobData.professionalJD || jobData.description || jobData.jobDescription || ''}
    `;
    
    // Combine primary + secondary skills (if available)
    const primary = Array.isArray(jobData.primarySkills) ? jobData.primarySkills : (jobData.primarySkills ? [jobData.primarySkills] : []);
    const secondary = Array.isArray(jobData.secondarySkills) ? jobData.secondarySkills : (jobData.secondarySkills ? [jobData.secondarySkills] : []);
    const combinedSkills = Array.from(new Set([...primary, ...secondary].filter(Boolean)));

    // Calculate scores
    const skillScore = computeSkillScore(resumeText, combinedSkills); // 0-100 or null
    const matchScore = calculateSimilarity(resumeText, jobDescription);

    // Qualification rule: skill match >= 50% for primary+secondary
    const isQualifiedSkill = (skillScore !== null) ? (skillScore >= 50) : false;

    return {
      success: true,
      matchScore,
      skillScore: skillScore !== null ? skillScore : Math.round(matchScore),
      isQualifiedSkill,
      resumeText,
      message: `Your resume matches this job ${Math.round(matchScore)}% (skills ${skillScore !== null ? skillScore + '%' : 'N/A'})`,
      resumeLength: resumeText.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Error scanning resume',
    };
  }
};

export default scanResume;
