// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import ArrowDownwardIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpwardIcon from '@material-ui/icons/KeyboardArrowUp';

import { Button } from '../../../../../Buttons';
import ActiveFilterButton from './ActiveFilterButton.component';
import FilterSelectorContents from '../Contents/FilterSelectorContents.component';
import OptionSet from '../../../../../../metaData/OptionSet/OptionSet';

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
    listId: string,
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
    filterValue: ?string,
    onFilterUpdate: (listId: string, data: ?Object, itemId: string, commitValue?: any) => void,
    onClearFilter: (listId: string, itemId: string) => void,
    onSetVisibleSelector: Function,
    isSelectorVisible: boolean,
};

type State = {
    isMounted: boolean,
};

class FilterButton extends Component<Props, State> {
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

    handleFilterUpdate = (data: ?Object, commitValue?: any) => {
        const { itemId, onFilterUpdate, listId } = this.props;
        onFilterUpdate(listId, data, itemId, commitValue);
        this.closeFilterSelector();
    }

    handleClearFilter = () => {
        const { listId, itemId, onClearFilter } = this.props;
        onClearFilter(listId, itemId);
    }

    renderSelectorContents() {
        const { itemId: id, type, optionSet, singleSelect, listId } = this.props;

        return (
            <FilterSelectorContents
                listId={listId}
                type={type}
                optionSet={optionSet}
                singleSelect={singleSelect}
                id={id}
                onUpdate={this.handleFilterUpdate}
                onClose={this.closeFilterSelector}
            />
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderWithAppliedFilter() {
        const { isSelectorVisible, classes, title, filterValue, listId } = this.props;

        const arrowIconElement = isSelectorVisible ?
            <ArrowUpwardIcon className={classes.icon} /> :
            <ArrowDownwardIcon className={classes.icon} />;

        return (
            <ActiveFilterButton
                listId={listId}
                innerRef={this.refActiveFilterInstance}
                onChange={this.openFilterSelector}
                onClear={this.handleClearFilter}
                iconClass={classes.icon}
                title={title}
                arrowIconElement={arrowIconElement}
                filterValue={filterValue}
            />
        );
    }

    renderWithoutAppliedFilter() {
        const { isSelectorVisible, classes, title } = this.props;

        return (
            <Button
                onClick={this.openFilterSelector}
            >
                {title}
                {isSelectorVisible ?
                    <ArrowUpwardIcon className={classes.icon} /> :
                    <ArrowDownwardIcon className={classes.icon} />
                }
            </Button>
        );
    }

    render() {
        const { filterValue, isSelectorVisible } = this.props;
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
                    open={isSelectorVisible && isMounted}
                    anchorEl={this.anchorRef.current}
                    onClose={this.closeFilterSelector}
                    anchorOrigin={POPOVER_ANCHOR_ORIGIN}
                    transformOrigin={POPOVER_TRANSFORM_ORIGIN}
                >
                    {
                        (() => {
                            if (isSelectorVisible) {
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

export default withStyles(getStyles)(FilterButton);
