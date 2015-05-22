var express = require('express'),
	path = require('path');

var app = express();
app.use(express.static('public'));

app.get('/', function (req, res, next) {
	res.sendFile('home.html', {root: './public'});
});

app.use(function(req, res){
       res.sendFile('home.html', {root: './public'});
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
