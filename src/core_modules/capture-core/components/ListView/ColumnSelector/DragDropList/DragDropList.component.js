// @flow
import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'react-addons-update';
import { DataTable, TableHead, TableBody, DataTableRow, DataTableColumnHeader } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { DragDropListItem } from './DragDropListItem.component';

type Props = {
    listItems: Array<Object>,
    handleUpdateListOrder: (sortedList: Array<Object>) => void,
    handleToggle: (id: string) => () => any,
};

type State = {
    isDraggingAny: boolean,
};

export class DragDropList extends Component<Props, State> {
    state = {
        isDraggingAny: false,
    };

    moveListItem = (dragIndex: number, hoverIndex: number) => {
        const { listItems } = this.props;
        const dragListItem = listItems[dragIndex];
        let sortedList = [];
        sortedList = update(listItems, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragListItem],
            ],
        });

        this.props.handleUpdateListOrder(sortedList);
    };

    handleDragStart = () => {
        this.setState({ isDraggingAny: true });
    };

    handleDragEnd = () => {
        this.setState({ isDraggingAny: false });
    };

    render() {
        const { listItems } = this.props;
        const { isDraggingAny } = this.state;

        return (
            <DndProvider backend={HTML5Backend}>
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader />
                            <DataTableColumnHeader>{i18n.t('Column')}</DataTableColumnHeader>
                            <DataTableColumnHeader>{i18n.t('Visible')}</DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {listItems.map((item, i) => (
                            <DragDropListItem
                                key={item.id}
                                index={i}
                                id={item.id}
                                text={item.header}
                                moveListItem={this.moveListItem}
                                handleToggle={this.props.handleToggle}
                                visible={item.visible}
                                isDraggingAny={isDraggingAny}
                                onDragStart={this.handleDragStart}
                                onDragEnd={this.handleDragEnd}
                            />
                        ))}
                    </TableBody>
                </DataTable>
            </DndProvider>
        );
    }
}
