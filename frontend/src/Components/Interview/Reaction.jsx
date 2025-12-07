import React, { useState } from "react";

// Sample emoji list (you can extend it)
const emojis = [
  "😀", "😂", "😍", "😎", "🤔", "😢", "👍", "👎", "🙏", "🔥",
  "💯", "🎉", "🥳", "😡", "🤯", "💔", "🌟", "🍕", "🍔", "⚽"
];

const Reaction = () => {
  const [clickedEmoji, setClickedEmoji] = useState(null);

  const handleEmojiClick = (emoji) => {
    setClickedEmoji(emoji);
    setTimeout(() => setClickedEmoji(null), 1000); // animation duration
  };

  return (
    <div className="p-5 bg-zinc-900 min-h-screen flex flex-col items-center">

      
      <div className="grid grid-cols-8 gap-4 bg-zinc-950 p-4 rounded-lg border border-gray-700">
        {emojis.map((emoji, index) => (
          <div
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className={`text-3xl cursor-pointer select-none transform transition-all duration-300
              ${clickedEmoji === emoji 
                ? "scale-150 -translate-y-4 rotate-12 animate-bounce" 
                : "hover:scale-125 hover:-translate-y-1 hover:rotate-6"}`
            }
          >
            {emoji}
          </div>
        ))}

      </div>

      {clickedEmoji && (
        <div className="mt-5 text-5xl animate-bounce">{clickedEmoji}</div>
      )}
    </div>
  );
};

export default Reaction;
