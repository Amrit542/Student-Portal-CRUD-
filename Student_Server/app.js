import express from 'express';
import createError from "http-errors";
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from "morgan";
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';
import students_route from "./src/routes/students.js";
import counter_route from "./src/routes/counter.js"

const app = express()
app.use(express.json())
app.use(express.static('frontend'));

const port = process.env.PORT || 5000;

app.use(morgan("common"))

try {

    await mongoose.connect(process.env.DATABASE_URI, {
        dbName: 'AllStudents_db'
    }).then(() => {
        console.log('Successfully connected to Students Database');
    })

    app.listen(port, () => {
        console.log(`Server - Student Application - listening on port ${port}`);
    })
    
} catch (err) {
    console.log('Cannot connect to Students Database');
    console.log(err);
    
    
}

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };

app.use(allowCrossDomain)


app.use('/students', students_route)
app.use('/counter', counter_route)

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // let r = createError(402, 'dfsikghufdh')
    // res.send(r)
    res.locals.message = err.message;
   
  
    
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    // res.render("error");

    
    res.send(err)
    // res.json({msg: err.message})
});





