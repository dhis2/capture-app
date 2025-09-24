/* Custom withTheme HOC that replicates part of Material-UI’s withTheme logic.
This implementation takes a pragmatic approach, with the goal of removing Material-UI and migrating to Emotion as smoothly as possible.
Emotion provides a useTheme hook, but its withTheme is used as withTheme(Component), whereas Material-UI’s version is invoked as withTheme()(Component).
*/

import * as React from 'react';
import { theme } from './theme';

export type WithTheme = {
    theme: typeof theme;
};

export const withTheme = () =>
    function withThemeWrapper<P extends Record<string, any>>(
    /* Ideally, the correct type would be: Component: React.ComponentType<P & WithTheme>.
    However, Material-UI's withTheme HOC was not type-checked, and using the strict type
    reveals many TypeScript errors that can be addressed later.
    Therefore, I choose to use `any` for the wrapped Component to suppress strict TS errors for now.
    */
        Component: React.ComponentType<any>,
    ): React.FC<P> {
        const WithThemeWrapper: React.FC<P> = props => (
            <Component {...props} theme={theme} />
        );

        return WithThemeWrapper;
    };
