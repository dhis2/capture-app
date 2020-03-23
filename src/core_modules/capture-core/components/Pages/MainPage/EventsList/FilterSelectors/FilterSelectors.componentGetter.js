// @flow
import * as React from 'react';
import Filters from './Filters.component';

export default (InnerComponent: React.ComponentType<any>) =>
// $FlowFixMe
    (props) => {
        const { columns, stickyFilters, listId, onRestMenuItemSelected } = props;
        return (
            <InnerComponent
                {...props}
                filterButtons={
                    <Filters
                        columns={columns}
                        stickyFilters={stickyFilters}
                        listId={listId}
                        onRestMenuItemSelected={onRestMenuItemSelected}
                    />
                }
            />
        );
    };
