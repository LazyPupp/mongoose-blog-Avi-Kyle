'use strict';

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title:{type:String, required:true },
  content:{type:String, required:true},
  author:{
    firstName:{type:String, required:true},
    lastName:{type:String, required:true}
  }
});

blogSchema.virtual('fullName').get(function(){
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.apiRepr = function(){
  return {
    id:this.id,
    title: this.title,
    content: this.content,
    fullName: this.fullName
  };
};

const Blog = mongoose.model('Blog',blogSchema);
module.exports =  {Blog};