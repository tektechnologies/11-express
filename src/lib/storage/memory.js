'use strict';
const uuid = require('uuid/v4');

class MemoryStorage {
  constructor(schema) {
    this.schema = schema;
    this.data = {};
  }

  save(document) {
    if (typeof document !== 'object') {
      return Promise.reject(new Error(
        `Failed to save non-object in schema "${this.schema}"`
      ));
    }
    document.id = uuid();
    this.data[document.id] = document;
    console.log('saved', this);
    return Promise.resolve(document);
  }

  get(id) {
    return new Promise((resolve, reject) => {
      var result = this.data[id];
      if (result) {
        resolve(result);
      } else {
        reject(new Error(
          `Document with id "${id}" in schema "${this.schema}" not found`
        ));
      }
    });
  }

  getAll() {
    return Promise.resolve(
      Object.values(this.data)
    );
  }
}

module.exports = MemoryStorage;