// @flow
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Button } from '@dhis2/ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '@dhis2/d2-i18n';

import { DragDropList } from './DragDropList';

type Props = {
    open: ?boolean,
    onClose: Function,
    onSave: Function,
    columns: Array<Object>,
};

export const ColumnSelectorDialog = ({ columns, open, onClose, onSave }: Props) => {
    const [columnList, setColumnList] = useState(columns);

    useEffect(() => {
        setColumnList(currentColumns => (isEqual(columns, currentColumns) ? currentColumns : columns));
    }, [columns]);

    const handleSave = () => {
        onSave(columnList);
    };

    const handleToggle = (id: string) => () => {
        const index = columnList.findIndex(column => column.id === id);
        const toggleList = [...columnList];

        toggleList[index] = { ...toggleList[index], visible: !toggleList[index].visible };
        setColumnList(toggleList);
    };

    const handleUpdateListOrder = (sortedList: Array<Object>) => {
        setColumnList(sortedList);
    };

    return (
        <span>
            <Dialog open={!!open} onClose={onClose} fullWidth>
                <DialogTitle>{i18n.t('Columns to show in table')}</DialogTitle>
                <DialogContent>
                    <DragDropList
                        listItems={columnList}
                        handleUpdateListOrder={handleUpdateListOrder}
                        handleToggle={handleToggle}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} primary initialFocus>
                        {i18n.t('Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    );
};
