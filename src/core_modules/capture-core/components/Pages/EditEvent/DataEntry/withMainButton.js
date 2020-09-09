// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import Tooltip from '@material-ui/core/Tooltip';
import { RenderFoundation } from '../../../../metaData';
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
        renderMainButton = () => (
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
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    // $FlowFixMe[extra-arg] automated comment
                    mainButton={this.renderMainButton(hasWriteAccess)}
                    {...passOnProps}
                />
            );
        }
    };

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(null, mapDispatchToProps)(getMainButton(InnerComponent));
