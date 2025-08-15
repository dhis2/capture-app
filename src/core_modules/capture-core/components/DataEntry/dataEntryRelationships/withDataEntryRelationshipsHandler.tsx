import * as React from 'react';
import { connect } from 'react-redux';
import { getDataEntryKey } from '../common/getDataEntryKey';
import {
    removeRelationship,
} from '../actions/dataEntry.actions';
import type { PlainProps, MapStateToPropsInput, MapDispatchToPropsReturn } from './withDataEntryRelationshipsHandler.types';

const getDataEntryRelationshipsHandler = (InnerComponent: React.ComponentType<any>) =>
    class DataEntryRelationshipsHandlerHOC extends React.Component<PlainProps> {
        handleOpenAddRelationship = () => {
            this.props.onOpenAddRelationship(this.props.itemId, this.props.dataEntryId);
        }

        handleRemoveRelationship = (relClientId: string) => {
            this.props.onRemoveRelationship(this.props.itemId, this.props.dataEntryId, relClientId);
        }

        render() {
            const { onOpenAddRelationship, onRemoveRelationship, itemId, dataEntryId, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    {...passOnProps}
                    onOpenAddRelationship={this.handleOpenAddRelationship}
                    onRemoveRelationship={this.handleRemoveRelationship}
                />
            );
        }
    };

const mapStateToProps = (state: any, props: MapStateToPropsInput) => {
    const itemId = state.dataEntries && state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    const dataEntryKey = getDataEntryKey(props.dataEntryId, itemId);
    return {
        itemId,
        relationships: state.dataEntriesRelationships && state.dataEntriesRelationships[dataEntryKey],
    };
};

const mapDispatchToProps = (dispatch: any): MapDispatchToPropsReturn => ({
    onRemoveRelationship: (itemId: string, dataEntryId: string, relationshipClientId: string) => {
        dispatch(removeRelationship(dataEntryId, itemId, relationshipClientId));
    },
});

export const withDataEntryRelationshipsHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps)(getDataEntryRelationshipsHandler(InnerComponent));
