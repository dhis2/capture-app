import * as React from 'react';
import { theme } from './theme';

export type WithStyles<S extends Record<string, any> | ((t: typeof theme) => S)> = {
    classes: Record<string, any>;
};

type StylesArg<S extends Record<string, unknown>, T> = S | ((t: T) => S);

export const withStyles =
    <S extends Record<string, unknown>, T = typeof theme>(stylesOrCreator: StylesArg<S, T>) =>
    <P extends Record<string, unknown>>(
            Component: React.ComponentType<P & WithStyles<S>>): React.FC<P & { theme?: T }> => {
        const WithStylesWrapper: React.FC<P & { theme?: T }> = (props: P) => {
            const classes = stylesOrCreator && typeof stylesOrCreator === 'function'
                ? stylesOrCreator(theme as T)
                : stylesOrCreator;

            // Explicitly cast props to satisfy TS
            return <Component {...(props as any)} classes={classes} />;
        };
        return WithStylesWrapper;
    };
