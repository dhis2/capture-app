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
                    secondary
                    destructive
                >
                    {i18n.t('Delete event')}
                </Button>
                {this.state.isOpen && (
                    <Modal
                        hide={!this.state.isOpen}
                        onClose={() => { this.setState({ isOpen: false }); }}
                        position="middle"
                    >
                        <ModalTitle>
                            {i18n.t('Delete event')}
                        </ModalTitle>
                        <ModalContent>
                            {i18n.t('Are you sure you want to delete this event? This action cannot be undone.')}
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button
                                    onClick={() => { this.setState({ isOpen: false }); }}
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
            const { hasDeleteButton, formHorizontal, formFoundation, ...passOnProps } = this.props;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        formHorizontal={formHorizontal}
                        formFoundation={formFoundation}
                        {...passOnProps}
                    />
                    {this.renderDeleteButton(hasDeleteButton)}
                </div>
            );
        }
    };


export const withDeleteButton = () => (InnerComponent: React.ComponentType<any>) => getDeleteButton(InnerComponent);
