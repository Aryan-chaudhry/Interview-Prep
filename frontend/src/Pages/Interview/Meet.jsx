import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../Store/useAuthStore';
import Vapi from '@vapi-ai/web';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaLaptopCode, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import { IoShield, IoCall, IoHandLeft } from 'react-icons/io5';
import Code from './Code';
import Console from './Console';

const Meet = ({ userId, job, Resume }) => {
    console.log(job);
    console.log(Resume);

    const { authUser } = useAuthStore();

    // state
    const [questions, setQuestions] = useState([]);
    const [handRaised, setHandRaised] = useState(false);
    const [mute, setMute] = useState(true);
    const [webcam, setWebCam] = useState(false);
    const [assistantSpeaking, setAssistantSpeaking] = useState(false);
    const [showConsole, setShowConsole] = useState(true);
    const [showCode, setShowCode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    // vapi session
    const vapiRef = useRef(null);
    const assistantSessionRef = useRef(null);
    const videoRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const reconnectRef = useRef({ attempts: 0 });
    const answeredRef = useRef(false); // 🔒 PREVENT DUPLICATE ANSWERS
    const MAX_RECONNECT = 3;

    if (!vapiRef.current) vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
    const vapi = vapiRef.current;

    const getQuestion = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/interview-question/${userId}`);
            console.log(response.data);
            setQuestions(response.data.Questions || []);
            toast.success('Pannel is in queue please Wait Patiently');
        } catch (error) {
            console.error('error in getting interview question', error);
            toast.error('Interview Crash please try again after some time');
        }
    };

    useEffect(() => {
        getQuestion();
        console.log("api trigger");
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                assistantSessionRef.current?.stop();
            } catch (e) {}
            try { stopCamera(); } catch (e) {}
        };
    }, []);

    // start call once questions are loaded
    useEffect(() => {
        if (!questions.length) return;
        const t = setTimeout(() => startCall(), 1000);
        return () => clearTimeout(t);
    }, [questions]);

    const startCall = () => {
        if (assistantSessionRef.current) return;

        let questionList = "";
        questions.forEach((q, index) => {
            questionList += `${index + 1}. ${q.question}\n`;
        });

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: `Hi ${Resume?.name || 'Candidate'}, ready for your interview for ${job.jobRole}?`,
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
You are an AI interviewer.
please also do survilence on camera ${webcam} is on than go else say candidate to on the camera first to start the interview
Ask ONE question at a time.
If question is problem-solving, tell candidate to use Code Editor.
Do not skip questions.
Questions:
${questionList}

                        `.trim(),
                    },
                ],
            },
        };

        try {
            const session = vapi.start(assistantOptions);
            assistantSessionRef.current = session;
            reconnectRef.current.attempts = 0;

            session.on('transcript', (t) => {
                if (!t?.isFinal || mute || answeredRef.current) return;
                answeredRef.current = true;
                handleAutoAnswer(t.text);
            });

            session.on('message', (msg) => {
                const isAssistant =
                    msg?.role === 'assistant' ||
                    msg?.source === 'assistant';
                if (isAssistant) {
                    setAssistantSpeaking(true);
                    setTimeout(() => setAssistantSpeaking(false), 800);
                }
            });

            session.on('error', attemptReconnect);
            session.on('call-ended', attemptReconnect);

            toast.success('Pannel activate Please say hi to start the interview');
        } catch (err) {
            console.error('Vapi start error', err);
            attemptReconnect(err);
        }
    };

    const attemptReconnect = () => {
        if (reconnectRef.current.attempts >= MAX_RECONNECT) return;
        reconnectRef.current.attempts += 1;
        setTimeout(() => {
            assistantSessionRef.current = null;
            startCall();
        }, 1000);
    };

    const sendAssistantMessage = async (text) => {
        try {
            assistantSessionRef.current?.send?.(text);
        } catch (e) {}
    };

    const raiseHand = () => {
        setHandRaised(v => {
            if (!v) sendAssistantMessage("Candidate raised hand. Ask if they need help.");
            return !v;
        });
    };

    const startCamera = async () => {
        if (mediaStreamRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
    };

    const stopCamera = () => {
        mediaStreamRef.current?.getTracks()?.forEach(t => t.stop());
        mediaStreamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const toggleCamera = () => {
        webcam ? stopCamera() : startCamera();
        setWebCam(v => !v);
    };

    const toggleMute = () => setMute(v => !v);

    const handleAutoAnswer = (text) => {
        const q = questions[currentIndex];
        if (!q) return;

        const payloadAnswer = {
            question: q.question,
            category: q.category,
            answerText: text,
        };

        const updated = [...answers, payloadAnswer];
        setAnswers(updated);
        postAnswersToServer(updated);

        setTimeout(() => {
            answeredRef.current = false;
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1);
            }
        }, 1200);
    };

    const postAnswersToServer = async (answersToSend) => {
        try {
            await axios.post('http://localhost:8080/api/gemini/save-answers', {
                userId,
                interviewId: null,
                answers: answersToSend,
            });
        } catch (err) {
            console.error('Error saving answers', err);
        }
    };

    const submitAnswer = (answerPayload) => {
        const q = questions[currentIndex];

        if (q?.category === "problem-solving") {
            sendAssistantMessage(`
Evaluate the following ${answerPayload.language} code:
${answerPayload.code}
Give interview-style feedback.
            `);
        }

        const updated = [...answers, {
            ...answerPayload,
            question: q.question,
            category: q.category,
        }];

        setAnswers(updated);
        postAnswersToServer(updated);
        if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    };

    const leaveCall = () => {
        try {
            assistantSessionRef.current?.stop();
        } catch (e) {}
        toast.success('Left the interview');
    };

    return (
        <div className='min-h-screen pt-20'>
            <div className='min-w-screen shadow-md flex justify-between px-10'>
                <div className='flex justify-evenly gap-3'>
                    <div>
                        <IoShield  size={25}/>
                    </div>

                    <div>
                        <p>{Date.now()}</p>
                    </div>
                </div>
                <div className='flex justify-evenly gap-10'>
                    <div onClick={raiseHand} style={{cursor:'pointer'}}>
                        <div><IoHandLeft  size={25} className={`mx-1 ${handRaised ? 'text-yellow-400' : 'text-gray-400'}`} /></div>
                        <p className='text-sm text-gray-400'>Hand</p>
                    </div>

                    <div>
                        <p className='text-2xl text-black'>|</p>
                    </div>


                    <div onClick={() => { setShowConsole(s => !s); setShowCode(false); }} style={{cursor:'pointer'}}>
                        <div><FaLaptopCode  size={25} className='mx-2 text-indigo-600' /></div>
                        <p className='text-sm text-gray-400'>console</p>
                    </div>

                    <div onClick={() => { setShowCode(s => !s); setShowConsole(false); }} style={{cursor:'pointer'}}>
                        <div><VscVscode size={25} className='mx-1 text-blue-400' /></div>
                        <p className='text-sm text-gray-400'>code</p>
                    </div>

                    <div>
                        <p className='text-2xl text-black'>|</p>
                    </div>

                    {
                        mute ? (
                            <div onClick={toggleMute} style={{ cursor: 'pointer' }}>
                                <div><FaMicrophoneSlash size={25} className='mx-1 text-gray-400' /></div>
                                <p className='text-sm text-gray-400'>unmute</p>
                            </div>
                        ) : (
                            <div onClick={toggleMute} style={{ cursor: 'pointer' }}>
                                <div><FaMicrophone size={25} className='mx-1 text-red-600' /></div>
                                <p className='text-sm text-gray-400'>mute</p>
                            </div>
                        )
                    }

                    {
                        webcam === false ? (
                            <div onClick={toggleCamera} style={{ cursor: 'pointer' }}>
                                <div><FaVideoSlash size={25} className='mx-1 text-gray-400' /></div>
                                <p className='text-sm text-gray-400 mx-1'>on</p>
                            </div>
                        ) : (
                            <div onClick={toggleCamera} style={{ cursor: 'pointer' }}>
                                <div><FaVideo size={25} className='mx-1 text-red-600' /></div>
                                <p className='text-sm text-gray-400 mx-1'>off</p>
                            </div>
                        )
                    }

                    <div onClick={leaveCall} style={{ cursor: 'pointer' }}>
                        <div><IoCall  size={25} className='mx-1 text-red-600' /></div>
                        <p className='text-sm text-gray-400'>Leave</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between gap-10 py-10 px-10'>
                <div>

                    <div className={`shadow-md w-90 h-60 rounded-md flex items-center justify-center ${assistantSpeaking ? 'animate-pulse ring-2 ring-indigo-400' : ''}`}>
                        <div>
                            <p className='text-center font-semibold'>Interviewer (AI)</p>
                        </div>
                    </div>

                    <div className='shadow-md w-90 h-60 rounded-md mt-2 overflow-hidden'>
                        {webcam ? (
                            <video ref={videoRef} autoPlay muted playsInline className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                <p>No camera</p>
                            </div>
                        )}
                        <p className='text-center'>You</p>
                    </div>

                </div>
                    
                <div>
                    <div className='flex gap-4'>
                        {showConsole && (
                            <Console 
                                question={questions[currentIndex]}
                                onSubmitAnswer={(payload) => submitAnswer(payload)}
                                onOpenCode={() => { setShowCode(true); setShowConsole(false); }}
                            />
                        )}

                        {showCode && (
                            <Code
                                question={questions[currentIndex]}
                                onSubmitAnswer={(payload) => submitAnswer(payload)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meet;
