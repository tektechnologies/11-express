'use strict';
const requestParser = require('./request-parser');
const router = exports;

const routes = exports.routes = {};


const methods = ['GET','POST','DELETE','PUT'];

methods.forEach(method => { 
  routes[method] = {};

  router[method.toLowerCase()] = (path, callback) => {
    routes[method][path] = callback;
  };
});
router.route =(req, res) => {
  return requestParser(req)
    .then(() => { 
      const methodRoutes = routes[req.method];
      const pathRoute = methodRoutes[req.parsedUrl.pathname];
      // console.log({methodRoutes, pathRoute });
      if(pathRoute){
        pathRoute(req, res);
      }else{
        return Promise.reject(404);
      }
    });
};