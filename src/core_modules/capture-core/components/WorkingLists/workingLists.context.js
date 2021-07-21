// @flow
import { createContext } from 'react';
import type {
    ManagerContextData,
    ListViewConfigContextData,
    ListViewLoaderContextData,
    ListViewUpdaterContextData,
    ListViewBuilderContextData,
} from './workingLists.types';

export const ManagerContext = createContext<?ManagerContextData>();
export const ListViewConfigContext = createContext<?ListViewConfigContextData>();
export const ListViewLoaderContext = createContext<?ListViewLoaderContextData>();
export const ListViewUpdaterContext = createContext<?ListViewUpdaterContextData>();
export const ListViewBuilderContext = createContext<?ListViewBuilderContextData>();
