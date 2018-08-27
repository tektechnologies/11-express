'use strict';

const os = require('os');
const fs = require('fs');
const readFilePromise = promisify(fs.readFile);
const readdirPromise = promisify(fs.readdir);
const writeFilePromise = promisify(fs.writeFile);
const uuid = require('uuid/v4');


class FilesystemStorage {
  constructor(schema){

    this.schema = schema;

    this.path = `${os.tmpdir}/${this.schema}`;
    console.log({path: this.path});
    try{
      fs.mkdirSync(this.path);
    }catch (err){
      if(err.code !== 'EEXIST')
        throw err;
    }
  }

  save(document){
    if(typeof document !== 'object'){
      return Promise.reject(new Error(
        `Failed to save non- object in schema '${this.schema}'`
      ));
    }
    document.id = uuid();
    let path = `${this.path}/${document.id}.json`;
    return writeFilePromise(
      path, 
      JSON.stringify(document)
    ).then(() => {
      return document;
    });
  }
  get(id){
    let path = `${this.path}/${id}.json`;
    return readFilePromise(path)
      .then(data => {
        return JSON.parse(data);
      })
      .catch(err => {
        if(err.code === 'ENOENT')
          return Promise.reject(new Error(
            `Document with id ${id} in schema '${this.schema}' not found`
          ));
        return Promise.reject(err);
      });
  }

  getAll(){
    return readdirPromise(this.path)
      .then(files => {
        console.log({files});
        return Promise.all(
          files.map(file => this.get(file.substring(0, file.length-5)))
        );
      })
      .catch(err => {
        console.error(err);
        return[];
      });
  }
}
module.exports = FilesystemStorage;

function promisify(asyncFunction){
  return(...args) =>
    new Promise((resolve, reject) => {
      asyncFunction(...args, (err, result) => {
        if(err) {reject(err); }
        else{resolve(result); }
      });
    });
}