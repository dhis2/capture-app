// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from 'capture-ui';
// import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
// import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';

type Props = {
    onSave: () => void,
    onCancel: () => void,
    dataEntryHasChanges?: ?boolean,
};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        getButtonText() {
            return i18n.t('Create person and link');
        }

        renderButton() {
            const { onSave } = this.props;

            return (
                <Button
                    kind="primary"
                    size="medium"
                    onClick={onSave}
                >
                    {this.getButtonText()}
                </Button>
            );
        }

        render() {
            const {
                dataEntryHasChanges,
                onSave,
                ...passOnProps
            } = this.props;
            const mainButton = this.renderButton();
            return (
                <InnerComponent
                    mainButton={mainButton}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    // const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    // const key = getDataEntryKey(props.id, itemId);
    // const dataEntryHasChanges = getDataEntryHasChanges(state);
    return {
        dataEntryHasChanges: false, // dataEntryHasChanges,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getMainButton(InnerComponent));
