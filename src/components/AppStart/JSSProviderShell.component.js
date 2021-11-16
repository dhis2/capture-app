// @flow
import React from 'react';
import { JssProvider } from 'react-jss';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

// Change the insertion point for jss styles.
// For this app the insertion point should be below the css.
const insertionPoint = document.createElement('noscript');
insertionPoint.setAttribute('id', 'jss-insertion-point');
// $FlowFixMe
document.head.appendChild(insertionPoint);
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// $FlowFixMe
jss.options.insertionPoint = insertionPoint;

type Props = {
    children: React$Node,
};

export const JSSProviderShell = ({ children }: Props) => (
    <JssProvider jss={jss} generateId={generateClassName}>
        {children}
    </JssProvider>
);
