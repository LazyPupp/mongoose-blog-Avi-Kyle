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
app.get('/posts',(req, res)=>{
  const filter = {};
  const queryFields = ['title','firstName','content','lastName'];
  queryFields.forEach(field=>{
    if(field in req.query){
      if(field === 'firstName'){
        filter.author = {};
        filter.author[field] = req.query[field];
      }
      else if(field === 'lastName'){
        filter.author[field] = req.query[field];
      }
      else{
        filter[field] = req.query[field];
      }
    }
  });
  //right after finding out if they put any querys
  // console.log(req.query["firstName"]);
  // console.log(req.query["lastName"]);
  // Blog.find({author:{firstName:req.query["firstName"] , lastName:req.query["lastName"]}})
  Blog.find(filter)
  .exec()
  .then(posts=>{
    res.json({
      posts: posts.map((post)=>{
        return post.apiRepr();
      })
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

app.get('/posts/:id',(req,res)=>{
  Blog
  .findById(req.params.id)
  .exec()
  .then(posts=>{
    res.json(posts.apiRepr());
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});
//POST
app.post('/posts',(req,res)=>{
  const bodyArr = ['title','content','firstName','lastName'];
  bodyArr.forEach(field=>{
    if(!(field in req.body)){
      const message = 'No first or last name';
      console.error(message);
      return res.status(400).send(message);
    }
  });
  Blog.create({
    title:req.body.title,
    content:req.body.content,
    author:{
      firstName:req.body.firstName,
      lastName:req.body.lastName
    }
  })
  .then(post=>{res.status(201).json(post.apiRepr());})
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});
//PUT
app.put('/posts/:id',(req,res)=>{
  // if(req.body.id !==req.params.id){
  //   const message = 'Id not same! RAGE';
  //   console.error(message);
  //   return res.status(400).send(message);   
  // }
  const updateThisRabbit = {};
  const updateFields = ['title','content','firstName','lastName'];
  updateFields.forEach(field=>{
    if(req.body[field]){
      return updateThisRabbit[field]= req.body[field];
    }
  });
  Blog
  .findByIdAndUpdate(req.params.id,{$set:updateThisRabbit})
  .exec()
  .then(hole=>{
    res.status(204).end();
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});
//DELETE
app.delete('/posts/:id',(req,res)=>{
  Blog
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(kek=> res.status(204).end())
  .catch(err=>{
    console.error(err,'Send nudes');
    res.status(500).json({message:'Internal server error'});
  });
});
let server;
function runServer(databaseUrl=DATABASE_URL,port=PORT){
  return new Promise((resolve,reject)=>{ 
    mongoose.connect(databaseUrl,err=>{
      if(err){
        return reject(err);
      }
      server=app.listen(port,()=>{
        console.log(`You're listening on port ${port}`);
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
}
module.exports= {app,runServer,closeServer};