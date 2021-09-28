//hme.route.js
const express = require('express');
const mongoose = require('mongoose');
const passport =require('passport');
const authRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const fs = require('fs');
const crypto = require('crypto');
const uniqid = require('uniqid');
const path = require('path');
// require models
let Admin = require('../models/Admin.js');
let User = require('../models/user.js');


getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
//**default render method */
authRoutes.get('/', (req,res,next) => {
  //console.log(distDir + '/index.html')
  res.send('test')
})

//** login method*/
authRoutes.post('/adminlogin', (req,res,next) => {
  Admin.findOne(
    {
      ID: req.body.email
    }, 
    (err, user) => {
      if(err) throw err;

      if(!user) {
        res.status(401).send({
          sucess: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err){
            let token = jwt.sign(user.ID, config.secret);

            res.status(200).send({success: true, token: 'Bearer ' + token});
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  )
});

//** sign up method 나중에 ip체크같은 방법으로 막을 필요 있음 */ 
authRoutes.post('/adminsignup', (req,res)=>{
  //console.log(req.body);
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {

      let newItem = new Admin();
      newItem._id = new mongoose.Types.ObjectId();
      newItem.ID = req.body.email;
      newItem.PW = key.toString('base64');
      newItem.salt = buf.toString('base64');
      newItem.nickName = uniqid('cornte-');
      if(!fs.existsSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString()))){
        fs.mkdirSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString()));
      }
      const defaultimage = fs.readFileSync(__dirname + '/default-profile.png');
      fs.writeFileSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString() + '/default.png') , defaultimage);
      
      newItem.proImage.dataurl = '/../assets/profileimage/' + newItem._id.toString() + '/default.png';
      newItem.proImage.contentType = 'image/png';

      Admin.findOne(
        {ID: req.body.ID}, (err,result)=>{
          if(err){
            console.log(err);
            throw err;
          } 
          if(!result){
            newItem.save();
            console.log('done');
            res.status(200).send({
              success: true,
              msg: 'The request was successfully completed.'
            });
          }else{
            res.status(400).send({
              success: false,
              msg: 'Already exist. send different ID.'
            });
          }
        }
      )
    });
  });
})

//* user login method /
authRoutes.post('/userlogin', (req,res,next) => {
  User.findOne(
    {
      ID: req.body.email
    }, 
    (err, user) => {
      if(err) throw err;

      if(!user) {
        res.status(401).send({
          sucess: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err){
            let token = jwt.sign(user.ID, config.secret);

            res.status(200).send({success: true, token: 'Bearer ' + token});
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  )
});

//** sign up method */ 
authRoutes.post('/usersignup', (req,res)=>{
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {

      let newItem = new User();
      newItem._id = new mongoose.Types.ObjectId();
      newItem.ID = req.body.email;
      newItem.PW = key.toString('base64');
      newItem.salt = buf.toString('base64');
      newItem.nickName = uniqid('cornte-');
      if(!fs.existsSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString()))){
        fs.mkdirSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString()));
      }
      const defaultimage = fs.readFileSync(__dirname + '/default-profile.png');
      fs.writeFileSync(path.normalize(__dirname + '/../assets/profileimage/' + newItem._id.toString() + '/default.png') , defaultimage);
      
      newItem.proImage.dataurl = '/../assets/profileimage/' + newItem._id.toString() + '/default.png';
      newItem.proImage.contentType = 'image/png';

      User.findOne(
        {ID: req.body.ID}, (err,result)=>{
          if(err){
            console.log(err);
            throw err;
          } 
          if(!result){
            newItem.save();
            console.log('done');
            res.status(200).send({
              success: true,
              msg: 'The request was successfully completed.'
            });
          }else{
            res.status(400).send({
              success: false,
              msg: 'Already exist. send different ID.'
            });
          }
        }
      )
    });
  });
})

module.exports = authRoutes;