// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import ArrowDownwardIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpwardIcon from '@material-ui/icons/KeyboardArrowUp';

import Button from '../../../../../Buttons/Button.component';
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
    itemId: string,
    type: string,
    optionSet?: ?OptionSet,
    title: string,
    classes: {
        icon: string,
        inactiveFilterButton: string,
        inactiveFilterButtonLabel: string,
    },
    filterValue: ?string,
    onEditFilterContents: (value: any, itemId: string) => void,
    onFilterUpdate: (data: ?Object, itemId: string, commitValue?: any) => void,
    onClearFilter: (itemId: string) => void,
    onRevertFilter: () => void,
};

type State = {
    filterSelectorOpen: ?{
        anchorElement: Object,
    },
};

class FilterButton extends Component<Props, State> {
    activeFilterButtonInstance: ?any;
    constructor(props: Props) {
        super(props);
        this.state = {
            filterSelectorOpen: null,
        };
    }

    openFilterSelector = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
        this.setState({
            filterSelectorOpen: {
                anchorElement: event.currentTarget,
            },
        });
        // onmouseleave is sometimes triggered when the popover opens, and sometimes not triggered at all (not even when the mouse actually leaves the button). Clears the hover here to avoid it remaining hovered.
        if (this.props.filterValue) {
            this.activeFilterButtonInstance && this.activeFilterButtonInstance.clearIsHovered();
        }
    }

    closeFilterSelector = () => {
        this.setState({ filterSelectorOpen: null });
    }

    handleCloseFilterSelector = () => {
        this.closeFilterSelector();
        this.props.onRevertFilter();
    }

    handleEditFilterContents = (value: any) => {
        this.props.onEditFilterContents(value, this.props.itemId);
    }

    handleFilterUpdate = (data: ?Object, commitValue?: any) => {
        const itemId = this.props.itemId;
        this.props.onFilterUpdate(data, itemId, commitValue);
        this.closeFilterSelector();
    }

    handleClearFilter = () => {
        const itemId = this.props.itemId;
        this.props.onClearFilter(itemId);
    }

    renderSelectorContents() {
        const { itemId: id, type, optionSet } = this.props;

        return (
            <FilterSelectorContents
                type={type}
                optionSet={optionSet}
                id={id}
                onCommitValue={this.handleEditFilterContents}
                onUpdate={this.handleFilterUpdate}
                onClose={this.handleCloseFilterSelector}
            />
        );
    }

    refActiveFilterInstance = (activeFilterButtonInstance) => {
        this.activeFilterButtonInstance = activeFilterButtonInstance;
    }

    renderWithAppliedFilter() {
        const { classes, title, filterValue } = this.props;

        const arrowIconElement = this.state.filterSelectorOpen ?
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
                filterValue={filterValue}
            />
        );
    }

    renderWithoutAppliedFilter() {
        const { classes, title } = this.props;

        return (
            <Button
                variant="outlined"
                color="default"
                size={'small'}
                classes={{ button: classes.inactiveFilterButton }}
                muiClasses={{ label: classes.inactiveFilterButtonLabel }}
                onClick={this.openFilterSelector}
            >
                {title}
                {this.state.filterSelectorOpen ?
                    <ArrowUpwardIcon className={classes.icon} /> :
                    <ArrowDownwardIcon className={classes.icon} />
                }
            </Button>
        );
    }

    render() {
        const { filterValue } = this.props;
        const { filterSelectorOpen } = this.state;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                {button}
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
}

export default withStyles(getStyles)(FilterButton);
