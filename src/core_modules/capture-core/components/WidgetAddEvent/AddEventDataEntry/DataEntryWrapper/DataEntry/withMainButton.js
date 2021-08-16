// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getDataEntryKey } from '../../../../DataEntry/common/getDataEntryKey';
import { type RenderFoundation } from '../../../../../metaData';
import { getDataEntryHasChanges } from '../../getNewEventDataEntryHasChanges';
import { getStageFromEvent } from '../../../../../metaData/helpers/getStageFromEvent';
import { addEventSaveTypes } from './addEventSaveTypes';


type Props = {
    onSave: (type: $Values<typeof addEventSaveTypes>) => void,
    onCancel: () => void,
    saveTypes: Array<string>,
    formHorizontal?: ?boolean,
    dataEntryHasChanges?: ?boolean,
    formFoundation: RenderFoundation,
    finalInProgress?: ?boolean,
    hasRecentlyAddedEvents?: ?boolean,
};

const buttonDefinitions = {
    [addEventSaveTypes.COMPLETE]: (props: Props) => ({
        key: addEventSaveTypes.COMPLETE,
        onClick: () => props.onSave(addEventSaveTypes.COMPLETE),
        text: i18n.t('Complete'),
        primary: true,
    }),
    [addEventSaveTypes.SAVE_WITHOUT_COMPLETING]: (props: Props) => ({
        key: addEventSaveTypes.SAVE_WITHOUT_COMPLETING,
        onClick: () => props.onSave(addEventSaveTypes.SAVE_WITHOUT_COMPLETING),
        text: i18n.t('Save without completing'),
    }),

};
const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        renderButton = (type: $Values<typeof addEventSaveTypes>) => {
            const { text, ...passOnProps } = buttonDefinitions[type](this.props);

            return (
                <Button {...passOnProps}>{text}</Button>
            );
        }

        render() {
            const { saveTypes, dataEntryHasChanges, hasRecentlyAddedEvents, onSave, onComplete, finalInProgress, ...passOnProps } = this.props;

            const mainButton = this.renderButton(addEventSaveTypes.SAVE_WITHOUT_COMPLETING);
            const completeButton = this.renderButton(addEventSaveTypes.COMPLETE);
            return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    // $FlowFixMe[prop-missing] automated comment
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    mainButton={mainButton}
                    completeButton={completeButton}
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
