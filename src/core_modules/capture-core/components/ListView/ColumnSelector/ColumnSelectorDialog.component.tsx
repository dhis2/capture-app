import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Modal, ModalTitle, ModalContent, ModalActions, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

import { DragDropList } from './DragDropList';

import type { Columns } from '../types';

type Props = {
    open: boolean | null;
    onClose: () => void;
    onSave: (columns: Columns) => void;
    columns: Columns;
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

    const handleUpdateListOrder = (sortedList: Columns) => {
        setColumnList(sortedList);
    };

    if (!open) {
        return null;
    }

    return (
        <span>
            <Modal
                hide={!open}
                onClose={onClose}
                dataTest={'column-selector-dialog'}
            >
                <ModalTitle>{i18n.t('Columns to show in table')}</ModalTitle>
                <ModalContent>
                    <DragDropList
                        listItems={columnList}
                        handleUpdateListOrder={handleUpdateListOrder}
                        handleToggle={handleToggle}
                    />
                </ModalContent>
                <ModalActions>
                    <Button onClick={handleSave} primary initialFocus>
                        {i18n.t('Save')}
                    </Button>
                </ModalActions>
            </Modal>
        </span>
    );
};
