import React, { useState } from "react";

const People = ({ agentJoined }) => {
  const [people, setPeople] = useState([
    { name: "You", role: "Participant", online: true },
    { name: "Agent", role: "Interviewer", online: true },
  ]);

  // Show only "You" until agent joins, then show both
  const displayedPeople = agentJoined ? people : people.slice(0, 1);

  return (
    <div className="w-full h-full bg-zinc-900 text-white p-5 flex flex-col">

      <h1 className="text-2xl font-semibold mb-4">People</h1>

      <div className="bg-zinc-800 rounded-lg p-4 flex-1 overflow-y-auto">
        {displayedPeople.map((p, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-zinc-700 py-3"
          >
            <div>
              <p className="text-lg">{p.name}</p>
              <p className="text-sm text-gray-400">{p.role}</p>
            </div>

            <div>
              {p.online ? (
                <span className="text-green-400 text-sm">● Online</span>
              ) : (
                <span className="text-red-400 text-sm">● Offline</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default People;
