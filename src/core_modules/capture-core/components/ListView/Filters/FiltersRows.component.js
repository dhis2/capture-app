// @flow
import * as React from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { Filters } from './Filters.component';
import type { Column, FiltersOnly, AdditionalFilters } from '../types';

const getStyles = () => ({
    filtersButtons: {
        display: 'flex',
        alignItems: 'baseline',
    },
    break: {
        flexBasis: '100%',
        height: 0,
    },
    additionalFiltersContainer: {
        backgroundColor: colors.grey100,
        borderRadius: spacersNum.dp4,
        border: `1px solid ${colors.grey400}`,
        marginTop: spacersNum.dp4,
        marginLeft: spacersNum.dp16,
        padding: spacersNum.dp4,
        display: 'flex',
        alignItems: 'baseline',
    },
});

type Props = {
    columns: Array<{
        ...Column,
        additionalColumn?: boolean,
    }>,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
    classes: Object,
};

const shouldRenderAdditionalFiltersButtons = (
    additionalFilters,
    stickyFilters,
) => {
    if (additionalFilters && stickyFilters) {
        const { filtersWithValueOnInit = {}, userSelectedFilters = {} } = stickyFilters;
        const mainButtonAdditionalFilters = additionalFilters.find(filter => filter.mainButton);

        return mainButtonAdditionalFilters &&
        (userSelectedFilters[mainButtonAdditionalFilters.id]
            || filtersWithValueOnInit[mainButtonAdditionalFilters.id]);
    }
    return false;
};

export const FiltersRowsPlain = ({
    columns,
    filtersOnly,
    additionalFilters,
    onUpdateFilter,
    onClearFilter,
    onSelectRestMenuItem,
    stickyFilters,
    classes,
}: Props) => (
    <>
        <div className={classes.filtersButtons}>
            <Filters
                columns={columns.filter(item => !item.additionalColumn)}
                filtersOnly={filtersOnly}
                additionalFilters={additionalFilters}
                onUpdateFilter={onUpdateFilter}
                onClearFilter={onClearFilter}
                onSelectRestMenuItem={onSelectRestMenuItem}
                stickyFilters={stickyFilters}
            />
        </div>
        {shouldRenderAdditionalFiltersButtons(additionalFilters, stickyFilters) && (
            <>
                <div className={classes.break} />
                <div className={classes.additionalFiltersContainer}>
                    <Filters
                        columns={columns.filter(item => item.additionalColumn)}
                        filtersOnly={additionalFilters}
                        onUpdateFilter={onUpdateFilter}
                        onClearFilter={onClearFilter}
                        onSelectRestMenuItem={onSelectRestMenuItem}
                        stickyFilters={stickyFilters}
                    />
                </div>
            </>
        )}
    </>
);

export const FiltersRows = withStyles(getStyles)(FiltersRowsPlain);
