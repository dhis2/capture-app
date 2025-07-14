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
                    onClick={this.props.onSave}
                    primary
                    disabled={!hasWriteAccess}
                >
                    {i18n.t('Update event')}
                </Button>
            </ConditionalTooltip>
        );

        render() {
            const { formHorizontal, formFoundation, ...passOnProps } = this.props;
            const hasWriteAccess = formFoundation.access.data.write;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        formHorizontal={formHorizontal}
                        formFoundation={formFoundation}
                        {...passOnProps}
                    />
                    {this.renderMainButton(hasWriteAccess)}
                </div>
            );
        }
    };

export const withMainButton = () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(null, () => ({}))(getMainButton(InnerComponent));
