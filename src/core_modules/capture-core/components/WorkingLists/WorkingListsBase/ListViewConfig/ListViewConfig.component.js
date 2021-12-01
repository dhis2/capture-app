// @flow
import React, { useContext } from 'react';
import { ListViewConfigMenuContent } from '../ListViewConfigMenuContent';
import { ListViewConfigContext } from '../workingListsBase.context';
import type { Props } from './listViewConfig.types';

export const ListViewConfig = (props: Props) => {
    const { children, ...passOnProps } = props;
    const context = useContext(ListViewConfigContext);
    if (!context) {
        throw Error('missing ListViewConfigContext');
    }

    const {
        currentViewHasTemplateChanges,
        ...passOnContext
    } = context;

    return (
        <React.Fragment>
            {children(!!currentViewHasTemplateChanges)}
            <ListViewConfigMenuContent
                {...passOnProps}
                {...passOnContext}
                currentViewHasTemplateChanges={!!currentViewHasTemplateChanges}
            />
        </React.Fragment>
    );
};
