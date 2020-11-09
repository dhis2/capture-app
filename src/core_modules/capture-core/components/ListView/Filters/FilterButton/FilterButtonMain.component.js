// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import ArrowDownwardIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpwardIcon from '@material-ui/icons/KeyboardArrowUp';
import { Button } from '../../../Buttons';
import ActiveFilterButton from './ActiveFilterButton.component';
import FilterSelectorContents from '../Contents/FilterSelectorContents.component';
import type { OptionSet } from '../../../../metaData';
import type { UpdateFilter, ClearFilter } from '../../types';
import type { FilterData } from '../../../FiltersForTypes';

const getStyles = (theme: Theme) => ({
    icon: {
        fontSize: theme.typography.pxToRem(20),
        paddingLeft: theme.typography.pxToRem(5),
    },
    inactiveFilterButton: {
        backgroundColor: theme.palette.grey[100],
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
    optionSet?: ?OptionSet,
    singleSelect?: ?boolean,
    title: string,
    classes: {
        icon: string,
        inactiveFilterButton: string,
        inactiveFilterButtonLabel: string,
    },
    onUpdateFilter: UpdateFilter,
    onClearFilter: ClearFilter,
    onSetVisibleSelector: Function,
    selectorVisible: boolean,
    filterValue?: FilterData,
    buttonText?: string,
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
        const { itemId: id, type, optionSet, singleSelect, filterValue } = this.props;

        return (
            <FilterSelectorContents
                type={type}
                optionSet={optionSet}
                singleSelect={singleSelect}
                id={id}
                onUpdate={this.handleFilterUpdate}
                onClose={this.closeFilterSelector}
                filterValue={filterValue}
            />
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderWithAppliedFilter() {
        const { selectorVisible, classes, title, buttonText } = this.props;

        const arrowIconElement = selectorVisible ?
            <ArrowUpwardIcon className={classes.icon} /> :
            <ArrowDownwardIcon className={classes.icon} />;

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
        const { selectorVisible, classes, title } = this.props;

        return (
            <Button
                onClick={this.openFilterSelector}
            >
                {title}
                {selectorVisible ?
                    <ArrowUpwardIcon className={classes.icon} /> :
                    <ArrowDownwardIcon className={classes.icon} />
                }
            </Button>
        );
    }

    render() {
        const { filterValue, selectorVisible } = this.props;
        const { isMounted } = this.state;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                <div
                    data-test={'filter-button-popover-anchor'}
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
