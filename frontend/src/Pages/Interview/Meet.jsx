import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../Store/useAuthStore';
import ErrorPage from '../ErrorPage';

import {
  ShieldUser,
  Users,
  Code,
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  SquareChevronRight,
  ChartNoAxesColumnDecreasing,
  CloudHail,
} from 'lucide-react';
import User from './User';
import VsCode from './Code';
import Console from './Console';
import Vapi from '@vapi-ai/web';
import PageNotFound from '../PageNotFound';

const Meet = () => {

  const { authUser } = useAuthStore();
  const userId = authUser?._id;
  

  const navigate = useNavigate();
  const location = useLocation();

  const streamRef = useRef(null);
  const videoStreamRef = useRef(null);
  const videoRef = useRef(null);
  const apiTriggger = useRef(false);
  const vapiRef = useRef(null);
  const conversationRef = useRef([]);


  const job = location?.state?.job;
  console.log(job);
  const jobId = job?._id;
  const jobRole = job?.jobRole;
  

  const [questions, setQuestion] = useState([]);
  const [inteviewInfo, setInterviewInfo] = useState(false);
  const [mic, setMicOff] = useState(true); // off by default
  const [videoOff, setVideoOff] = useState(true); // off by default
  const [myconsole, setConsole] = useState(false);
  const [mycode, setCode] = useState(true);
  const [people, setPeople] = useState(false);
  const [language, setLanguage] = useState('');
  const [coding, setCoding] = useState('');
  const [activeUser, setActiveUser] = useState(false);
  const [InterviewEnded, setInterviewEnded] =useState(false);
  const [interviewconversation, setConversation] = useState([]);

  if(!job){
    return(
      <div className='flex justify-center item-center py-60'>
        <PageNotFound/>
      </div>
    )
  }

  const getQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/interview-question/${jobId}`
      );
      setQuestion(response.data.Questions);
      setInterviewInfo(true);
      // console.log(response.data.Questions)
      toast.success('please enable full screen mode by press f11');
    } catch (error) {
      toast.error('Server Error');
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (apiTriggger.current) return;

    apiTriggger.current = true;
    getQuestion();
  }, [userId]);

  useEffect(()=>{
    inteviewInfo && startCall()
  }, [inteviewInfo])

  const startCall = async () => {
    if (!questions || questions.length === 0) return;

    let questionList = "";

    questions.forEach((item, index) => {
      questionList += (item.question || item);
      if (index !== questions.length - 1) {
        questionList += `question : ${index+2} ` ;
      }
    });

    // console.log("QuestionList", questionList);

    const assistantOptions = {
      name: "Expert Ai interviewer Agent",
      firstMessage: "Hi candidate , how are you? Ready for your interview?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
    You are an AI voice assistant conducting interviews.
    Your job is to ask candidates provided interview questions, assess their responses.
    Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. before starting please tell aboit policies of the interviews to the user like if any illegal activities you will be stricktly disconnected from this meeting (in a hard and angry attitude) Example:
    "Hey there! Welcome to the interview. Ready for ${jobRole}? Let’s get started with a few questions!"
    Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are
    the questions ask one by one:
    Questions: ${questionList}
    
    If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
    "Need a hint? Think about how React tracks component updates!" or go to the next question directly.
    dont Provide brief, encouraging feedback after each answer and dont give answer of that question after user answer please.
    provide the encourage feedback like Example:
    "Nice! That’s a solid answer."
    "Hmm, not quite! Want to try again?"
    also the problem solving question are last 2 question which are code with code editor 
    coding language : ${language}
    mycode : ${coding}
    Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
    but if candidate if making fun or doing illegal activites or making fun of interview using tone or any other activities during the interview you have to disconnected from the meeting immediately in a hard and angry attitude.
    After all questions questions, wrap up the interview smoothly by summarizing their performance. Example:
    "That was great! You handled some tough questions well. Keep sharpening your skills!"
    End on a positive note:
    "Thanks for chatting! Hope to see you crushing projects soon!"
    Key Guidelines:
    ✔ Be friendly, engaging, and witty 
    ✔ Keep responses short and natural, like a real conversation
    ✔ Adapt based on the candidate’s confidence level
    ✔ Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
    };

    

    try {
      vapiRef.current?.start(assistantOptions)
    } catch (error) {
      toast.error('Pannel disconnected!  ')
      const token = await axios.get('http://localhost:8080/api/test-token');
      navigate(`/error/${token}`, {state:{token:token}}) // todo implement token verification here please
    }

  };

 

  useEffect(() => {
    // initialize Vapi once and attach handlers
    vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
    const vapi = vapiRef.current;

    const onCallStart = () => {
      console.log('Call has been initiated');
      toast('Call Connected...');
      setActiveUser(false);
    };

    const onSpeechStart = () => {
      console.log('Assistant speech has started');
      setActiveUser(false);
    };

    const onSpeechEnded = () => {
      console.log('Assitant speech has ended');
      setActiveUser(true);
    };

    const onCallEnd = () => {
      console.log('Call has been Ended');
      toast('Interview Ended');
      generateResult();
    };

    const onMessage = (message) => {
      if (Array.isArray(message?.conversation)) {
        console.log("Conversation (VALID): ", message.conversation);
        conversationRef.current = message.conversation; // ✅ IMPORTANT
        setConversation(message.conversation);          // keep UI same
      }
    };




    try {
      
      vapi.on('call-start', onCallStart);
      vapi.on('speech-start', onSpeechStart);
      vapi.on('speech-ended', onSpeechEnded);
      vapi.on('call-end', onCallEnd);
      vapi.on('message', onMessage);
  
    } catch (e) {
      const token =  axios.get('http://localhost:8080/api/test-token');
      navigate(`/error/${token}`, {state:{token:token}}) // todo implement token verification here please
    }

    return () => {
      try {
        vapi.stop && vapi.stop();
      } catch (e) {}
      vapiRef.current = null;
    };
  }, []);

  const generateResult = async () => {
      try {
        if (!jobId) return;
        const finalConversation = conversationRef.current;

        if (!Array.isArray(finalConversation) || finalConversation.length === 0) {
          console.warn("Interview conversation not ready yet");
          return;
        }

        console.log("Interview Conversation sent for result generation:", finalConversation);

        await axios.post(
          `http://localhost:8080/api/interview-result/${jobId}`,
          {
            conversation: finalConversation,
            userId: userId,
          }
        );
      } catch (error) {
        console.log('error in generating result at backend', error);
      }
    };

  const toggleMic = async () => {
    setMicOff(prev => {
      if (prev === true) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            streamRef.current = stream;
          });
      } else {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return !prev;
    });
  };

  const toogleCamera = async () => {
    setVideoOff(prev => {
      if (prev === true) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            videoStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          });
      } else {
        videoStreamRef.current?.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      return !prev;
    });
  };

  const handleConsole = () => {
    setConsole(prev => !prev);
  };

  const handleIDE = () => {
    setCode(prev => !prev);
  };

  const handlePeople = () => {
    setPeople(prev => !prev);
  };

  

  const leaveMeeting = async () => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg p-4 w-[360px]">
        <p className="font-semibold text-gray-900">
          Are you absolutely sure?
        </p>
        <p className="text-sm text-gray-500 mt-1">
          This action cannot be undone. Your interview will end.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                vapiRef.current?.stop();
                const res = await axios.get('http://localhost:8080/api/test-token');
                const token = res.data.token
                setTimeout(()=>{
                  navigate(`/Complete/${token}`, {state:{token}});
                }, 2000)

              } catch (e) {}
              setInterviewEnded(true); 
              // todo implement navigation to complete page with token verification
            }}
            className="px-4 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700"
          >
            Continue
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };


  return (
    <div className="w-full min-h-screen bg-zinc-900 pt-20">

      <div className="flex justify-between px-5 shadow-md py-2">
        <div>
          <ShieldUser size={30} className="mx-4" />
          <p>protected</p>
        </div>

        <div className="flex justify-evenly gap-10">
          <div className="cursor-pointer" onClick={handlePeople}>
            <Users size={25} className="mx-3" />
            <p>people</p>
          </div>

          <div className="cursor-pointer" onClick={handleIDE}>
            <Code size={25} className="mx-1" />
            <p>code</p>
          </div>

          <div className="cursor-pointer" onClick={handleConsole}>
            <SquareChevronRight size={25} className="mx-3" />
            <p>console</p>
          </div>

          <p className="text-3xl">|</p>

          {mic ? (
            <div className="text-gray-400 cursor-pointer" onClick={toggleMic}>
              <MicOff size={25} />
              <p>off</p>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={toggleMic}>
              <Mic size={25} className="text-red-600 animate-pulse" />
              <p className="text-gray-400 mx-1">on</p>
            </div>
          )}

          {videoOff ? (
            <div className="text-gray-400 cursor-pointer" onClick={toogleCamera}>
              <VideoOff size={25} />
              <p>off</p>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={toogleCamera}>
              <Video size={25} className="text-red-600 animate-pulse" />
              <p className="text-gray-400">on</p>
            </div>
          )}

          <div className="cursor-pointer" onClick={leaveMeeting}>
            <Phone size={25} className="text-red-600" />
            <p className="text-gray-400">leave</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-10 py-10">
        <div className="w-[40%]">

          <div className="bg-zinc-800 w-90 h-60 rounded-md relative">
            <div className="flex justify-center items-center">
              {!activeUser  &&  (
                <span className="absolute inset-0 flex justify-center items-center">
                  <span className="rounded-full bg-teal-500 opacity-50 animate-ping w-40 h-40" />
                </span>
              )}

              <span className="bg-gray-400 w-50 h-50 rounded-full my-5 flex justify-center items-center relative z-10">
                <h1 className="text-8xl text-black py-12">I</h1>
              </span>
            </div>

            <p className="text-center">Interviewer</p>
          </div>


          <div className="bg-zinc-800 w-90 h-60 rounded-md my-18">
            {!videoOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                {activeUser &&   (
                  <span className="absolute inset-0 flex justify-center items-center">
                    <span className="rounded-full bg-teal-500 opacity-50 animate-ping w-40 h-40" />
                  </span>
                )}
                <span className="bg-gray-400 w-50 h-50 rounded-full flex justify-center items-center">
                  <h1 className="text-8xl text-black">Y</h1>
                </span>
              </div>
            )}
            <p className="text-center mt-2">You</p>
          </div>

        </div>

        {myconsole && <Console questions={questions} />}
        {mycode && <VsCode setLanguage={setLanguage} setCoding={setCoding} />}
        {people && <User mic={mic} video={videoOff} />}

      </div>
    </div>
  );
};

export default Meet;
