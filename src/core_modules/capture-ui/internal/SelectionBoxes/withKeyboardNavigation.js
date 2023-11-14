// @flow
import React, { type ComponentType, useRef, useMemo } from 'react';

const managedKeys = ['Tab', ' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

export type KeyboardManager = {
    managedKeys: Array<string>,
    keyDown: (key: string) => boolean,
    keyUp: (key: string) => void,
    clear: () => void,
};

export const withKeyboardNavigation = () => (InnerComponent: ComponentType<any>) => (props: any) => {
    const pressedKeys = useRef(new Set);

    const keyboardManager = useMemo(() => ({
        managedKeys,
        keyDown: (key: string) => {
            const count = pressedKeys.current.size;
            pressedKeys.current.add(key);
            return count === 0;
        },
        keyUp: (key: string) => {
            pressedKeys.current.delete(key);
        },
        clear: () => {
            pressedKeys.current.clear();
        },
    }), [pressedKeys]);

    return (
        <InnerComponent
            keyboardManager={keyboardManager}
            {...props}
        />
    );
};
