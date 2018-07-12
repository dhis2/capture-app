// @flow
import * as React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';

import FilterButton from './FilterButton/FilterButton.container';
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
    classes: {
        filterButtonContainer: string,
    },
};

const INDIVIDUAL_DISPLAY_COUNT = 4;

export default (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class EventListFilterSelectors extends React.Component<Props> {
        renderConcatenatedSelectorButton(columns: Array<Column>) {
            return [];
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

            const columnsForIndividualDisplay = filterColumns.slice(0, filterColumns.length > INDIVIDUAL_DISPLAY_COUNT ? INDIVIDUAL_DISPLAY_COUNT : filterColumns.length);
            const columnsForConcatenatedDisplay = filterColumns.length > INDIVIDUAL_DISPLAY_COUNT ? filterColumns.slice(INDIVIDUAL_DISPLAY_COUNT, filterColumns.length) : [];

            const individualFilterSelectorButtons = this.renderIndividualFilterSelectorButtons(columnsForIndividualDisplay);
            const concatenatedFilterSelectorButton = this.renderConcatenatedSelectorButton(columnsForConcatenatedDisplay);
            return [
                ...individualFilterSelectorButtons,
                ...concatenatedFilterSelectorButton,
            ];
        }

        render() {
            const { classes, ...passOnProps } = this.props;
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
