// @flow
import * as React from 'react';
import { theme } from '../../../../styles/theme';

type Props = {
    contentClassName?: ?string,
    children: React.Node,
};

export const BorderBox = (props: Props) => {
    const { children, contentClassName } = props;
    return (
        <div className="borderBox">
            <div className={contentClassName}>
                {children}
            </div>
            <style jsx>{`
                .borderBox {
                    border-radius: ${theme.typography.pxToRem(6)};
                    border-width: ${theme.typography.pxToRem(2)};
                    border-color: #e0e0e0;
                    border-style: solid;
                }
            `}</style>
        </div>
    );
};

