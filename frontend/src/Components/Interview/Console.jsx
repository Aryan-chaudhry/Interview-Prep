
    import React, {useState} from 'react'
    
    const Console = () => {
        const [problem, setProblem] = useState("");
      return (
        <div className='bg-white h-full'>

          <h1 className='text-center'>Agent Console</h1>

          <div className='p-40'>
            <h1 className='text-gray-400 animate-pulse'>
                {!problem ? 
                    " Agent don't give any problem to you..."
                    :
                    ""
                }
            </h1>
          </div>
        </div>
      )
    }
    
    export default Console
    