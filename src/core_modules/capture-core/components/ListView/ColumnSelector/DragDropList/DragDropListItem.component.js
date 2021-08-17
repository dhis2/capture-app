// @flow
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { Checkbox, IconReorder24, spacersNum } from '@dhis2/ui';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    checkbox: {
        marginTop: spacersNum.dp12,
        marginBottom: spacersNum.dp12,
    },
});

type Props = {
    id: string,
    visible: boolean,
    text: string,
    handleToggle: (id: string) => void,
    isDragging: () => void,
    connectDragSource: (any) => void,
    connectDropTarget: (any) => void,
    classes: {
        checkbox: string,
    }
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

class Index extends Component<Props> {
    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;

        // $FlowFixMe[incompatible-extend] automated comment
        return connectDropTarget(connectDragSource(
            <tr key={this.props.id} tabIndex={-1} style={{ ...style, opacity }}>
                <TableCell component="th" scope="row">
                    <Checkbox
                        checked={this.props.visible}
                        tabIndex={-1}
                        onChange={this.props.handleToggle(this.props.id)}
                        label={text}
                        className={this.props.classes.checkbox}
                        valid
                        dense
                    />
                </TableCell>
                <TableCell>
                    <span style={{ float: 'right' }}>
                        <IconReorder24 />
                    </span>
                </TableCell>
            </tr>,
        ));
    }
}

export const DragDropListItemPlain =
    DragSource(
        ItemTypes.LISTITEM,
        cardSource,
        (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }),
    )(DropTarget(
        ItemTypes.LISTITEM,
        cardTarget,
        connect => ({ connectDropTarget: connect.dropTarget() }),
    )(Index));

export const DragDropListItem = withStyles(styles)(DragDropListItemPlain);
