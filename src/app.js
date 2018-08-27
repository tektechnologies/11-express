'use strict';

const http = require('http');
const cowsay = require('cowsay');
const requestParser = require('./lib/request-parser');
const router = require('./lib/router');


const app = http.createServer(requestHandler);
module.exports = app;
app.start = (port) => 
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if(err) {
        rejectCallback(err);
      }else{ 
        resolveCallback(result);
      }
    });
  });


function requestHandler(req,res){
  console.log(`${req.method} ${req.url}`);

  router.route(req, res)
    .catch(err => {
      if(err === 404){
        notFound(res);
        return;
      }
      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });
  router.post('/500', (req, res) => {
    throw new Error('Test Error');
  });
  router.get('/', (req, res) => {
    html(res, '<html><body><h1>HOME</h1></body></html>');
  });
  router.post('/api/cowsay', (req, res) => {
    json(res, {message: `Hello, ${req.body.text}!`,
    });
  });

  require('./routes/api');


  function html(res, content, statusCode = 200, statusMessage = 'OK'){
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    res.setHeader('Content-Type', 'text/html');
    res.write(content);
    res.end();
  }
  function json (res, object){
    if(object){
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(object));
      res.end();
    }else{ 
      res.statusCode = 400;
    }
  }
  function notFound(res){
    res.statusCode = 404;
    res.statusMessage = 'Not Found';
    res.setHeader('Content-Type', 'text/html');
    res.write('Resource Not Found');
    res.end();
  }
}