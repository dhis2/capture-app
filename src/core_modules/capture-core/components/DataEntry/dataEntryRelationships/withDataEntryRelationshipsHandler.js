// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getDataEntryKey from '../common/getDataEntryKey';
import {
    removeRelationship,
} from '../actions/dataEntry.actions';

type Props = {
    itemId: string,
    dataEntryId: string,
    onOpenAddRelationship: (itemId: string, dataEntryId: string) => void,
    onRemoveRelationship: (itemId: string, dataEntryId: string, relClientId: string) => void,
}

const getDataEntryRelationshipsHandler = (InnerComponent: React.ComponentType<any>) =>
    class DataEntryRelationshipsHandlerHOC extends React.Component<Props> {
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

const mapStateToProps = (state: ReduxState, props: { dataEntryId: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    const dataEntryKey = getDataEntryKey(props.dataEntryId, itemId);
    return {
        relationships: state.dataEntriesRelationships[dataEntryKey],
        itemId,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onRemoveRelationship: (itemId: string, dataEntryId: string, relationshipClientId: string) => {
        dispatch(removeRelationship(dataEntryId, itemId, relationshipClientId));
    },
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(mapStateToProps, mapDispatchToProps)(getDataEntryRelationshipsHandler(InnerComponent));
