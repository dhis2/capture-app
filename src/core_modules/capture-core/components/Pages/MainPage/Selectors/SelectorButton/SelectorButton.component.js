// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import ArrowDownwardIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpwardIcon from '@material-ui/icons/KeyboardArrowUp';

import { Button } from '../../../../Buttons';
import ActiveFilterButton from './ActiveSelectorButton.component';
import SelectorContents from '../Contents/SelectorContents.component';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';

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
};

type State = {
    open: boolean,
};

class SelectorButton extends Component<Props, State> {
    activeFilterButtonInstance: ?any;
    constructor(props: Props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    openFilterSelector = () => {
        this.setState({
            open: true,
        });
    }

    closeFilterSelector = () => {
        this.setState({
            open: false,
        });
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
            <SelectorContents
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
        const { classes, title, filterValue, listId } = this.props;

        const arrowIconElement = this.state.open ?
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
        const { classes, title } = this.props;

        return (
            <Button
                onClick={this.openFilterSelector}
            >
                {title}
                {this.state.open ?
                    <ArrowUpwardIcon className={classes.icon} /> :
                    <ArrowDownwardIcon className={classes.icon} />
                }
            </Button>
        );
    }

    render() {
        const { filterValue } = this.props;
        const { open } = this.state;

        const button = filterValue ? this.renderWithAppliedFilter() : this.renderWithoutAppliedFilter();

        return (
            <React.Fragment>
                {button}
                <Popover
                    open={open}
                    onClose={this.closeFilterSelector}
                    anchorOrigin={POPOVER_ANCHOR_ORIGIN}
                    transformOrigin={POPOVER_TRANSFORM_ORIGIN}
                >
                    {
                        (() => {
                            if (open) {
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

export default withStyles(getStyles)(SelectorButton);
