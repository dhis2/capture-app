// @flow
import * as React from 'react';
import { ListViewConfigContext } from './workingLists.context';
import { ListViewConfigMenuContent } from './ListViewConfigMenuContent.component';

type PassOnProps = {
    currentTemplate: Object,
};

type Props = {
    ...PassOnProps,
    children: (currentListIsModified: boolean) => React.Node,
};

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
