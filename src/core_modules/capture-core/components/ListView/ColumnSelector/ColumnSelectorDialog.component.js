// @flow
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import i18n from '@dhis2/d2-i18n';

import { DragDropList } from './DragDropList';

type Props = {
    open: ?boolean,
    onClose: Function,
    onSave: Function,
    columns: Array<Object>,
};

type State = {
    columnList: Array<Object>,
};

class ColumnSelectorDialog extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            columnList: [...this.props.columns],
        };
    }

    handleSave = () => {
        const { onSave } = this.props;
        onSave(this.state.columnList);
    };

    handleToggle = (id: string) => () => {
        const index = this.state.columnList.findIndex(column => column.id === id);
        const toggleList = this.state.columnList;

        toggleList[index] = { ...toggleList[index], visible: !toggleList[index].visible };

        this.setState({ columnList: toggleList });
    };

    handleUpdateListOrder = (sortedList: Array<Object>) => {
        this.setState({ columnList: sortedList });
    };

    render() {
        const { open, onClose } = this.props;

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

export default ColumnSelectorDialog;
