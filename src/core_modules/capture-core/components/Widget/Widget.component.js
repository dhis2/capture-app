// @flow
import React from 'react';
import { WidgetCollapsible } from './WidgetCollapsible.component';
import { WidgetNonCollapsible } from './WidgetNonCollapsible.component';
import type { Props } from './widget.types';

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
