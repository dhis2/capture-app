import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { Props, State } from './withDeleteButton.types';
import { getTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

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

        renderDeleteButton = (hasDeleteButton?: boolean) => {
            const eventLabel = getTermLabel('event', { programId: this.props.programId });
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
                                {tCustomTerm('Delete {{eventLabel}}', { eventLabel })}
                            </ModalTitle>
                            <ModalContent>
                                {tCustomTerm(
                                    'Deleting an {{eventLabel}} is permanent and cannot be undone.',
                                    { eventLabel },
                                )}
                                {' '}
                                {tCustomTerm('Are you sure you want to delete this {{eventLabel}}? ', { eventLabel })}
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
                                        {tCustomTerm('Yes, delete {{eventLabel}}', { eventLabel })}
                                    </Button>
                                </ButtonStrip>
                            </ModalActions>
                        </Modal>
                    )}
                </div>) : null
            );
        };

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
