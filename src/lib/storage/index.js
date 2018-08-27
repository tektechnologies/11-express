'use strict';
switch(process.env.STORAGE){
case 'fs':
  module.exports = require('./fs');
  break;
default:
  module.exports = require('./memory');
  break;
}