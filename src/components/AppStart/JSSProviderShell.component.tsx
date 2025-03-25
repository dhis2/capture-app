import React, { ReactNode } from 'react';
import { JssProvider } from 'react-jss';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

// Change the insertion point for jss styles.
// For this app the insertion point should be below the css.
const insertionPoint = document.createElement('noscript');
insertionPoint.setAttribute('id', 'jss-insertion-point');
document.head.appendChild(insertionPoint);
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// Add insertionPoint to JSS options
(jss as any).options = {
    ...(jss as any).options || {},
    insertionPoint,
};

interface JSSProviderShellProps {
    children: ReactNode;
}

export const JSSProviderShell: React.FC<JSSProviderShellProps> = ({ children }) => (
    <JssProvider jss={jss} generateId={generateClassName}>
        {children}
    </JssProvider>
);
