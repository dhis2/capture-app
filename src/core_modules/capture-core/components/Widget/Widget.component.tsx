import React from 'react';
import { WidgetCollapsible } from './WidgetCollapsible.component';
import { WidgetNonCollapsible } from './WidgetNonCollapsible.component';
import type { Props } from './widget.types';

export const Widget = ({ noncollapsible = false, ...passOnProps }: Props) => {
    if (!noncollapsible) {
        const collapsibleProps = passOnProps as React.ComponentProps<typeof WidgetCollapsible>;
        return (
            <div>
                <WidgetCollapsible
                    {...collapsibleProps}
                />
            </div>
        );
    }
    const nonCollapsibleProps = passOnProps as React.ComponentProps<typeof WidgetNonCollapsible>;
    return (
        <div>
            <WidgetNonCollapsible
                {...nonCollapsibleProps}
            />
        </div>
    );
};
