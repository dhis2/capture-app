/* Custom withStyles HOC that replicates part of Material-UI’s withStyles logic.
This implementation takes a pragmatic approach, with the goal of removing Material-UI and migrating to Emotion as smoothly as possible.
*/
import React, { forwardRef, useMemo } from 'react';
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
    /* Ideally, the correct type would be: Component: React.ComponentType<P>.
         However, Material-UI's withStyles HOC was not type-checked, and using the strict type
         reveals many TypeScript errors that can be addressed in DHIS2-20412.
         Therefore, I choose to use `any` for the wrapped Component to suppress strict TS errors for now.
        */
    <P extends Record<string, unknown>>(Component: React.ComponentType<any>):
        React.ForwardRefExoticComponent<React.PropsWithoutRef<P & { theme?: T }> & React.RefAttributes<any>> => {
        const WithStylesWrapper = forwardRef<any, P & { theme?: T }>((props, ref) => {
            /* Support both the plain style object and a function that gets the theme as a argument */
            const classes = useMemo(() => {
                const rawStyles =
                    stylesOrCreator && typeof stylesOrCreator === 'function'
                        ? stylesOrCreator(theme as T)
                        : stylesOrCreator;
                // Transform the raw style object with Emotion’s css() so that className={classes.label} continues to work as before
                return Object.keys(rawStyles).reduce((acc, key) => {
                    acc[key] = css(rawStyles[key] as any);
                    return acc;
                }, {} as any);
            }, []);

            return option?.withTheme
                ? <Component ref={ref} {...props} classes={classes} theme={theme} />
                : <Component ref={ref} {...props} classes={classes} />;
        });
        return WithStylesWrapper;
    };
