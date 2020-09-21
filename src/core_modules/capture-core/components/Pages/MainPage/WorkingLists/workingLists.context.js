// @flow
import { createContext } from 'react';
import type { ListViewUpdaterContextData } from './workingLists.types';

export const ManagerContext: Object = createContext();
export const ListViewConfigContext: Object = createContext();
export const ListViewLoaderContext: Object = createContext();
export const ListViewUpdaterContext = createContext<ListViewUpdaterContextData>({});
export const ListViewBuilderContext: Object = createContext();
