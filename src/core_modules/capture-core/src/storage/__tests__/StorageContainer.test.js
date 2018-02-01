import StorageContainer from '../StorageContainer';
import availableAdapters from '../availableAdapters';

import indexedDB from 'fake-indexeddb';
import IndexedDBAdapter from '../IndexedDBAdapter';

IndexedDBAdapter.indexedDB = indexedDB;
IndexedDBAdapter.iDBKeyRange = {};
IndexedDBAdapter.iDBTransaction = {};

let dbName = 'testDB';
const storeNames = ['testStore', 'testStore2'];
const Adapters = [availableAdapters.INDEXED_DB, availableAdapters.LOCAL_STORAGE];


let testCnt = 0;
let storageContainer;
beforeEach(() => {
    dbName = `testDB${testCnt}`;
    testCnt += 1;
    storageContainer = new StorageContainer(dbName, Adapters, storeNames);
});

afterEach(async () => {
    await storageContainer.close();
});


it('open and close storageContainer', async () => {
    await storageContainer.open();
    await storageContainer.close();
});

it('set data', async () => {
    await storageContainer.open();
    await storageContainer.set('testStore', { id: '1', name: 'test' });
});

it('set all data', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
});

it('get data', async () => {
    await storageContainer.open();
    await storageContainer.set(storeNames[0], { id: '1', name: 'test' });
    const contents = await storageContainer.get(storeNames[0], '1');
    expect(contents.name).toEqual('test');
});

it('get all data', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const contents = await storageContainer.getAll(storeNames[0]);
    expect(contents[0].name).toEqual('test');
    expect(contents[1].name).toEqual('test2');
});

it('remove', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageContainer.remove(storeNames[0], '1');
    const contents = await storageContainer.getAll(storeNames[0]);
    expect(contents[0].name).toEqual('test2');
});

it('removeAll', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageContainer.removeAll(storeNames[0]);
    const contents = await storageContainer.getAll(storeNames[0]);
    expect(contents[0]).toBeUndefined();
});

it('contains', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageContainer.contains(storeNames[0], '1');
});

it('count', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const count = await storageContainer.count(storeNames[0]);
    expect(count).toEqual(2);
});

it('getKeys', async () => {
    await storageContainer.open();
    await storageContainer.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const keys = await storageContainer.getKeys(storeNames[0]);
    expect(keys[0]).toEqual('1');
    expect(keys[1]).toEqual('2');
});
