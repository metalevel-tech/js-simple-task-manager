# Simple Task Manager

Simple JavaScript/React application - a homework project, and currently it is:

* Exercise of REST API Requests

* Node.js and Express

* React.js

## Development deploy and run

Start the backend server. Currently it is implementation of Express that provides Json-server.

```bash
cd server
npm install
npm run supervisor
```

Currently, the Express server will run at `http://localhost:48004` and will provide the Json-server at `http://localhost:48004/api[/tasks]`.

```bash
cd app
npm install
npm start
```

The React's dev web server, by default, will run at `http://localhost:3000` and will proxy all requests for non static resources to the Express server's port. So we can access the Json-server at `http://localhost:3000/api[/tasks]`.

## Production build and run

In this case we need to build the React application. Then it will be served via the Express server. and everything will be accessible at `http://localhost:48004`.

```bash
cd app && npm i && npm run build
cd -
cd server && npm i && npm start
```

## Json-server

The application [json-server](https://github.com/typicode/json-server) is used as backend database server. It is provided via Express.

### Json-server references

* Video Tutorial: [Creating demo APIs with json-server](https://egghead.io/lessons/javascript-creating-demo-apis-with-json-server)

* Official docs: [json-server](https://github.com/typicode/json-server)

* [Postman](https://www.postman.com/downloads/) - an API platform for building and using APIs. Postman simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs—faster.

* [`npm install package-name --save-dev` not updating `package.json`](https://stackoverflow.com/a/62706498/6543935)

* [integrate json-server with express server](https://github.com/typicode/json-server/issues/253)

### Json-server basic requests

|Method |Path       |Action             |
| ---   | ---       | ---               |
|GET    |/tasks     |get all tasks      |
|GET    |/tasks/id  |get Todo by id     |
|POST   |/tasks     |add new Todo       |
|PUT    |/tasks/id  |update Todo by id  |
|DELETE |/tasks/id  |remove Todo by id  |
