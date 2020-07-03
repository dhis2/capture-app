// @flow
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import ReorderIcon from '@material-ui/icons/Reorder';

type Props = {
    id: string,
    visible: boolean,
    text: string,
    handleToggle: (id: string) => void,
    isDragging: () => void,
    connectDragSource: (any) => void,
    connectDropTarget: (any) => void,
};

const style = {
    cursor: 'move',
    outline: 'none',
};

const ItemTypes = {
    LISTITEM: 'listItem',
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
    },
};

const cardTarget = {
    hover(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves.
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action.
        props.moveListItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

class DragDropListItem extends Component<Props> {
    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;

        // $FlowFixMe[incompatible-extend] automated comment
        return connectDropTarget(connectDragSource(
            <tr key={this.props.id} tabIndex={-1} style={{ ...style, opacity }}>
                <TableCell component="th" scope="row">
                    <Checkbox
                        color={'primary'}
                        checked={this.props.visible}
                        tabIndex={-1}
                        disableRipple
                        onClick={this.props.handleToggle(this.props.id)}
                    />
                    {text}
                </TableCell>
                <TableCell>
                    <ReorderIcon style={{ float: 'right' }} />
                </TableCell>
            </tr>,
        ));
    }
}

export default DragSource(ItemTypes.LISTITEM, cardSource, (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }))(DropTarget(ItemTypes.LISTITEM, cardTarget, connect => ({ connectDropTarget: connect.dropTarget() }))(DragDropListItem));
