import React from 'react'

const Join = () => {
  return (
    <div className="w-full h-full bg-zinc-900 flex justify-center items-center px-4 rounded-lg">
      <div className="flex flex-col gap-4 w-full max-w-sm border border-green-500/50 p-6 rounded-2xl bg-zinc-800 shadow-lg shadow-green-500/10">
        
        <h2 className="text-xl font-semibold text-green-400 text-center mb-2">
          Join Interview Room
        </h2>

        <input 
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white
                     focus:outline-none focus:border-green-500 transition-all duration-200"
          type="email" 
          placeholder="Enter Email" 
        />

        <input 
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white
                     focus:outline-none focus:border-green-500 transition-all duration-200"
          type="password" 
          placeholder="Enter Room Code" 
        />

        <button 
          className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg 
                     transition-all duration-200 shadow-md hover:shadow-green-500/30"
        >
          Join Room
        </button>

      </div>
    </div>
  )
}

export default Join
