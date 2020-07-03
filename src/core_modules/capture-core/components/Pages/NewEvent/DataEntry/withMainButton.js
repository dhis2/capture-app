// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import Tooltip from '@material-ui/core/Tooltip';
import newEventSaveTypes from './newEventSaveTypes';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import { SimpleSplitButton } from '../../../Buttons';
import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';

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

const buttonTypes = {
    ...newEventSaveTypes,
    FINISH: 'FINISH',
};

const buttonDefinitions = {
    [buttonTypes.SAVEANDADDANOTHER]: (props: Props) => ({
        key: buttonTypes.SAVEANDADDANOTHER,
        text: i18n.t('Save and add another'),
        onClick: () => { props.onSave(newEventSaveTypes.SAVEANDADDANOTHER); },
    }),
    [buttonTypes.SAVEANDEXIT]: (props: Props) => ({
        key: buttonTypes.SAVEANDEXIT,
        text: i18n.t('Save and exit'),
        onClick: () => { props.onSave(newEventSaveTypes.SAVEANDEXIT); },
    }),
    [buttonTypes.FINISH]: (props: Props) => ({
        key: buttonTypes.FINISH,
        text: i18n.t('Finish'),
        onClick: () => { props.onCancel(); },
    }),
};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        getButtonDefinition = (type: $Values<typeof buttonTypes>) => buttonDefinitions[type](this.props)

        getFormHorizontalButtons = (dataEntryHasChanges: ?boolean, hasRecentlyAddedEvents: ?boolean) => {
            const buttons = [
                this.getButtonDefinition(buttonTypes.SAVEANDADDANOTHER),
                this.getButtonDefinition(buttonTypes.SAVEANDEXIT),
            ];

            return dataEntryHasChanges || !hasRecentlyAddedEvents ?
                buttons :
                [this.getButtonDefinition(buttonTypes.FINISH), ...buttons];
        }

        getFormVerticalButtons = (dataEntryHasChanges: ?boolean, hasRecentlyAddedEvents: ?boolean, saveTypes: ?Array<string>) => {
            const buttons = saveTypes ?
                // $FlowFixMe[missing-annot] automated comment
                saveTypes.map(saveType => this.getButtonDefinition(saveType)) :
                [
                    this.getButtonDefinition(buttonTypes.SAVEANDEXIT),
                    this.getButtonDefinition(buttonTypes.SAVEANDADDANOTHER),
                ];
            return dataEntryHasChanges || !hasRecentlyAddedEvents ?
                buttons :
                [this.getButtonDefinition(buttonTypes.FINISH), ...buttons];
        }

        renderMultiButton = (buttons: any, hasWriteAccess: ?boolean) => {
            const primary = buttons[0];
            const secondaries = buttons.slice(1);
            return (
                <Tooltip title={!hasWriteAccess ? i18n.t('No write access') : ''}>
                    <div>
                        <SimpleSplitButton
                            primary
                            disabled={!hasWriteAccess}
                            onClick={primary.onClick}
                            dropDownItems={secondaries}
                        >
                            {primary.text}
                        </SimpleSplitButton>
                    </div>
                </Tooltip>
            );
        }

        render() {
            const { saveTypes, dataEntryHasChanges, hasRecentlyAddedEvents, onSave, finalInProgress, ...passOnProps } = this.props;
            const hasWriteAccess = this.props.formFoundation.access.data.write;
            const buttons = this.props.formHorizontal ?
                this.getFormHorizontalButtons(dataEntryHasChanges, hasRecentlyAddedEvents) :
                this.getFormVerticalButtons(dataEntryHasChanges, hasRecentlyAddedEvents, saveTypes);

            // $FlowFixMe[extra-arg] automated comment
            const mainButton = this.renderMultiButton(buttons, hasWriteAccess, finalInProgress);
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

export default () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(
            mapStateToProps, mapDispatchToProps)(getMainButton(InnerComponent));
