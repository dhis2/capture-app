// @flow
import React from 'react';
import type { Props } from './widget.types';
import { WidgetCollapsible } from './WidgetCollapsible.component';
import { WidgetNonCollapsible } from './WidgetNonCollapsible.component';

export const Widget = ({ noncollapsible = false, ...passOnProps }: Props) => (
    !noncollapsible ? (
        <div>
            { /* $FlowFixMe */ }
            <WidgetCollapsible
                {...passOnProps}
            />
        </div>) :
        (<div>
            { /* $FlowFixMe */ }
            <WidgetNonCollapsible
                {...passOnProps}
            />
        </div>)
);
