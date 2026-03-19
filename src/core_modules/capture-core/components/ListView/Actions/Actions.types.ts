import type { ReactNode } from 'react';

export type Props = {
    customTopBarActions?: Array<{ key: string, actionContents: ReactNode}>;
};
