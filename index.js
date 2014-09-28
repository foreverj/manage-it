var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manage-it-test');

var Cat = mongoose.model('Cat',{name:String});
var User = mongoose.model('User',{
	email:String,
	password:String,
	salt:String
	});
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var randomString = (function() {
  // Define character classes to pick from randomly.
  var uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lowers = 'abcdefghijklmnopqrstuvwxyz';
  var numbers = '0123456789';
  var specials = '_-|@.,?/!~#$%^&*(){}[]+=';
  var charClasses = [uppers, lowers, numbers, specials];
  var minLen = charClasses.length;
  function chooseRandom(x) {
    var i = Math.floor(Math.random() * x.length);
    return (typeof(x)==='string') ? x.substr(i,1) : x[i];
  }
  // Define the function to actually generate a random string.
  return function(maxLen) {
    maxLen = (maxLen || 36);
    if (maxLen < minLen) { throw new Error('length must be >= ' + minLen); }
    do { // Append a random char from a random char class.
      var str='', usedClasses={}, charClass;
      while (str.length < maxLen) {
        charClass = chooseRandom(charClasses);
        usedClasses[charClass] = true;
        str += chooseRandom(charClass);
      }
      // Ensure we have picked from every char class.
    } while (Object.keys(usedClasses).length !== charClasses.length);
    return str;
  }
})();

var crypto = require('crypto');


app.get('/',function(req,res){
	res.send('Hello World');
});

app.get('/user',function(req,res){
	User.find({},function(err,data){
		if(err){res.json(err);}
		res.json(data);
	});
});

app.post('/user',jsonParser,function(req,res){
	res.set('Content-type','application/json');
	var body=req.body;
	console.log(body);
	var email=body.email;
	var password=body.password;
	var salt=randomString();
	var shasum = crypto.createHash('sha1');
	shasum.update(password+salt);
	password=shasum.digest('hex');
	var newUser=new User({
		email:email,
		password:password,
		salt:salt
	});
	User.find({email:email},function(err,data){
		if(err){console.log(err);}
		if(data.length===0){
			newUser.save(function(err){
				if(err){res.json(err);}
				res.json({email:email,password:password,salt:salt});
			});
		}else{
			res.json({error:'user already existed'});
		}
	});
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
	var name = req.body.name;
	var kitty = new Cat({name:'meow'});
	kitty.save(function(err){
		res.set('Content-type','application/json');
		if(err){res.send(err);}
		res.send({'status':'Cat added'});
	});
});

app.listen(3000);
