import IndexedDBAdapter from './IndexedDBAdapter';
import DomLocalStorageAdapter from './DomLocalStorageAdapter';
import MemoryAdapter from './MemoryAdapter';

export default {
    INDEXED_DB: IndexedDBAdapter,
    LOCAL_STORAGE: DomLocalStorageAdapter,
    MEMORY: MemoryAdapter,
};
