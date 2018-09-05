'use strict';

import Memory from './memory';
import FileSystem from './fs';
let Storage = null;
switch(process.env.STORAGE){
case 'fs':
  Storage = FileSystem;
  break;
default:
  Storage = Memory;
  break;
}
export default Storage;