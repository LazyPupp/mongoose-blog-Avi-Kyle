'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
//Make Mongoose use Promises from ES6 to make sure it works
mongoose.Promise=global.Promise;
const{PORT,DATABASE_URL}=require('./config');
const{Blog}=require('./models.js');
const app=express();
app.use(bodyParser.json());
//GET
//POST
//PUT
//DELETE
let server;
function runServer(databaseUrl=DATABASE_URL,port=PORT){
    return new Promise((resolve,reject)=>{ 
        mongoose.connect(databaseUrl,err=>{
            if(err){
                return reject(err);
            }
            server=app.listen(port,()=>{
                console.log(`You're listening on port ${port}`)
                resolve();
            }).on('error',err=>{
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}
function closeServer(){
    return mongoose.disconnect().then(()=>{
        return new Promise((resolve,reject)=>{
            console.log('Good night');
            server.close(err=>{
                if(err){
                    return reject(err);
                }
                resolve();
            });
        });
    });
}
if (require.main===module){
    runServer().catch(err=>console.error(err));
};
module.exports(app,runServer,closeServer);