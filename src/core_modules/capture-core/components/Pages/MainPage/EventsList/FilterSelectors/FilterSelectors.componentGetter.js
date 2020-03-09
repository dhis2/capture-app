// @flow
import * as React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
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
    listId: string,
    elementConfigs: Map<string, Column>,
    userSelectedFilters: ?{ [id: string]: string },
    filters: ?Object,
    onRestMenuItemSelected: (id: string) => void,
    classes: {
        filterButtonContainer: string,
    },
};

const INDIVIDUAL_DISPLAY_COUNT = 4;

export default (InnerComponent: React.ComponentType<any>) =>
// $FlowFixMe
    withStyles(getStyles)(class EventListFilterSelectors extends React.Component<Props> {
        static splitBasedOnHasValue(elementConfigs: Map<string, Column>, filters: ?Object) {
            const filtersNotEmpty = filters || {};
            return Object
                .keys(filtersNotEmpty)
                .reduce((acc, key) => {
                    const config = elementConfigs.get(key);

                    if (!config) {
                        log.error(
                            errorCreator('a filter with no config element was found')({
                                key,
                                value: filtersNotEmpty[key],
                            }),
                        );
                        return acc;
                    }

                    acc.individualElements.set(key, config);
                    acc.restElements.delete(key);
                    return acc;
                }, {
                    individualElements: new Map(),
                    restElements: new Map(elementConfigs.entries()),
                });
        }

        static addUserSelectedFiltersToIndividual(
            individualElements: Map<string, Column>,
            restElements: Map<string, Column>,
            userSelectedFilters: ?Object) {
            const userSelectedFiltersNonEmpty = userSelectedFilters || {};
            
            return Object
                .keys(userSelectedFiltersNonEmpty)
                .reduce((acc, key) => {
                    const config = restElements.get(key);
                    if (!config) {
                        if (!individualElements.has(key)) {
                            log.error(
                                errorCreator('a userSelectedFilter was specified but no config element was found')({
                                    key,
                                })
                            )
                        }
                        return acc;
                    }

                    acc.individualElements.set(key, config);
                    acc.restElements.delete(key);
                    return acc;
                }, {
                    individualElements,
                    restElements,
                });
        }

        static fillUpIndividualElements(
            individualElements: Map<string, Column>,
            restElements: Map<string, Column>,
        ) {
            const restElementsArrayByVisibility =
                [...restElements.entries()]
                    .map((entry, index) => ({
                        element: entry[1],
                        index,
                    }))
                    .sort((a, b) => {
                        const aVisibility = !!a.element.visible;
                        const bVisibility = !!b.element.visible;

                        if (aVisibility === bVisibility) {
                            return a.index - b.index;
                        }

                        if (aVisibility) {
                            return 1;
                        }

                        return -1;
                    });
            
            for (let index = 0; index < restElementsArrayByVisibility.length && individualElements.size < INDIVIDUAL_DISPLAY_COUNT; index++) {
                const restElement = restElementsArrayByVisibility[index];
                individualElements.set(restElement.element.id, restElement.element);
                restElements.delete(restElement.element.id);
            }

            return {
                individualElements,
                restElements,
            };
        }


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
            const userSelectedFilters = this.props.userSelectedFilters || {};
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
                    listId={this.props.listId}
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
                                listId={this.props.listId}
                                itemId={column.id}
                                type={column.type}
                                title={column.header}
                                optionSet={column.optionSet}
                                singleSelect={column.singleSelect}
                            />
                        </div>
                    ),
                );
        }

        calculateFilters() {
            const { elementConfigs, filters, userSelectedFilters } = this.props;

            const validTypeElements = elementConfigs
                .filter(config => filterTypesArray.includes(config.type));

            const { individualElements, restElements } = EventListFilterSelectors.splitBasedOnHasValue(validTypeElements, filters);
            const { individualElements, restElements } = EventListFilterSelectors.addUserSelectedFiltersToIndividual(individualElements, restElements, userSelectedFilters);
            const { individualElements, restElements } = EventListFilterSelectors.fillUpIndividualElements(individualElements, restElements);

            return {
                individualElements,
                restElements,
            };
        }

        renderFilterSelectorButtons() {
            const { individualElements, restElements } = this.calculateFilters();

            if (!columns) {
                return null;
            }

            const validTypeColumns = columns
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
