// @flow
import React from 'react';
import { WidgetCollapsible } from './WidgetCollapsible.component';
import { WidgetNonCollapsible } from './WidgetNonCollapsible.component';
import type { Props } from './widget.types';

export const Widget = ({ collapsible = true, className, ...passOnProps }: Props) => (
    collapsible ? (
        // $FlowFixMe doesn't work due to destructering :(
        <div className={className}>
        <WidgetCollapsible
            {...passOnProps}
        /></div>) : (
            // $FlowFixMe doesn't work due to destructering :(
            <WidgetNonCollapsible
                {...passOnProps}
            />)
);
