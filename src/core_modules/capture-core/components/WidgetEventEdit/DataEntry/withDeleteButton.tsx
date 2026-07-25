import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { useStageLabel } from '../../../metaData';
import type { Props, State } from './withDeleteButton.types';

const DeleteEventModal = ({
    onCancel,
    onConfirm,
}: {
    onCancel: () => void;
    onConfirm: () => void;
}) => {
    const event = useStageLabel('event') ?? i18n.t('event');
    return (
        <Modal hide={false}>
            <ModalTitle>
                {i18n.t('Delete {{event}}', { event, interpolation: { escapeValue: false } })}
            </ModalTitle>
            <ModalContent>
                {i18n.t('Deleting an {{event}} is permanent and cannot be undone.', {
                    event,
                    interpolation: { escapeValue: false },
                })}
                {' '}
                {i18n.t('Are you sure you want to delete this {{event}}? ', {
                    event,
                    interpolation: { escapeValue: false },
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button onClick={onConfirm} destructive>
                        {i18n.t('Yes, delete {{event}}', { event, interpolation: { escapeValue: false } })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

const getDeleteButton = (InnerComponent: React.ComponentType<any>) =>
    class DeleteButtonHOC extends React.Component<Props, State> {
        innerInstance: any;
        constructor(props: Props) {
            super(props);
            this.state = {
                isOpen: false,
            };
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        renderDeleteButton = (hasDeleteButton?: boolean) => (
            hasDeleteButton ? (<div>
                <Button
                    onClick={() => { this.setState({ isOpen: true }); }}
                    disabled={!this.props.formFoundation.access.data.write}
                    destructive
                >
                    {i18n.t('Delete')}
                </Button>
                {this.state.isOpen && (
                    <DeleteEventModal
                        onCancel={() => this.setState({ isOpen: false })}
                        onConfirm={() => {
                            this.props.onDelete();
                            this.setState({ isOpen: false });
                        }}
                    />
                )}
            </div>) : null
        );

        render() {
            const { onDelete, hasDeleteButton, ...passOnProps } = this.props;

            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    deleteButton={this.renderDeleteButton(hasDeleteButton)}
                    {...passOnProps}
                />
            );
        }
    };


export const withDeleteButton = () => (InnerComponent: React.ComponentType<any>) => getDeleteButton(InnerComponent);
