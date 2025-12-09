import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Rating from "react-rating"
import { IoIosStar } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";

const Complete = () => {
  const location = useLocation();
  const { token } = useParams();              
  const tokenFromState = location.state?.token;

  const [value, setValue] = useState(0);
  const [feedback, setfeedback] = useState('');

  const submitFeedback = async () => {
    console.log(value);
    console.log(feedback);

    setValue(0);
    setfeedback('');
  }



 if(token !== tokenFromState){
    return (
        <div className="min-h-screen bg-zinc-900 flex justify-center item-center pt-60">
            <h1 className="text-8xl text-green-400">404</h1>
        </div>
    )
 }

  return (
    <div className="min-h-screen bg-zinc-950">
        <div className="flex justify-center item-center">
            <h1 className="text-green-400 text-3xl py-5">Rate your Interview</h1>
        </div>

        <div className='w-full flex justify-center item-center pt-10'>
            <div className="border-1 border-zinc-900 w-90 h-100 rounded-lg">

                <h1 className="text-gray-400 text-center pt-10">Rating</h1>
                <div className="flex justify-center pt-2">
                    <Rating
                    initialRating={value}
                    onChange={(val) => setValue(val)}
                    emptySymbol={
                        <IoStarOutline className="text-gray-300 hover:scale-110 transition-transform duration-150 mx-1" size={36} />
                    }
                    fullSymbol={
                        <IoIosStar className="text-yellow-400 hover:scale-110 transition-transform duration-150" size={36} />
                    }
                    />
                </div>
                
                <h1 className="text-gray-400 text-center pt-20">Feedback</h1>
                <div className="flex justify-center item-center pt-2">
                    <textarea value={feedback} onChange={(e)=>setfeedback(e.target.value)} className="border-1 border-zinc-900 text-white p-2" name="" id="" cols="40" rows="5"></textarea>
                </div>   
            </div>
        </div>

        <div className="flex justify-center item-center pt-2">
            <button onClick={submitFeedback} className="bg-green-500 px-2 py-1 text-lg rounded-md mt-2 ">
                Submit 
            </button>
        </div>
    </div>
  );
};

export default Complete;

