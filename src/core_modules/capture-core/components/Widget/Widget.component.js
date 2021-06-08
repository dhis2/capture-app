// @flow
import React from 'react';
import { WidgetCollapsible } from './WidgetCollapsible.component';
import { WidgetNonCollapsible } from './WidgetNonCollapsible.component';
import type { Props } from './widget.types';

export const Widget = ({ collapsible = true, className, ...passOnProps }: Props) => (
    collapsible ? (
        <div className={className}>
            { /* $FlowFixMe */ }
            <WidgetCollapsible
                {...passOnProps}
            />
        </div>) :
        (<div className={className}>
            { /* $FlowFixMe */ }
            <WidgetNonCollapsible
                {...passOnProps}
            />
        </div>)
);
