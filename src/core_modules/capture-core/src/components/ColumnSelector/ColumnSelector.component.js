// @flow
/* eslint-disable */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SettingsIcon from '@material-ui/icons/Settings';
import ReorderIcon from '@material-ui/icons/Reorder';

import i18n from '@dhis2/d2-i18n';

import DragDropList from './DragDropSort/DragDropList.component';


const styles = theme => ({
    optionsIcon: {
        color: theme.palette.primary.main,
    },
});

type Props = {
    classes: Object,
    workingListColumnOrder: Array,
    selectedProgramId: string,
    onUpdateWorkinglistOrder: (workinglist: Array) => void,
};

class ColumnSelector extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            columnList: this.props.workingListColumnOrder,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    handleSave = () => {
        this.props.onUpdateWorkinglistOrder(this.state.columnList);
        this.setState({ open: false });
    };

    handleToggle = id => () => {
        const index = this.state.columnList.findIndex(column => column.id === id);
        let toggleList = this.state.columnList;

        toggleList[index] = {...toggleList[index], visible: !toggleList[index].visible};

        this.setState({ columnList: toggleList });
    };

    handleUpdateListOrder = (sortedList) => {
        this.setState({ columnList: sortedList });
    };

    render() {
        const { classes } = this.props;

        return (
            <span>
                <IconButton onClick={this.handleClickOpen}>
                    <SettingsIcon
                        className={classes.optionsIcon}
                    />
                </IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                >
                    <DialogTitle>{i18n.t('Columns to show in table')}</DialogTitle>
                    <DialogContent>
                        <DragDropList listItems={this.state.columnList} handleUpdateListOrder={this.handleUpdateListOrder} handleToggle={this.handleToggle} selectedProgramId={this.props.selectedProgramId}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSave} color="primary" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(styles)(ColumnSelector);