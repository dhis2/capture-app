// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import FilterButton from './FilterButton/FilterButton.container';
import FilterRestMenu from './FilterRestMenu/FilterRestMenu.component';
import { filterTypesArray } from './filterTypes';

import type { Column } from '../ListWrapper/EventsListWrapper.component';

const getStyles = (theme: Theme) => ({
    filterButtonContainer: {
        paddingRight: theme.typography.pxToRem(theme.spacing.unit),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit / 2),
        paddingTop: theme.typography.pxToRem(theme.spacing.unit / 2),
    },
});

type Props = {
    columns: ?Array<Column>,
    userSelectedFilters: { [id: string]: string },
    onRestMenuItemSelected: (id: string) => void,
    classes: {
        filterButtonContainer: string,
    },
};

const INDIVIDUAL_DISPLAY_COUNT = 4;

export default (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class EventListFilterSelectors extends React.Component<Props> {
        static getCalculatedIndividiualColumns(filterColumns: Array<Column>) {
            const visibleColumns = filterColumns
                .filter(c => c.visible);

            if (visibleColumns.length < INDIVIDUAL_DISPLAY_COUNT) {
                const hiddenColumns = filterColumns
                    .filter(c => !c.visible);
                const columnsVisibleFirst = [...visibleColumns, ...hiddenColumns];
                return columnsVisibleFirst
                    .slice(
                        0,
                        columnsVisibleFirst.length >= INDIVIDUAL_DISPLAY_COUNT ?
                            INDIVIDUAL_DISPLAY_COUNT :
                            columnsVisibleFirst.length,
                    );
            }

            return visibleColumns.slice(0, INDIVIDUAL_DISPLAY_COUNT);
        }

        static getRestColumns(allColumns: Array<Column>, displayedColumns: Array<Column>) {
            return allColumns
                .filter(c => displayedColumns.every(dc => dc !== c));
        }

        getUserSelectedColumns(allColumns: Array<Column>, calculatedColumns: Array<Column>): Array<Column> {
            const userSelectedFilters = this.props.userSelectedFilters;
            return allColumns
                .filter(ac => calculatedColumns.every(cc => cc !== ac))
                .filter(c => userSelectedFilters[c.id]);
        }

        renderConcatenatedSelectorButton(columns: Array<Column>) {
            if (!columns || columns.length === 0) {
                return null;
            }

            return (
                <FilterRestMenu
                    key={'restMenu'}
                    columns={columns}
                    onItemSelected={this.props.onRestMenuItemSelected}
                />
            );
        }

        renderIndividualFilterSelectorButtons(columns: Array<Column>) {
            const classes = this.props.classes;
            return columns
                .map(
                    column => (
                        <div
                            key={column.id}
                            className={classes.filterButtonContainer}
                        >
                            <FilterButton
                                itemId={column.id}
                                type={column.type}
                                title={column.header}
                                optionSet={column.optionSet}
                            />
                        </div>
                    ),
                );
        }

        renderFilterSelectorButtons() {
            const columns = this.props.columns;

            if (!columns) {
                return null;
            }

            const filterColumns = columns
                .filter(column => filterTypesArray.includes(column.type));

            const calculatedFilterColumns = EventListFilterSelectors.getCalculatedIndividiualColumns(filterColumns);
            const columnsForIndividualDisplay = [
                ...calculatedFilterColumns,
                ...this.getUserSelectedColumns(filterColumns, calculatedFilterColumns),
            ];
            const columnsForConcatenatedDisplay =
                EventListFilterSelectors.getRestColumns(filterColumns, columnsForIndividualDisplay);

            const individualFilterSelectorButtons =
                this.renderIndividualFilterSelectorButtons(columnsForIndividualDisplay);
            const restFilterSelectorButton =
                this.renderConcatenatedSelectorButton(columnsForConcatenatedDisplay);
            return restFilterSelectorButton ?
                [
                    ...individualFilterSelectorButtons,
                    restFilterSelectorButton,
                ] :
                individualFilterSelectorButtons;
        }

        render() {
            const { classes, userSelectedFilters, ...passOnProps } = this.props;
            const filterButtons = this.renderFilterSelectorButtons();

            return (
                <React.Fragment>
                    <InnerComponent
                        filterButtons={filterButtons}
                        {...passOnProps}
                    />
                </React.Fragment>
            );
        }
    });
