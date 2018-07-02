// @flow
import React, { Component } from 'react';

import DragDropListItem from './DragDropListItem.component';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react-addons-update';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';
import getStageFromProgramIdForEventProgram from '../../../metaData/helpers/getStageFromProgramIdForEventProgram';
import i18n from '@dhis2/d2-i18n';

type Props = {
    listItems: Array<Object>,
    handleUpdateListOrder: (sortedList: Array<Object>) => void,
    handleToggle: (id: string) => void,
    selectedProgramId: string,
};

type State = {
    listItems: Array<Object>,
};

class Container extends Component<Props, State> {
    moveListItem: (dragIndex: any, hoverIndex: any) => void;
    constructor(props) {
        super(props);
        this.moveListItem = this.moveListItem.bind(this);
        this.state = { listItems: this.props.listItems };
    }

    moveListItem(dragIndex, hoverIndex) {
        const { listItems } = this.state;
        const dragListItem = listItems[dragIndex];

        this.setState(update(this.state, {
            listItems: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragListItem],
                ],
            },
        }));

        this.props.handleUpdateListOrder(this.state.listItems);
    }

    render() {
        const { listItems } = this.state;

        const stageContainer = getStageFromProgramIdForEventProgram(this.props.selectedProgramId);
        // $FlowSuppress
        const stage: RenderFoundation = stageContainer.stage;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={12}>{i18n.t('Column')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listItems.map((item, i) => (
                        <DragDropListItem
                            key={item.id}
                            index={i}
                            id={item.id}
                            text={item.isMainProperty ? stage.getLabel(item.id) : stage.getElement(item.id).name}
                            moveListItem={this.moveListItem}
                            handleToggle={this.props.handleToggle}
                            visible={item.visible}
                        />
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default DragDropContext(HTML5Backend)(Container);
