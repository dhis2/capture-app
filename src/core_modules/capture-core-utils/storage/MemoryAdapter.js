/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { errorCreator } from '../errorCreator';

class MemoryAdapter {
  static errorMessages = {
    INVALID_STORE_NAME: 'Invalid store name',
    KEY_BASED_COUNT_IS_NOT_SUPPORTED: 'Key based count is not supported by DomLocalStorageAdapter',
  };

  static isSupported() {
    return true;
  }

  constructor(options) {
    this.name = options.name;
    this.version = options.version || 1;
    this.objectStoreNames = options.objectStores;
    this.keyPath = options.keyPath;
    this.opened = false;
  }

  open() {
    this.storage = this.objectStoreNames.reduce((accStorage, name) => {
      accStorage[name] = new Map();
      return accStorage;
    }, {});
    this.opened = true;
  }

  _executeSet(store, dataObject) {
    const key = dataObject[this.keyPath];
    store.set(key, dataObject);
  }

  set(storeName, dataObject) {
    const store = this.storage[storeName];
    this._executeSet(store, dataObject);
  }

  setAll(storeName, dataArray) {
    const store = this.storage[storeName];
    dataArray.forEach((dataObject) => {
      this._executeSet(store, dataObject);
    });
  }

  get(storeName, key) {
    const store = this.storage[storeName];
    const dataObject = store.get(key);
    return dataObject;
  }

  getAll(storeName, options) {
    const store = this.storage[storeName];
    const values = Array.from(store.values());
    const { predicate, project, onEditSource } = options || {};

    const source = onEditSource ? onEditSource(values, MemoryAdapter) : values;
    const filteredValues = predicate ? source.filter(predicate) : source;
    return project ? filteredValues.map(project) : filteredValues;
  }

  getKeys(storeName) {
    const store = this.storage[storeName];
    const keys = Array.from(store.keys());
    return keys;
  }

  contains(storeName, key) {
    const store = this.storage[storeName];
    return store.has(key);
  }

  count(storeName, key) {
    if (key) {
      throw Error(
        errorCreator(MemoryAdapter.errorMessages.KEY_BASED_COUNT_IS_NOT_SUPPORTED)({
          adapter: this,
        }),
      );
    }
    const store = this.storage[storeName];
    return store.size;
  }

  remove(storeName, key) {
    const store = this.storage[storeName];
    store.delete(key);
  }

  removeAll(storeName) {
    this.storage[storeName] = new Map();
  }

  close() {
    this.opened = false;
  }

  destroy() {
    this.opened = false;
    this.storage = this.objectStoreNames.reduce((accStorage, name) => {
      accStorage[name] = new Map();
      return accStorage;
    }, {});
  }

  isOpen() {
    return this.opened;
  }
}

export default MemoryAdapter;
