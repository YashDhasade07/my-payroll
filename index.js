import express from "express";
import cors from 'cors'
import indexRouter from "./src/routes/index.js"
import { connectUsingMongoose } from './src/config/mongoose.js';
import ApplicationError from "./src/middleware/applicationError.js";
import redisService from './src/services/redis.service.js';

let app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);


app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message)
    }
    res.status(500).send('Something went wrong')
})

app.use((req, res) => {
    res.status(404).send('Requset API not found')

})

app.listen(3020, async ()=>{
    console.log('Server is listening on port 3020'); 
    connectUsingMongoose();
    try {
        await redisService.initialize();
    } catch (error) {
        console.log('Continuing without Redis');
    }
})