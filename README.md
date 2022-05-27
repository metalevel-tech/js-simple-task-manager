# Simple Task Manager

Simple JavaScript/React application it is a homework project, and currently it is:

* Exercise of REST API Requests

* Node.js and Express

* React.js

## Deploy and run

```bash
cd express
mpm install
npm run watch # npm start
```

Currently, the Express server will run at `http://localhost:48004` and will provide the Json-server at `http://localhost:48004/api[/tasks]`.

```bash
cd app
mpm install
npm start
```

The React's dev web server will run at `http://localhost:3000` and will proxy all requests for non static resources to the Express server's port. So we can access the Json-server at `http://localhost:3000/api[/tasks]`.

## Json-server

The application [json-server](https://github.com/typicode/json-server) is used as backend database server. It is provided via Express.

### Json-server references

* Video Tutorial: [Creating demo APIs with json-server](https://egghead.io/lessons/javascript-creating-demo-apis-with-json-server)

* Official docs: [json-server](https://github.com/typicode/json-server)

* [Postman](https://www.postman.com/downloads/) - an API platform for building and using APIs. Postman simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs—faster.

* [`npm install packagename --save-dev` not updating `package.json`](https://stackoverflow.com/a/62706498/6543935)

* [integrate json-server with express server](https://github.com/typicode/json-server/issues/253)

### Json-server basic requests


|Method |Path       |Action             |
| ---   | ---       | ---               |
|GET	|/todos	    |get all todos      |
|GET	|/todos/id	|get Todo by id     |
|POST	|/todos	    |add new Todo       |
|PUT	|/todos/id	|update Todo by id  |
|DELETE	|/todos/id	|remove Todo by id  |
