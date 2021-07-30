// @flow
import { withStyles } from '@material-ui/core';
import React, { type ComponentType, useState } from 'react';
import type { Props } from './WidgetManagements.types';
import { WidgetManagementsComponent } from './WidgetManagements.component';
import { useManagements } from './hooks/useManagements';

const styles = {

};

const WidgetManagementsContainer = ({ enrollmentId }: Props) => {
    const { error, refetch, managements } = useManagements({ enrollmentId });
    const [filter, setFilter] = useState('');

    const handleFilterChange = (newFilter) => {
        if (filter !== newFilter) {
            refetch({ variables: { filter: newFilter } });
            setFilter(newFilter);
        } else {
            refetch({ variables: { filter: '' } });
            setFilter('');
        }
    };

    return (
        <WidgetManagementsComponent
            managements={managements}
            filterStatus={filter}
            error={error}
            handleFilterChange={handleFilterChange}
        />
    );
};

export const WidgetManagements: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(WidgetManagementsContainer);
