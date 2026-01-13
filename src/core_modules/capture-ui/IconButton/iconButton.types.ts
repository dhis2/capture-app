import type { ReactNode } from 'react';

export type PlainProps = {
    children: ReactNode;
    className?: string;
    dataTest?: string;
    disabled?: boolean;
    onClick: (
        event:
            | React.KeyboardEvent<HTMLButtonElement>
            | React.MouseEvent<HTMLButtonElement>
            | React.TouchEvent<HTMLButtonElement>
    ) => void;
};
