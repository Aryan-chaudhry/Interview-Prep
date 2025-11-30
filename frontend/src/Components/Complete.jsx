import React from "react";
import { useLocation, useParams } from "react-router-dom";

const Complete = () => {
    const { token: routeToken } = useParams();
    const location = useLocation();
    const passedToken = location?.state?.token;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-20">
            {passedToken === routeToken ? (
                <h1 className="text-green-500 text-3xl text-center leading-relaxed">
                     Thanks for giving the Interview  
                    <br />Your result will be shared in your Profile.
                </h1>
            ) : (
                <h1 className="text-center">
                    <span className="text-green-500 text-8xl">404</span>
                    <br />
                    <span className="text-white text-xl opacity-70">
                        This page does not exist.
                    </span>
                </h1>
            )}
        </div>
    );
};

export default Complete;
