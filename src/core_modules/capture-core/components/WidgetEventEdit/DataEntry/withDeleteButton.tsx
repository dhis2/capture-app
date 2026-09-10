import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props, State } from './withDeleteButton.types';
import { LabelKeys } from '../../../metaData';
import { withCustomLabels } from '../../../HOC/withCustomLabels';

const customLabels = [LabelKeys.eventSingular] as const;

type LabelProps = {
    eventLabel: string;
};

type PropsWithLabel = Props & LabelProps;

const getDeleteButton = (InnerComponent: React.ComponentType<any>) =>
    class DeleteButtonHOC extends React.Component<PropsWithLabel, State> {
        innerInstance: any;
        constructor(props: PropsWithLabel) {
            super(props);
            this.state = {
                isOpen: false,
            };
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        renderDeleteButton = (hasDeleteButton?: boolean) => {
            const { eventLabel } = this.props;
            return (
                hasDeleteButton ? (<div>
                    <Button
                        onClick={() => { this.setState({ isOpen: true }); }}
                        disabled={!this.props.formFoundation.access.data.write}
                        destructive
                    >
                        {i18n.t('Delete')}
                    </Button>
                    {this.state.isOpen && (
                        <Modal
                            hide={!this.state.isOpen}
                        >
                            <ModalTitle>
                                {i18n.t('Delete {{eventLabel}}', { eventLabel })}
                            </ModalTitle>
                            <ModalContent>
                                {i18n.t(
                                    'Deleting an {{eventLabel}} is permanent and cannot be undone.',
                                    { eventLabel },
                                )}
                                {' '}
                                {i18n.t('Are you sure you want to delete this {{eventLabel}}? ', { eventLabel })}
                            </ModalContent>
                            <ModalActions>
                                <ButtonStrip end>
                                    <Button
                                        onClick={() => {
                                            this.setState({ isOpen: false });
                                        }}
                                        secondary
                                    >
                                        {i18n.t('No, cancel')}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            this.props.onDelete();
                                            this.setState({ isOpen: false });
                                        }}
                                        destructive
                                    >
                                        {i18n.t('Yes, delete {{eventLabel}}', { eventLabel })}
                                    </Button>
                                </ButtonStrip>
                            </ModalActions>
                        </Modal>
                    )}
                </div>) : null
            );
        };

        render() {
            const { onDelete, hasDeleteButton, eventLabel, ...passOnProps } = this.props;

            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    deleteButton={this.renderDeleteButton(hasDeleteButton)}
                    {...passOnProps}
                />
            );
        }
    };


export const withDeleteButton = () => (InnerComponent: React.ComponentType<any>) =>
    withCustomLabels(customLabels)(getDeleteButton(InnerComponent));
