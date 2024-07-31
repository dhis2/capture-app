// @flow
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DataTableRow, DataTableCell, Checkbox } from '@dhis2/ui';

const ItemTypes = {
    LISTITEM: 'listItem',
};

type Props = {
    id: string,
    visible: boolean,
    text: string,
    index: number,
    handleToggle: (id: string) => any,
    moveListItem: (dragIndex: number, hoverIndex: number) => void,
};

export const DragDropListItem = ({ id, index, text, visible, handleToggle, moveListItem }: Props) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemTypes.LISTITEM,
        hover(item: { id: string, index: number }) {
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves.
            if (dragIndex === hoverIndex) {
                return;
            }

            // Time to actually perform the action
            moveListItem(dragIndex, hoverIndex);

            // Note: we're mutating the item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.LISTITEM,
        item: { id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const opacity = isDragging ? 0 : 1;

    return (
        <DataTableRow ref={ref} style={{ opacity }} draggable>
            <DataTableCell>{text}</DataTableCell>
            <DataTableCell>
                <Checkbox
                    checked={visible}
                    onChange={handleToggle(id)}
                    valid
                    dense
                />
            </DataTableCell>
        </DataTableRow>
    );
};
