/* Custom withTheme HOC that replicates part of Material-UI’s withTheme logic.
This implementation takes a pragmatic approach, with the goal of removing Material-UI and migrating to Emotion as smoothly as possible.
Emotion provides a useTheme hook, but its withTheme is used as withTheme(Component), whereas Material-UI’s version is invoked as withTheme()(Component).
*/

import React, { forwardRef } from 'react';
import { theme } from './theme';

export type WithTheme = {
    theme: typeof theme;
};

export const withTheme = () =>
    /* Ideally, the correct type would be: Component: React.ComponentType<P>.
    However, Material-UI's withTheme HOC was not type-checked, and using the strict type
    reveals many TypeScript errors that can be addressed in DHIS2-20412.
    Therefore, I choose to use `any` for the wrapped Component to suppress strict TS errors for now.
    */
    <P extends Record<string, unknown>>(Component: React.ComponentType<any>): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<any>
  > => {
        const WithThemeWrapper = forwardRef<any, P>((props, ref) => (
            <Component ref={ref} {...props} theme={theme} />
        ));

        return WithThemeWrapper;
    };
