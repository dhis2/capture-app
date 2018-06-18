// @flow
import * as React from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '../../../../Buttons/Button.component';
import FilterSelectorContents from './Contents/FilterSelectorContents.component';
import { filterTypesArray } from './filterTypes';

import type { Column } from '../ListWrapper/EventsListWrapper.component';

type Props = {
    columns: ?Array<Column>,
    onEditContents: (value: any, itemId: string) => void,
    onSetFilter: (requestData: any, appliedText: string, itemId: string) => void,
};

type State = {
    filterSelectorOpen: ?{
        id: string,
        anchorElement: Object,
    },
};

const INDIVIDUAL_DISPLAY_COUNT = 4;

const POPOVER_ANCHOR_ORIGIN = {
    vertical: 'bottom',
    horizontal: 'center',
};
const POPOVER_TRANSFORM_ORIGIN = {
    vertical: 'top',
    horizontal: 'center',
};

export default (InnerComponent: React.ComponentType<any>) =>
    class EventListFilterSelectors extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                filterSelectorOpen: null,
            };
        }

        openFilterSelector(column: Column, event: Event) {
            this.setState({
                filterSelectorOpen: {
                    id: column.id,
                    anchorElement: event.currentTarget,
                },
            });
        }

        renderConcatenatedSelectorButton(columns: Array<Column>) {
            return [];
        }

        renderIndividualFilterSelectorButtons(columns: Array<Column>) {
            return columns
                .map(
                    column => (
                        <Button
                            key={column.id}
                            variant="raised"
                            color="default"
                            onClick={(event: Event) => this.openFilterSelector(column, event)}
                        >
                            {column.header}
                        </Button>
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

        handleCloseFilterSelector = () => {
            this.setState({ filterSelectorOpen: null });
        }

        handleEditContents = (value: any) => {
            this.props.onEditContents(value, this.state.filterSelectorOpen.id);
        }

        handleSetFilter = (requestData: any, appliedText: string, itemId: string) => {
            this.props.onSetFilter(requestData, appliedText, itemId);
            this.handleCloseFilterSelector();
        }

        renderSelectorContents() {
            const id = this.state.filterSelectorOpen && this.state.filterSelectorOpen.id;
            const column = this.props.columns && this.props.columns.find(col => col.id === id);
            const type = column && column.type;

            if (!type) {
                return null;
            }

            return (
                <FilterSelectorContents
                    type={type}
                    id={id}
                    onEdit={this.handleEditContents}
                    onUpdate={this.handleSetFilter}
                />
            );
        }

        render() {
            const { ...passOnProps } = this.props;
            const { filterSelectorOpen } = this.state;
            const filterButtons = this.renderFilterSelectorButtons();

            return (
                <React.Fragment>
                    {filterButtons}
                    <InnerComponent
                        {...passOnProps}
                    />
                    <Popover
                        open={!!filterSelectorOpen}
                        anchorEl={filterSelectorOpen && filterSelectorOpen.anchorElement}
                        onClose={this.handleCloseFilterSelector}
                        anchorOrigin={POPOVER_ANCHOR_ORIGIN}
                        transformOrigin={POPOVER_TRANSFORM_ORIGIN}
                    >
                        {
                            (() => {
                                if (filterSelectorOpen) {
                                    return this.renderSelectorContents();
                                }
                                return null;
                            })()
                        }
                    </Popover>
                </React.Fragment>
            );
        }
    };
