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

const styles = theme => ({
    optionsIcon: {
        color: theme.palette.primary.main,
    },
    resortIcon: {
        float: 'right',
    },
    optionsIcon: {
        color: theme.palette.primary.main,
    },
});

type Props = {
    classes: Object,
    workingListColumnOrder: Array,
    onSetColumnVisible: (columnId: string) => void,
};

class ColumnSelector extends Component<Props> {
    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    handleToggle = value => () => {
        this.props.onSetColumnVisible(value);
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
                    <DialogTitle>{"Columns to show in table"}</DialogTitle>
                    <DialogContent>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={12}>Column</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.props.workingListColumnOrder.map(column => {
                                return (
                                <TableRow key={column.id} role="checkbox" tabIndex={-1}>
                                    <TableCell component="th" scope="row">
                                        <Checkbox
                                            color={'primary'}
                                            checked={column.visible}
                                            tabIndex={-1}
                                            disableRipple
                                            onClick={this.handleToggle(column.id)}
                                        />
                                        {column.id}
                                    </TableCell>
                                    <TableCell>
                                        <ReorderIcon className={classes.resortIcon} />
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(styles)(ColumnSelector);