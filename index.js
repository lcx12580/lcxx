"use strict";
var MongoClient = require('mongodb').MongoClient;
var express = require("express");
var path = require("path");

var mongodb_url = "mongodb://localhost:27017/";
var http_port = 8000;
var dbo;
var app = express();
app.use(express.static(path.join(__dirname, 'web/')))

function initHttpServer()
{
	app.listen(http_port, () => console.log('Listening http on port: '+http_port));   
    app.all("*",function(req,res,next){
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","content-type");
        res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
        if (req.method.toLowerCase() === 'options')
            res.status(200).send("OK")  //让options尝试请求快速结束
        else
            next();
    });
    app.get("/getAll",function(req,res){
        dbo.collection("order").find().toArray(function(err, result) { 
            if (err){res.send("error");return;}
            alert(result)
            res.send(result);
        });
    });
    app.get("/addOrder",function(req,res){
        var d=req.query;
        dbo.collection("order").insertOne(d,function(err, result) {
            if (err) {res.send("error");return;}
            res.send("ok");
        });
    });
}

MongoClient.connect(mongodb_url, {useNewUrlParser:true}, function(err, db) {
    if (err)
    {
        console.log('initdb error ');
        return;
    } 
    dbo = db.db("ms");
    console.log("mongodb connected");
    initHttpServer();
});


 

 

