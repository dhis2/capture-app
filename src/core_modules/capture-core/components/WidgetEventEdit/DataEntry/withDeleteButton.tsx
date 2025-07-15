import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props, State } from './withDeleteButton.types';

const getDeleteButton = (InnerComponent: React.ComponentType<any>) =>
    class DeleteButtonHOC extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                isOpen: false,
            };
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        innerInstance: any;

        renderDeleteButton = (hasDeleteButton?: boolean) => (
            hasDeleteButton ? (<div>
                <Button
                    onClick={() => { this.setState({ isOpen: true }); }}
                    disabled={!this.props.formFoundation.access.data.write}
                    secondary
                    destructive
                >
                    {i18n.t('Delete event')}
                </Button>
                {this.state.isOpen && (
                    <Modal
                        hide={!this.state.isOpen}
                    >
                        <ModalTitle>
                            {i18n.t('Delete event')}
                        </ModalTitle>
                        <ModalContent>
                            {i18n.t('Deleting an event is permanent and cannot be undone.' + ' ' +
                                'Are you sure you want to delete this event? ')}
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
                                    {i18n.t('Yes, delete event')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </Modal>
                )}
            </div>) : null
        );

        render() {
            const { onDelete, hasDeleteButton, ...passOnProps } = this.props;

            return (
                <InnerComponent
                    innerRef={(innerInstance) => { this.innerInstance = innerInstance; }}
                    deleteButton={this.renderDeleteButton(hasDeleteButton)}
                    {...passOnProps}
                />
            );
        }
    };


export const withDeleteButton = () => (InnerComponent: React.ComponentType<any>) => getDeleteButton(InnerComponent);
