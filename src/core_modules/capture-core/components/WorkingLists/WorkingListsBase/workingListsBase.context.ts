import { createContext } from 'react';
import type {
    ManagerContextData,
    ListViewConfigContextData,
    ListViewLoaderContextData,
    ListViewUpdaterContextData,
    ListViewBuilderContextData,
} from './workingListsBase.types';

export const ManagerContext = createContext<ManagerContextData | null>(null);
export const ListViewConfigContext = createContext<ListViewConfigContextData | null>(null);
export const ListViewLoaderContext = createContext<ListViewLoaderContextData | null>(null);
export const ListViewUpdaterContext = createContext<ListViewUpdaterContextData | null>(null);
export const ListViewBuilderContext = createContext<ListViewBuilderContextData | null>(null);
