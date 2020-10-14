// @flow
import React from 'react';
import { ListViewConfigContext } from '../workingLists.context';
import { ListViewConfigMenuContent } from '../ListViewConfigMenuContent';
import type { Props } from './listViewConfig.types';

export const ListViewConfig = (props: Props) => {
    const { children, ...passOnProps } = props;
    const {
        currentViewHasTemplateChanges,
        ...passOnContext
    } = React.useContext(ListViewConfigContext);

    return (
        <React.Fragment>
            {children(currentViewHasTemplateChanges)}
            <ListViewConfigMenuContent
                {...passOnProps}
                {...passOnContext}
                currentViewHasTemplateChanges={currentViewHasTemplateChanges}
            />
        </React.Fragment>
    );
};
