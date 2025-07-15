import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import type { Props } from './withMainButton.types';

const getMainButton = (InnerComponent: React.ComponentType<any>) =>
    class MainButtonHOC extends React.Component<Props> {
        getWrappedInstance() {
            return this.innerInstance;
        }

        innerInstance: any;

        renderMainButton = (hasWriteAccess: boolean) => (
            <ConditionalTooltip
                content={i18n.t('No write access')}
                enabled={!hasWriteAccess}
            >
                <Button
                    dataTest="dhis2-capture-update-button"
                    onClick={() => { this.props.onSave(); }}
                    disabled={!hasWriteAccess}
                    primary
                >
                    {i18n.t('Save')}
                </Button>
            </ConditionalTooltip>
        );

        render() {
            const { onSave, ...passOnProps } = this.props;
            const hasWriteAccess = this.props.formFoundation.access.data.write;

            return (
                <InnerComponent
                    innerRef={(innerInstance) => { this.innerInstance = innerInstance; }}
                    mainButton={this.renderMainButton(hasWriteAccess)}
                    {...passOnProps}
                />
            );
        }
    };

const mapDispatchToProps = () => ({});

export const withMainButton = () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(null, mapDispatchToProps)(getMainButton(InnerComponent));
