// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { getDataEntryKey } from '../../../../DataEntry/common/getDataEntryKey';
import { type RenderFoundation } from '../../../../../metaData';
import { getDataEntryHasChanges } from '../../getNewEventDataEntryHasChanges';

type Props = {
    onSave: (saveType: $Values<typeof newEventSaveTypes>) => void,
    onCancel: () => void,
    saveTypes: Array<string>,
    formHorizontal?: ?boolean,
    dataEntryHasChanges?: ?boolean,
    formFoundation: RenderFoundation,
    finalInProgress?: ?boolean,
    hasRecentlyAddedEvents?: ?boolean,
};


const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        renderButton = () => <Button onClick={this.props.onSave}>{i18n.t('Save without completing')}</Button>

        render() {
            const { saveTypes, dataEntryHasChanges, hasRecentlyAddedEvents, onSave, finalInProgress, ...passOnProps } = this.props;

            const mainButton = this.renderButton();
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    // $FlowFixMe[prop-missing] automated comment
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    mainButton={mainButton}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    const dataEntryHasChanges = getDataEntryHasChanges(state);
    const hasRecentlyAddedEvents = state.recentlyAddedEvents && Object.keys(state.recentlyAddedEvents).length > 0;
    return {
        saveTypes: state.newEventPage.saveTypes,
        finalInProgress: state.dataEntriesUI[key] && state.dataEntriesUI[key].finalInProgress,
        dataEntryHasChanges,
        hasRecentlyAddedEvents,
    };
};

const mapDispatchToProps = () => ({});

export const withMainButton = () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(
            mapStateToProps, mapDispatchToProps)(getMainButton(InnerComponent));
