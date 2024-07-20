// @flow
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { Checkbox, DataTableRow, DataTableCell } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    container: {
        cursor: 'move',
        width: '100%',
    },
    row: {
        display: 'flex',
    },
    checkboxContainer: {
        flex: 1,
        display: 'flex',
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
        container: string,
        row: string,
        checkboxContainer: string,
    }
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
            <div className={this.props.classes.container} style={{ opacity }}>
                <DataTableRow className={this.props.classes.row} draggable>
                    <DataTableCell className={this.props.classes.checkboxContainer}>
                        <Checkbox
                            checked={this.props.visible}
                            onChange={this.props.handleToggle(this.props.id)}
                            label={text}
                            valid
                            dense
                        />
                    </DataTableCell>
                </DataTableRow>
            </div>,
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
