// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { Filters } from './Filters.component';
import type { Column, FiltersOnly, AdditionalFilters } from '../types';

const getStyles = () => ({
    filtersButtons: {
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
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
        flexWrap: 'wrap',
    },
    additionalFiltersTitle: {
        color: colors.grey600,
        fontSize: 12,
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
    onRemoveFilter: Function,
    onSelectRestMenuItem: Function,
    stickyFilters: Object,
    shouldRenderAdditionalFiltersButtons: boolean,
    visibleSelectorId: ?string,
    classes: Object,
};

export const FiltersRowsPlain = ({
    columns,
    filtersOnly,
    additionalFilters,
    onUpdateFilter,
    onClearFilter,
    onRemoveFilter,
    onSelectRestMenuItem,
    stickyFilters,
    shouldRenderAdditionalFiltersButtons,
    visibleSelectorId,
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
        {shouldRenderAdditionalFiltersButtons && (
            <>
                <div className={classes.break} />
                <div className={classes.additionalFiltersContainer}>
                    <div className={classes.additionalFiltersTitle}>{i18n.t('Stage filters').toUpperCase()}</div>
                    <div className={classes.break} />
                    <Filters
                        columns={columns.filter(item => item.additionalColumn)}
                        filtersOnly={additionalFilters}
                        onUpdateFilter={onUpdateFilter}
                        onClearFilter={onClearFilter}
                        onSelectRestMenuItem={onSelectRestMenuItem}
                        stickyFilters={stickyFilters}
                        visibleSelectorId={visibleSelectorId}
                        onRemoveFilter={itemId => onRemoveFilter(itemId, stickyFilters.filtersWithValueOnInit)}
                    />
                </div>
            </>
        )}
    </>
);

export const FiltersRowsComponent = withStyles(getStyles)(FiltersRowsPlain);
