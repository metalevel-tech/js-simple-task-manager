const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var jsonServer = require('json-server');

const app = express();
const appPort = 48004;
const appName = 'Simple task manager';

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public/')));;

// You may want to mount JSON Server on a specific end-point, for example /api
// Optional except if you want to have JSON Server defaults
// server.use('/api', jsonServer.defaults()); 
app.use('/', jsonServer.router(path.join(__dirname, 'data/db.json')));

app.listen(appPort, function () {
    console.log(`${appName} app listening on port ${appPort}!`);
});