// @flow
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DataTableRow, DataTableCell, Checkbox } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

const ItemTypes = {
    LISTITEM: 'listItem',
};

const styles = {
    rowWithoutHover: {
        '&:hover > td': {
            backgroundColor: 'transparent !important',
        },
    },
};

type Props = {
    id: string,
    visible: boolean,
    text: string,
    index: number,
    handleToggle: (id: string) => any,
    moveListItem: (dragIndex: number, hoverIndex: number) => void,
    isDraggingAny: boolean,
    onDragStart: () => void,
    onDragEnd: () => void,
    classes: any,
};

const DragDropListItemPlain = ({
    id,
    index,
    text,
    visible,
    handleToggle,
    moveListItem,
    isDraggingAny,
    onDragStart,
    onDragEnd,
    classes,
}: Props) => {
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
        <DataTableRow
            ref={ref}
            style={{ opacity }}
            className={isDraggingAny ? classes.rowWithoutHover : null}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
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

export const DragDropListItem = withStyles(styles)(DragDropListItemPlain);
