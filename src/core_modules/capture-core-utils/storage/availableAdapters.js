import { MemoryAdapter } from './MemoryAdapter';
import { IndexedDBAdapter } from './IndexedDBAdapter';
import { DomLocalStorageAdapter } from './DomLocalStorageAdapter';

export const availableAdapters = {
    INDEXED_DB: IndexedDBAdapter,
    LOCAL_STORAGE: DomLocalStorageAdapter,
    MEMORY: MemoryAdapter,
};
