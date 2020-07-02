import indexedDB from 'fake-indexeddb';
import IndexedDBAdapter from '../IndexedDBAdapter';

const storeName = 'testStore';
const options = { name: 'testDB', version: 2, keyPath: 'id', objectStores: [storeName] };
IndexedDBAdapter.indexedDB = indexedDB;

let testCnt = 0;
beforeEach(() => {
    options.name = `testDB${testCnt}`;
    testCnt += 1;
});

afterEach(() => {
});

it('open IndexedDB without error', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    expect(idbAdapter.isOpen()).toBe(true);
});

it('upgrade IndexedDB and retain some data', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.set(storeName, { id: '1', value: { prop1: 'prop1value' } });
    await idbAdapter.close();

    const idbAdapterVersion2 = new IndexedDBAdapter({
        ...options,
        version: 2,
    });
    let tempValue;
    await idbAdapterVersion2.open(adapter => adapter.get(storeName, '1').then((v) => { tempValue = v; }),
        adapter => adapter.set(storeName, tempValue));
    const valueAfterUpgrade = await idbAdapterVersion2.get(storeName, '1');
    expect(valueAfterUpgrade.value.prop1).toEqual('prop1value');
});

it('close IndexedDB without error', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.close();
});

it('save object without error', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.set(storeName, { id: '3', data: { a: 'a', b: 'b' } });
});

it('get object', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.set(storeName, { id: '3', data: { a: 'a', b: 'b' } });
    const retrievedValue = await idbAdapter.get(storeName, '3');
    expect(retrievedValue.data.a).toEqual('a');
    expect(retrievedValue.data.b).toEqual('b');
});

it('get objects', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const values = await idbAdapter.getAll(storeName);
    expect(values[0].data.a).toEqual('a');
    expect(values[0].data.b).toEqual('b');
});

it('getKeys', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const keys = await idbAdapter.getKeys(storeName);
    expect(keys[0]).toEqual('1');
    expect(keys[1]).toEqual('2');
});

it('contains', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const result = await idbAdapter.contains(storeName, '1');
    expect(result).toEqual(true);
});

it('count', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const count = await idbAdapter.count(storeName);
    expect(count).toEqual(2);
});


it('remove', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    await idbAdapter.remove(storeName, '1');
    const result = await idbAdapter.contains(storeName, '1');
    expect(result).toEqual(false);
});

it('removeAll', async () => {
    const idbAdapter = new IndexedDBAdapter(options);
    await idbAdapter.open();
    await idbAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    await idbAdapter.removeAll(storeName);
    const resultKey1 = await idbAdapter.contains(storeName, '1');
    const resultKey2 = await idbAdapter.contains(storeName, '2');
    expect(resultKey1).toEqual(false);
    expect(resultKey2).toEqual(false);
});

it('set to fail because db not open', async () => {
    expect.assertions(1);
    const idbAdapter = new IndexedDBAdapter(options);
    try {
        await idbAdapter.set(storeName, { id: '1', test });
    } catch (error) {
        expect(error).toBeDefined();
    }
});
