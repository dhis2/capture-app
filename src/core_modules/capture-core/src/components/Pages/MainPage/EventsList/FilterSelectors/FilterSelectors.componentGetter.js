// @flow
import * as React from 'react';

import FilterButton from './FilterButton/FilterButton.container';
import { filterTypesArray } from './filterTypes';

import type { Column } from '../ListWrapper/EventsListWrapper.component';

type Props = {
    columns: ?Array<Column>,
};

const INDIVIDUAL_DISPLAY_COUNT = 4;

export default (InnerComponent: React.ComponentType<any>) =>
    class EventListFilterSelectors extends React.Component<Props> {
        static renderConcatenatedSelectorButton(columns: Array<Column>) {
            return [];
        }

        static renderIndividualFilterSelectorButtons(columns: Array<Column>) {
            return columns
                .map(
                    column => (
                        <span
                            key={column.id}
                        >
                            <FilterButton
                                itemId={column.id}
                                type={column.type}
                                title={column.header}
                            />
                        </span>
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

            const individualFilterSelectorButtons = EventListFilterSelectors.renderIndividualFilterSelectorButtons(columnsForIndividualDisplay);
            const concatenatedFilterSelectorButton = EventListFilterSelectors.renderConcatenatedSelectorButton(columnsForConcatenatedDisplay);
            return [
                ...individualFilterSelectorButtons,
                ...concatenatedFilterSelectorButton,
            ];
        }

        render() {
            const { ...passOnProps } = this.props;
            const filterButtons = this.renderFilterSelectorButtons();

            return (
                <React.Fragment>
                    {filterButtons}
                    <InnerComponent
                        {...passOnProps}
                    />
                </React.Fragment>
            );
        }
    };
