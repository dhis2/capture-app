/* Custom withStyles HOC that replicates part of Material-UI’s withStyles logic.
This implementation takes a pragmatic approach, with the goal of removing Material-UI and migrating to Emotion as smoothly as possible.
*/
import * as React from 'react';
import { css } from '@emotion/css';
import { theme } from './theme';

export type WithStyles<S extends Record<string, any> | ((t: typeof theme) => S)> = {
    classes: Record<string, any>;
};

type StylesArg<S extends Record<string, unknown>, T> = S | ((t: T) => S);

type Options = {
    withTheme?: boolean;
}

export const withStyles =
    <S extends Record<string, unknown>, T = typeof theme>(stylesOrCreator: StylesArg<S, T>, option?: Options) =>
    <P extends Record<string, unknown>>(
        /* Ideally, the correct type would be: Component: React.ComponentType<P & WithStyles<S>>.
         However, Material-UI's withStyles HOC was not type-checked, and using the strict type
         reveals many TypeScript errors that can be addressed later.
         Therefore, I choose to use `any` for the wrapped Component to suppress strict TS errors for now.
        */
            Component: React.ComponentType<any>): React.FC<P & { theme?: T }> => {
        const WithStylesWrapper: React.FC<P & { theme?: T }> = (props: P) => {
            /* Support both the plain style object and a function that gets the theme as a argument */
            const rawStyles = stylesOrCreator && typeof stylesOrCreator === 'function'
                ? stylesOrCreator(theme as T)
                : stylesOrCreator;

            // Transform the raw style object with Emotion’s css() so that className={classes.label} continues to work as before
            const classes = Object.keys(rawStyles).reduce((acc, key) => {
                acc[key] = css(rawStyles[key] as any);
                return acc;
            }, {} as any);

            return option?.withTheme
                ? <Component {...props} classes={classes} theme={theme} />
                : <Component {...props} classes={classes} />;
        };
        return WithStylesWrapper;
    };
