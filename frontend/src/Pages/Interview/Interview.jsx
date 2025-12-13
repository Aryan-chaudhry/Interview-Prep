import React, {useState} from 'react'
import {Loader} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../Store/useAuthStore';
import PageNotFound from '../PageNotFound'
import { useLocation } from "react-router-dom";
import Join from './join';


const Interview = () => {
    const location = useLocation();
    const {authUser} = useAuthStore();
    const [joinInterview, setInterview] = useState(false);

    // validate the route using frontend
    const {id} = useParams();
    const userId = authUser?._id || null;

    // if(id !== userId){
    //     return (
    //        <PageNotFound/>
    //     )
    // }

    const job = location.state?.job;
    const Resume = location.state?.resumeContent;
   


    return (
        <div>
            {
                !joinInterview ?
                <Join job={job} joined={joinInterview}/>
                :
                <div>
                    hi
                </div>
            }
        </div>
    )
}

export default Interview
