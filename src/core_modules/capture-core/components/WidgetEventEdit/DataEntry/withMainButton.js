// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { type RenderFoundation } from '../../../metaData';

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
        renderMainButton = (hasWriteAccess: boolean) => (
            <ConditionalTooltip
                content={i18n.t('No write access')}
                enabled={!hasWriteAccess}
            >
                <Button
                    onClick={() => { this.props.onSave(); }}
                    disabled={!hasWriteAccess}
                    primary
                >
                    {i18n.t('Save')}
                </Button>
            </ConditionalTooltip>
        )

        render() {
            const { onSave, ...passOnProps } = this.props;
            const hasWriteAccess = this.props.formFoundation.access.data.write;
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    innerRef={(innerInstance) => { this.innerInstance = innerInstance; }}
                    // $FlowFixMe[extra-arg] automated comment
                    mainButton={this.renderMainButton(hasWriteAccess)}
                    {...passOnProps}
                />
            );
        }
    };

const mapDispatchToProps = () => ({});

export const withMainButton = () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(null, mapDispatchToProps)(getMainButton(InnerComponent));
