// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import Tooltip from '@material-ui/core/Tooltip';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import ProgressButton from '../../../Buttons/ProgressButton.component';

type Props = {
    onSave: (saveType?: ?any) => void,
    formHorizontal?: ?boolean,
    formFoundation: RenderFoundation,
    finalInProgress?: ?boolean,

};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        innerInstance: any;

        getWrappedInstance() {
            return this.innerInstance;
        }
        renderMainButton = (hasWriteAccess: ?boolean, finalInProgress: ?boolean) => (
            <Tooltip title={!this.props.formFoundation.access.data.write ? i18n.t('No write access') : ''}>
                <ProgressButton
                    variant="raised"
                    color={'primary'}
                    onClick={() => { this.props.onSave(); }}
                    disabled={!this.props.formFoundation.access.data.write}
                    inProgress={finalInProgress}
                >
                    {i18n.t('Save')}
                </ProgressButton>
            </Tooltip>
        )

        render() {
            const { onSave, finalInProgress, ...passOnProps } = this.props;
            const hasWriteAccess = this.props.formFoundation.access.data.write;
            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    mainButton={this.renderMainButton(hasWriteAccess, finalInProgress)}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        finalInProgress: state.dataEntriesUI[key] && state.dataEntriesUI[key].finalInProgress,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getMainButton(InnerComponent));
