import * as React from 'react';
import { connect } from 'react-redux';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { addNote } from '../actions/dataEntry.actions';
import type { PlainProps, MapStateToPropsInput, MapDispatchToPropsReturn } from './withDataEntryNotesHandler.types';

const getDataEntryNotesHandler = (InnerComponent: React.ComponentType<any>) =>
    class DataEntryNotesHandlerHOC extends React.Component<PlainProps> {
        handleAddNote = (note: string) => {
            this.props.onAddNote(this.props.itemId, this.props.dataEntryId, note);
        }

        render() {
            const { onAddNote, ...passOnProps } = this.props;
            return React.createElement(InnerComponent, {
                onAddNote: this.handleAddNote,
                ...passOnProps,
            });
        }
    };

const mapStateToProps = (state: any, props: MapStateToPropsInput) => {
    const itemId = state.dataEntries && state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    const key = getDataEntryKey(props.dataEntryId, itemId);
    return {
        itemId,
        notes: state.dataEntriesNotes && state.dataEntriesNotes[key],
    };
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsReturn => ({
    onAddNote: (itemId: string, dataEntryId: string, note: string) => {
        dispatch(addNote(dataEntryId, itemId, note));
    },
});

export const withDataEntryNotesHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps)(getDataEntryNotesHandler(InnerComponent));
