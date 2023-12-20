// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { IconChevronDown16, IconChevronUp16, Button } from '@dhis2/ui';
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

const POPOVER_ANCHOR_ORIGIN = {
    vertical: 'bottom',
    horizontal: 'left',
};
const POPOVER_TRANSFORM_ORIGIN = {
    vertical: 'top',
    horizontal: 'left',
};

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
    selectorVisible: boolean,
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
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderWithAppliedFilter() {
        const { selectorVisible, classes, title, buttonText } = this.props;

        const arrowIconElement = selectorVisible ? (
            <span className={classes.icon}>
                <IconChevronUp16 />
            </span>
        ) : (
            <span className={classes.icon}>
                <IconChevronDown16 />
            </span>
        );

        return (
            <ActiveFilterButton
                innerRef={this.refActiveFilterInstance}
                onChange={this.openFilterSelector}
                onClear={this.handleClearFilter}
                iconClass={classes.icon}
                title={title}
                arrowIconElement={arrowIconElement}
                buttonText={buttonText}
            />
        );
    }

    renderWithoutAppliedFilter() {
        const { selectorVisible, classes, title, disabled, tooltipContent } = this.props;

        return (
            <ConditionalTooltip
                content={tooltipContent}
                enabled={disabled}
                closeDelay={50}
            >
                <Button
                    disabled={disabled}
                    onClick={this.openFilterSelector}
                >
                    {title}
                    <span className={classes.icon}>
                        {selectorVisible ? <IconChevronUp16 /> : <IconChevronDown16 />}
                    </span>
                </Button>
            </ConditionalTooltip>
        );
    }

    render() {
        const { filterValue, selectorVisible } = this.props;
        const { isMounted } = this.state;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                <div
                    data-test="filter-button-popover-anchor"
                    ref={this.anchorRef}
                >
                    {button}
                </div>
                <Popover
                    open={selectorVisible && isMounted}
                    anchorEl={this.anchorRef.current}
                    onClose={this.closeFilterSelector}
                    anchorOrigin={POPOVER_ANCHOR_ORIGIN}
                    transformOrigin={POPOVER_TRANSFORM_ORIGIN}
                >
                    {
                        (() => {
                            if (selectorVisible) {
                                return this.renderSelectorContents();
                            }
                            return null;
                        })()
                    }
                </Popover>
            </React.Fragment>
        );
    }
}

export const FilterButtonMain = withStyles(getStyles)(FilterButtonMainPlain);
