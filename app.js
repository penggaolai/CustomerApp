var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var expressValidator=require('express-validator');
var mongojs=require('mongojs');
var db=mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app=express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.locals.errors=null;
	next();
});
//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users=[
	{id: 1, first_name: 'Rich', last_name: 'Lau', email: 'rjlau1@gmail.com'},
	{id: 2, first_name: 'Gaolai', last_name: 'Peng', email: 'gpeng1@northwell.edu'},
	{id: 3, first_name: 'Jaeda', last_name: 'Lau', email: ''},
	{id: 4, first_name: 'Eden', last_name: 'Lau', email: ''}
]
app.get('/', function(req, res){
	db.users.find(function (err, docs) {
		// docs is an array of all the documents in mycollection
		console.log(docs);
		res.render('index', {
			title: 'Customers',
			users: docs
		});		
	})

});

app.post('/users/add', function(req, res){
	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty()

	var errors=req.validationErrors();
	if (errors){
		res.render('index', {
		title: 'Customers',
		users: users,
		errors: errors
	});
	} else{
		var newUser={
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		db.users.insert(newUser, function(err, result){
			if (err){
				console.log(err);
			}
			res.redirect('/');
		});
	}
});

app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id);
	
	db.users.remove({"_id": ObjectId(req.params.id)}, function(err, result){
		if (err){
			console.log(err);
		}
		res.redirect('/');
	});

});

app.listen(3000, function(){
	console.log("Server started on port 3000...");
});