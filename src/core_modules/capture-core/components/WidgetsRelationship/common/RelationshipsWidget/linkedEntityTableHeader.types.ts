import type { Context, TableColumn } from './types';

export type Props = Readonly<{
    columns: readonly TableColumn[];
    context: Context;
}>;
