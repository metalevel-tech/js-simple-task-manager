var express = require('express');
var jsonServer = require('json-server');

var app = express();
// ...

// Serve the app as bundle of static files, https://expressjs.com/en/starter/static-files.html
app.use('/', express.static('public'))

// You may want to mount JSON Server on a specific end-point, for example /api
// Optional except if you want to have JSON Server defaults
// server.use('/api', jsonServer.defaults()); 
app.use('/', jsonServer.router('data/db.json'));

app.listen(48011);