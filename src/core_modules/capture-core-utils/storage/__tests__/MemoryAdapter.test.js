import MemoryAdapter from '../MemoryAdapter';

const storeName = 'testStore';
const options = {
  name: 'testDB',
  version: 1,
  keyPath: 'id',
  objectStores: [storeName],
};

let testCnt = 0;
beforeEach(() => {
  options.name = `testDB${testCnt}`;
  testCnt += 1;
});

afterEach(() => {});

it('set object without error', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  adapter.set(storeName, { id: 1, value: { name: 'test ' } });
});

it('set and retrieve', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore = { id: 1, value: { name: 'test ' } };
  adapter.set(storeName, objectToStore);
  const retrievedObject = adapter.get(storeName, 1);
  expect(retrievedObject.id).toEqual(objectToStore.id);
  expect(retrievedObject.value).toEqual(objectToStore.value);
});

it('get all', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  const retrievedObjects = adapter.getAll(storeName);
  expect(retrievedObjects[0].id).toEqual(objectToStore1.id);
  expect(retrievedObjects[1].id).toEqual(objectToStore2.id);
});

it('set all without error', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  const objectsToStore = [objectToStore1, objectToStore2];
  adapter.setAll(storeName, objectsToStore);
});

it('get keys', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  const retrievedKeys = adapter.getKeys(storeName);
  expect(retrievedKeys[0]).toEqual(objectToStore1.id);
  expect(retrievedKeys[1]).toEqual(objectToStore2.id);
});

it('contains', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  expect(adapter.contains(storeName, 1)).toBeTruthy();
  expect(adapter.contains(storeName, 2)).toBeTruthy();
});

it('count', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  expect(adapter.count(storeName)).toBe(2);
});

it('remove', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  adapter.remove(storeName, 1);
  expect(adapter.contains(storeName, 1)).toBeFalsy();
});

it('remove all', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  adapter.removeAll(storeName);
  expect(adapter.count(storeName)).toBe(0);
});

it('destroy', () => {
  const adapter = new MemoryAdapter(options);
  adapter.open();
  const objectToStore1 = { id: 1, value: { name: 'test' } };
  const objectToStore2 = { id: 2, value: { name: 'test2' } };
  adapter.set(storeName, objectToStore1);
  adapter.set(storeName, objectToStore2);
  adapter.destroy();
  expect(adapter.count(storeName)).toBe(0);
});
