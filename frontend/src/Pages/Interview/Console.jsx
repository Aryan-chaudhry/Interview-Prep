const Console = ({ question, onOpenCode }) => {
  if (!question) {
    return <div className="p-4">No question selected</div>;
  }

  if (question.category !== "problem-solving") {
    return (
      <div className="h-120 w-200 shadow-md p-6 flex items-center justify-center text-gray-400">
        Answer verbally to the interviewer
      </div>
    );
  }

  return (
    <div className="h-120 w-200 shadow-md p-6">
      <h3 className="font-semibold mb-3">Problem</h3>

      <pre className="text-sm whitespace-pre-wrap text-gray-700">
        {question.question}
      </pre>

      <button
        onClick={onOpenCode}
        className="mt-4 text-indigo-600 font-medium"
      >
        Open Code Editor
      </button>
    </div>
  );
};

export default Console;
