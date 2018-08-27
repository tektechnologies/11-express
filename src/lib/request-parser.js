'use strict';


const url = require('url');
const queryString = require('querystring');

module.exports = (request) => {
  return new Promise((resolve, reject) => {
    //TODO: validate that request exists
    //TODO: validate that request.url exists
    // console.log('parseraaaaaa');
    request.parsedUrl = url.parse(request.url);
    request.query = queryString.parse(request.parsedUrl.query);
    if(!request.method.match(/POST|PUT|PATCH/)){
      return resolve(request);
    }
    let text = '';
    request.on('data', (buffer) => {
      // console.log('request.on data');
      text += buffer.toString();
    });
    request.on('end', () => {
      //console.log('request.on end');
      request.text = text;
      try{
        switch (request.headers['content-type']){
       
        case 'application/json': 
          request.body = JSON.parse(text);
          break;
        default: 
          request.body = text;
          break;
        }

        resolve(request);

      } catch(err){
        request.body = null;
        // request.text = text;
        reject(err);
      }
    });
    request.on('err', reject);
  });
};
