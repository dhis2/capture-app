// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import i18n from '@dhis2/d2-i18n';

import DragDropList from './DragDropSort/DragDropList.component';


const styles = theme => ({
    optionsIcon: {
        color: theme.palette.primary.main,
    },
});

type Props = {
    open: ?boolean,
    onClose: Function,
    listId: string,
    classes: Object,
    columns: Array<Object>,
    onUpdateWorkinglistOrder: (listId: string, workinglist: Array<Object>) => void,
};

type State = {
    columnList: Array<Object>,
};

class ColumnSelector extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            columnList: [...this.props.columns],
        };
    }

    getListToSave = () => this.state.columnList
        .map(column => ({
            id: column.id,
            visible: column.visible,
            isMainProperty: column.isMainProperty,
            header: column.header,
            type: column.type,
            options: column.options,
        }));

    handleSave = () => {
        this.props.onUpdateWorkinglistOrder(this.props.listId, this.getListToSave());
        this.props.onClose();
    };

    handleToggle = id => () => {
        const index = this.state.columnList.findIndex(column => column.id === id);
        const toggleList = this.state.columnList;

        toggleList[index] = { ...toggleList[index], visible: !toggleList[index].visible };

        this.setState({ columnList: toggleList });
    };

    handleUpdateListOrder = (sortedList) => {
        this.setState({ columnList: sortedList });
    };

    render() {
        const { classes, open, onClose } = this.props;

        return (
            <span>
                <Dialog
                    open={!!open}
                    onClose={onClose}
                    fullWidth
                >
                    <DialogTitle>{i18n.t('Columns to show in table')}</DialogTitle>
                    <DialogContent>
                        <DragDropList
                            listItems={this.state.columnList}
                            handleUpdateListOrder={this.handleUpdateListOrder}
                            handleToggle={this.handleToggle}
                        />
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
