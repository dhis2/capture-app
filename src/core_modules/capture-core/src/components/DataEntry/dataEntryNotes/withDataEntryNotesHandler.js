// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getDataEntryKey from '../common/getDataEntryKey';

type Props = {
    itemId: string,
    dataEntryId: string,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
}

const getDataEntryNotesHandler = (InnerComponent: React.ComponentType<any>) =>
    class DataEntryNotesHandlerHOC extends React.Component<Props> {
        handleAddNote = (note: string) => {
            this.props.onAddNote(this.props.itemId, this.props.dataEntryId, note);
        }

        render() {
            const { onAddNote, itemId, dataEntryId, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    {...passOnProps}
                    onAddNote={this.handleAddNote}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { dataEntryId: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    const key = getDataEntryKey(props.dataEntryId, itemId);
    return {
        itemId,
        notes: state.dataEntriesNotes[key] || [],
    };
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(mapStateToProps, () => ({}))(getDataEntryNotesHandler(InnerComponent));
