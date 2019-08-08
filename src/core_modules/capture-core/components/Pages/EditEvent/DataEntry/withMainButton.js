// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import Tooltip from '@material-ui/core/Tooltip';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import { Button } from '../../../Buttons';

type Props = {
    onSave: (saveType?: ?any) => void,
    formHorizontal?: ?boolean,
    formFoundation: RenderFoundation,
};

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        innerInstance: any;

        getWrappedInstance() {
            return this.innerInstance;
        }
        renderMainButton = (hasWriteAccess: ?boolean) => (
            <Tooltip title={!this.props.formFoundation.access.data.write ? i18n.t('No write access') : ''}>
                <Button
                    onClick={() => { this.props.onSave(); }}
                    disabled={!this.props.formFoundation.access.data.write}
                    primary
                >
                    {i18n.t('Save')}
                </Button>
            </Tooltip>
        )

        render() {
            const { onSave, ...passOnProps } = this.props;
            const hasWriteAccess = this.props.formFoundation.access.data.write;
            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    mainButton={this.renderMainButton(hasWriteAccess)}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    return {};
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps)(getMainButton(InnerComponent));
