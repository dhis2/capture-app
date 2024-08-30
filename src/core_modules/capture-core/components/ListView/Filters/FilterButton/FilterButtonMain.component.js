// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DropdownButton, FlyoutMenu } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { ActiveFilterButton } from './ActiveFilterButton.component';
import { FilterSelectorContents } from '../Contents';
import type { UpdateFilter, ClearFilter, RemoveFilter } from '../../types';
import type { FilterData, Options } from '../../../FiltersForTypes';

const getStyles = (theme: Theme) => ({
    icon: {
        fontSize: theme.typography.pxToRem(20),
        paddingLeft: theme.typography.pxToRem(5),
    },
    inactiveFilterButton: {
        backgroundColor: '#f5f5f5',
    },
    inactiveFilterButtonLabel: {
        textTransform: 'none',
    },
});

type Props = {
    itemId: string,
    type: string,
    options?: ?Options,
    multiValueFilter?: boolean,
    title: string,
    classes: {
        icon: string,
        inactiveFilterButton: string,
        inactiveFilterButtonLabel: string,
    },
    onUpdateFilter: UpdateFilter,
    onClearFilter: ClearFilter,
    onRemoveFilter: RemoveFilter,
    isRemovable?: boolean,
    onSetVisibleSelector: Function,
    filterValue?: FilterData,
    buttonText?: string,
    disabled?: boolean,
    tooltipContent?: string,
};

type State = {
    isMounted: boolean,
};

class FilterButtonMainPlain extends Component<Props, State> {
    activeFilterButtonInstance: ?any;
    anchorRef: { current: null | HTMLDivElement };
    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false,
        };
        this.anchorRef = React.createRef();
    }

    componentDidMount() {
        this.setState({  // eslint-disable-line
            isMounted: true,
        });
    }

    openFilterSelector = () => {
        const { itemId, onSetVisibleSelector } = this.props;
        onSetVisibleSelector(itemId);

        // onmouseleave is sometimes triggered when the popover opens, and sometimes not triggered at all (not even when the mouse actually leaves the button). Clears the hover here to avoid it remaining hovered.
        if (this.props.filterValue) {
            this.activeFilterButtonInstance && this.activeFilterButtonInstance.clearIsHovered();
        }
    }

    closeFilterSelector = () => {
        const { onSetVisibleSelector } = this.props;
        onSetVisibleSelector(undefined);
    }

    onClose = () => {
        this.handleFilterUpdate(null);
    }

    onRemove = () => {
        const { itemId, onRemoveFilter } = this.props;
        this.closeFilterSelector();
        onRemoveFilter && onRemoveFilter(itemId);
    }

    handleFilterUpdate = (data: ?FilterData) => {
        const { itemId, onUpdateFilter, onClearFilter } = this.props;
        if (data == null) {
            onClearFilter(itemId);
        } else {
            onUpdateFilter(data, itemId);
        }
        this.closeFilterSelector();
    }

    handleClearFilter = () => {
        const { itemId, onClearFilter } = this.props;
        onClearFilter(itemId);
    }

    renderSelectorContents() {
        const { itemId: id, type, options, multiValueFilter, filterValue, isRemovable } = this.props;

        return (
            <FlyoutMenu role="menu">
                <FilterSelectorContents
                    type={type}
                    options={options}
                    multiValueFilter={multiValueFilter}
                    id={id}
                    onUpdate={this.handleFilterUpdate}
                    onClose={this.onClose}
                    filterValue={filterValue}
                    onRemove={this.onRemove}
                    isRemovable={isRemovable}
                />
            </FlyoutMenu>
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderWithAppliedFilter() {
        const { classes, title, buttonText } = this.props;

        return (
            <ActiveFilterButton
                innerRef={this.refActiveFilterInstance}
                onChange={this.openFilterSelector}
                onClear={this.handleClearFilter}
                iconClass={classes.icon}
                title={title}
                content={this.renderSelectorContents()}
                buttonText={buttonText}
            />
        );
    }

    renderWithoutAppliedFilter() {
        const { title, disabled, tooltipContent } = this.props;

        return (
            <ConditionalTooltip
                content={tooltipContent}
                enabled={disabled}
                closeDelay={50}
            >
                <DropdownButton
                    disabled={disabled}
                    onClick={this.openFilterSelector}
                    component={this.renderSelectorContents()}
                >
                    {title}
                </DropdownButton>
            </ConditionalTooltip>
        );
    }

    render() {
        const { filterValue } = this.props;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                <div
                    data-test="filter-button-popover-anchor"
                    ref={this.anchorRef}
                >
                    {button}
                </div>
            </React.Fragment>
        );
    }
}

export const FilterButtonMain = withStyles(getStyles)(FilterButtonMainPlain);
