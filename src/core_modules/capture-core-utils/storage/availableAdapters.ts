import { DomLocalStorageAdapter } from './DomLocalStorageAdapter';
import { IndexedDBAdapter } from './IndexedDBAdapter';
import { MemoryAdapter } from './MemoryAdapter';

export const availableAdapters = [
    IndexedDBAdapter,
    DomLocalStorageAdapter,
    MemoryAdapter,
]; 