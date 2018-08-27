'use strict';
const Storage = require('../lib/storage');
const cowStore = new Storage('cows');

class Cow{
  constructor(obj){
    this.title = obj.title;
    this.content = obj.content;
  }


  save(){
    return cowStore.save(this);

  }


  static fetchAll(){
    return cowStore.getAll();
  }

  static findById(id){
    return cowStore.get(id);
  }
}

module.exports = Cow;