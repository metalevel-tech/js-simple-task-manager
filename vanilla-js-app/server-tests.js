const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const util = require('util');

const port = 3500;
const dbPath = 'data';
const dbFile = 'db.json';
const filePath = path.join(__dirname, dbPath, dbFile);

// Create the app (http server) object
const app = express();

// GET requests tweak: https://stackoverflow.com/questions/32679505/node-and-express-send-json-formatted
app.set('json spaces', 2);

// POST requests tweak: req.body: Contains key-value pairs of data submitted in the request body.
// By default, it is undefined, and is populated when you use body-parsing
// middleware such as body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the app as bundle of static files, https://expressjs.com/en/starter/static-files.html
app.use('/', express.static('public'))

// Read the database
const readJsonDb = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        return data;
    }));
};
const jsonDb = readJsonDb(filePath);

// Write the database
const writeJsonDb = (table, tableData) => {
    jsonDb[table] = tableData;
    fs.writeFileSync(filePath, JSON.stringify(jsonDb), 'utf8', function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        // return true;
    });
    return readJsonDb(filePath)[table];
}

// GET requests handler
const getRequestsHandler = (uri, data) => {
    app.get(`/${uri}`, function (req, res) {
        console.log(`GET: /${uri}`);
        
        res.json(data);
        res.end();
    });
};

// https://stackoverflow.com/questions/58816095/node-js-express-cannot-set-headers-after-they-are-sent-to-the-client
// $ curl -X POST -d 'a=1&b=2' 'http://127.0.0.1:8080/query'
// POST requests handler
const postRequestsHandler = (uri, data) => {
    app.post(`/${uri}`, function (req, res) {
        console.log(`POST: /${uri}`);
        res.sendStatus(200);
        
        const newTask = req.body;
        newTask.id = data.reduce((acc, task) => (task.id > acc) ? acc = task.id : acc, 0) + 1;
        
        data.push(newTask);

        data = writeJsonDb(uri, data);

        // res.header('Content-Type', 'application/json');
        console.log(data.find(task => task.id === newTask.id));
        res.json(data.find(task => task.id === newTask.id));
        
        
        // fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        // console.log(newTask, generateNewTaskId(data));
        // res.json(body);
        // res.send(`${JSON.stringify(body)}\n`);
        res.end();
    });
};

// Launch the requests listeners (handlers)
for (const key in jsonDb) {
    const tableUri = `${key}`;
    const tableData = jsonDb[key];
    getRequestsHandler(tableUri, tableData);

    if (key !== 'tasks') continue;
    
    postRequestsHandler(`${tableUri}`, tableData);

    for (const item of tableData) {
        if (item.id) {
            const itemUri = `${tableUri}/${item.id}`;
            const itemData = item;
            getRequestsHandler(itemUri, itemData);
        }
    }
}


// Start the server
app.listen(port, function () {
    const host = this.address().address;
    const port = this.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});





////////////////////////////////////////////////////////////////////////////////

// fs.readFile(path.join(__dirname, "data", "db.json"), 'utf8', function (err, data) {
//     if (err) {
//         console.log(err);
//         process.exit(1);
//     }
//     return JSON.parse(data);
// });

////////////////////////////////////////////////////////////////////////////////

// ## GET --- here we could return a HTML page with a form to add a new item
// This responds with "Hello World" on the homepage
// $ curl 'http://127.0.0.1:8080'
// app.get('/', function (req, res) {
//     console.log("Got a GET request for the homepage");
//     res.send('Hello GET!\n');
// });


// $ curl 'http://127.0.0.1:8080/query?a=1&b=2'
app.get('/query', function (req, res) {
    console.log("Got a GET request for the page /query");
    const query = req.query;
    // res.json({query);
    res.send(`${JSON.stringify(query)}\n`);
});


//---



// ## DELETE
// This responds a DELETE request for the /del_user page.
// $ curl -X DELETE 'http://127.0.0.1:8080/del_user'
app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE!\n');
});




// const server = app.listen(port, function () {
//     const host = server.address().address;
//     const port = server.address().port;

//     console.log('Example app listening at http://%s:%s', host, port);
// });

