import React, { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Rating from "react-rating";
import { IoIosStar } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const Complete = () => {
    const location = useLocation();
    const { token } = useParams();
    const tokenFromState = location.state?.token;

    const [value, setValue] = useState(0);
    const [feedback, setFeedback] = useState("");

    const submitFeedback = async () => {
        if (value === 0) {
            toast.error("Please provide a star rating before submitting.");
            return;
        }

        // Simulate submit
        toast.success("Thanks for your feedback — we'll show results on your profile soon.");
        setValue(0);
        setFeedback("");
    };

    if (token !== tokenFromState) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900">
                <div className="text-center">
                    <h1 className="text-8xl font-bold text-green-400">404</h1>
                    <p className="mt-4 text-gray-400">Result not found or token mismatch.</p>
                    <Link to="/" className="inline-block mt-6 px-4 py-2 bg-gray-700 text-white rounded-md">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-950 to-zinc-900 p-6">
            <div className="w-full max-w-2xl bg-white/5 border border-zinc-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Rate Your Interview</h2>
                        <p className="text-sm text-gray-400 mt-1">Your feedback helps us improve — short and honest please.</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-sm text-gray-300">Overall Rating</label>
                    <div className="mt-2 flex items-center gap-3">
                        <Rating
                            initialRating={value}
                            onChange={(val) => setValue(val)}
                            emptySymbol={<IoStarOutline className="text-gray-400 hover:scale-110 transition-transform duration-150 mx-1" size={36} />}
                            fullSymbol={<IoIosStar className="text-yellow-400 hover:scale-110 transition-transform duration-150" size={36} />}
                        />
                        <div className="text-sm text-gray-300">{value > 0 ? `${value} / 5` : "Not rated yet"}</div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-sm text-gray-300">Feedback (optional)</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        placeholder="Share what went well or what could improve..."
                        className="mt-2 w-full bg-transparent border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="text-xs text-gray-500 mt-2 text-right">{feedback.length}/500</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button
                        onClick={submitFeedback}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow"
                    >
                        Submit
                    </button>

                    <div className="text-sm text-gray-400">Thank you for helping us improve.</div>
                </div>
            </div>
        </div>
    );
};

export default Complete;

