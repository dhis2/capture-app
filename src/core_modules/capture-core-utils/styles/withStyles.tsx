import * as React from 'react';

export type WithStyles<S extends Record<string, unknown>> = {
    classes: S;
};

export const withStyles = <S extends Record<string, unknown>>(classes: S) => {
    function withStylesWrapper<P extends Record<string, unknown>>(
        Component: React.ComponentType<P & WithStyles<S>>,
    ): React.FC<P> {
        const WithStylesWrapperComponent: React.FC<P> = function WithStylesWrapperComponent(props: P) {
            // Explicitly cast props to satisfy TS
            return <Component {...(props as any)} classes={classes} />;
        };
        return WithStylesWrapperComponent;
    }
    return withStylesWrapper;
};

