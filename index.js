var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manage-it-test');

var Cat = mongoose.model('Cat',{name:String});

app.get('/',function(req,res){
	res.send('Hello World');
});

app.get('/cat',function(req,res){
	Cat.find({},function(err,data){
		res.set('Content-type','application/json');
		if(err){res.send(err);}
		res.send(data);
		console.log('cat finded');
	});
});

app.post('/cat',function(req,res){
	var body = req.body;
	var name = req.param.name;
	console.log(name);
	var kitty = new Cat({name:'meow'});
	kitty.save(function(err){
		res.set('Content-type','application/json');
		if(err){res.send(err);}
		res.send({'status':'Cat added'});
	});
});

app.listen(3000);
