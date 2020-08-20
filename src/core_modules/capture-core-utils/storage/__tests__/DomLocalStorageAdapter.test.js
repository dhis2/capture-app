import DomLocalStorageAdapter from '../DomLocalStorageAdapter';

const storeName = 'testStore';
const options = { name: 'testDB', version: 1, keyPath: 'id', objectStores: [storeName] };
DomLocalStorageAdapter.localStorage = localStorage;

let testCnt = 0;
beforeEach(() => {
    options.name = `testDB${testCnt}`;
    testCnt += 1;
});

afterEach(() => {
});

it('open local Storage without error', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
});

it('upgrade Local Storage and retain some data', async () => {
    const idbAdapter = new DomLocalStorageAdapter(options);
    await idbAdapter.open();
    await idbAdapter.set(storeName, { id: '1', value: { prop1: 'prop1value' } });
    await idbAdapter.close();

    const idbAdapterVersion2 = new DomLocalStorageAdapter({
        ...options,
        version: 2,
    });
    let tempValue;
    await idbAdapterVersion2.open(adapter => adapter.get(storeName, '1').then((v) => { tempValue = v; }),
        adapter => adapter.set(storeName, tempValue));
    const valueAfterUpgrade = await idbAdapterVersion2.get(storeName, '1');
    expect(valueAfterUpgrade.value.prop1).toEqual('prop1value');
});

it('close local Storage without error', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.close();
});

it('save object without error', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.set(storeName, { id: '3', data: { a: 'a', b: 'b' } });
});

it('get object', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.set(storeName, { id: '3', data: { a: 'a', b: 'b' } });
    const retrievedValue = await lsAdapter.get(storeName, '3');
    expect(retrievedValue.data.a).toEqual('a');
    expect(retrievedValue.data.b).toEqual('b');
});

it('get objects', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const values = await lsAdapter.getAll(storeName);
    expect(values[0].data.a).toEqual('a');
    expect(values[0].data.b).toEqual('b');
});

it('getKeys', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const keys = await lsAdapter.getKeys(storeName);
    expect(keys[0]).toEqual('1');
    expect(keys[1]).toEqual('2');
});

it('contains', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const result = await lsAdapter.contains(storeName, '1');
    expect(result).toEqual(true);
});

it('count', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    const count = await lsAdapter.count(storeName);
    expect(count).toEqual(2);
});


it('remove', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    await lsAdapter.remove(storeName, '1');
    const result = await lsAdapter.contains(storeName, '1');
    expect(result).toEqual(false);
});

it('removeAll', async () => {
    const lsAdapter = new DomLocalStorageAdapter(options);
    await lsAdapter.open();
    await lsAdapter.setAll(storeName, [{ id: '1', data: { a: 'a', b: 'b' } }, { id: '2', data: { a: 'a', b: 'b' } }]);
    await lsAdapter.removeAll(storeName);
    const resultKey1 = await lsAdapter.contains(storeName, '1');
    const resultKey2 = await lsAdapter.contains(storeName, '2');
    expect(resultKey1).toEqual(false);
    expect(resultKey2).toEqual(false);
});
