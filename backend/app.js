const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const jobsData = require('./Jobs/alljobs.json');
const jobModel = require('./Models/jobModel');

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());


const connectDB = async () => {
    try {
        mongoose.connect(MONGO_URI);
        console.log('DataBase Connected Successfully');
    } catch (error) {
        clg.error('Database connection error:',error);
    }
};

connectDB();

const addJobs = async () => {
    try {
        await jobModel.deleteMany();
        const jobs = await jobModel.insertMany(jobsData);
        console.log('Jobs added:', jobs.length);        
    } catch (error) {   
        console.error('Error adding jobs:', error.message || error);
    }
}   

// addJobs();

// Mount API routers
const jobsRouter = require('./Routers/jobsRouter');
const InterviewRouter = require('./Routers/Interview');
app.use('/api', jobsRouter);
app.use('/api', InterviewRouter);


// basic root
app.get('/', (req, res) => res.send('Hello world'));

app.listen(PORT, (req, res) => {
    console.log(`Server running on http://localhost:${PORT}`);
})