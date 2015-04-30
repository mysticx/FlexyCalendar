var express = require('express'),
	mongoskin = require('mongoskin'),
  	bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser());

var db = mongoskin.db('mongodb://@localhost:27017/flexy_calendar_db', {safe:true})

app.get('/', function (req, res, next) {
	res.render('home');
})

app.get('/test', function (req, res, next) {
	db.collection('events').find().toArray(function (e, result) {
		debugger;
		if (e) {
			return next(e);
		}

		res.send(result)
	});
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
