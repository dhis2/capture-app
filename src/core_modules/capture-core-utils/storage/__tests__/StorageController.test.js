import indexedDB from 'fake-indexeddb';
import { StorageController } from '../StorageController';
import { availableAdapters } from '../availableAdapters';
import { IndexedDBAdapter } from '../IndexedDBAdapter';
import '../../extensions/asyncForEachArray';

IndexedDBAdapter.indexedDB = indexedDB;
IndexedDBAdapter.iDBKeyRange = {};
IndexedDBAdapter.iDBTransaction = {};

let dbName = 'testDB';
const storeNames = ['testStore', 'testStore2'];
const Adapters = [availableAdapters.INDEXED_DB, availableAdapters.LOCAL_STORAGE, availableAdapters.MEMORY];

let testCnt = 0;
let storageController;
beforeEach(() => {
    dbName = `testDB${testCnt}`;
    testCnt += 1;
    storageController = new StorageController(dbName, 2, { Adapters, objectStores: storeNames });
});

afterEach(async () => {
    await storageController.close();
});

it('open and close storageContainer', async () => {
    await storageController.open();
    await storageController.close();
});

it('set data', async () => {
    await storageController.open();
    await storageController.set('testStore', { id: '1', name: 'test' });
});

it('set data on unopened adapater', async () => {
    let errorEncountered = 0;
    try {
        await storageController.set('testStore', { id: '1', name: 'test' });
    } catch (error) {
        errorEncountered += 1;
    }
    expect(errorEncountered).toBe(1);
});

it('set all data', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
});

it('get data', async () => {
    await storageController.open();
    await storageController.set(storeNames[0], { id: '1', name: 'test' });
    const contents = await storageController.get(storeNames[0], '1');
    expect(contents.name).toEqual('test');
});

it('get all data', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const contents = await storageController.getAll(storeNames[0]);
    expect(contents[0].name).toEqual('test');
    expect(contents[1].name).toEqual('test2');
});

it('remove', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageController.remove(storeNames[0], '1');
    const contents = await storageController.getAll(storeNames[0]);
    expect(contents[0].name).toEqual('test2');
});

it('removeAll', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageController.removeAll(storeNames[0]);
    const contents = await storageController.getAll(storeNames[0]);
    expect(contents[0]).toBeUndefined();
});

it('contains', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    await storageController.contains(storeNames[0], '1');
});

it('count', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const count = await storageController.count(storeNames[0]);
    expect(count).toEqual(2);
});

it('getKeys', async () => {
    await storageController.open();
    await storageController.setAll(storeNames[0], [{ id: '1', name: 'test' }, { id: '2', name: 'test2' }]);
    const keys = await storageController.getKeys(storeNames[0]);
    expect(keys[0]).toEqual('1');
    expect(keys[1]).toEqual('2');
});

it('set to fail because db not open', async () => {
    expect.assertions(1);
    try {
        await storageController.set(storeNames[0], { id: '1', test });
    } catch (error) {
        expect(error).toBeDefined();
    }
});
