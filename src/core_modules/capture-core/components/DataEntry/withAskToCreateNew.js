// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { type RenderFoundation } from '../../metaData';
import { addEventSaveTypes } from '../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';

type Props = {
    onCancelCreateNew: (itemId: string) => void,
    onConfirmCreateNew: (itemId: string) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => void,
    allowGenerateNextVisit?: ?boolean,
    askCompleteEnrollmentOnEventComplete?: ?boolean,
    availableProgramStages?: ?Array<Object>,
    isCompleted?: boolean,
    itemId: string
};

type State = {
    isOpen: boolean,
}

const askToCreateNewComponent = (InnerComponent: React.ComponentType<any>) =>
    class AskToCreateNewHOC extends React.Component<Props, State> {
        handleOnSave: () => void;
        innerInstance: any;
        constructor(props: Props) {
            super(props);
            this.state = {
                isOpen: false,
            };
            this.handleOnSave = this.handleOnSave.bind(this);
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        handleOnSave(eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string) {
            if (this.props.allowGenerateNextVisit &&
                this.props.availableProgramStages &&
                this.props.availableProgramStages.length > 0 &&
                (this.props.isCompleted || saveType === addEventSaveTypes.COMPLETE) &&
                !this.props.askCompleteEnrollmentOnEventComplete
            ) {
                this.setState({ isOpen: true });
            } else {
                this.props.onSave(eventId, dataEntryId, formFoundation, saveType);
            }
        }

        renderAskToCreateNewModal = () => {
            if (!this.state.isOpen) {
                return null;
            }

            return (
                <Modal
                    hide={!this.state.isOpen}
                    dataTest="modal-ask-to-create-new"
                >
                    <ModalTitle>
                        {i18n.t('Generate new event')}
                    </ModalTitle>
                    <ModalContent>
                        {i18n.t('Do you want to create another event?')}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button
                                onClick={() => {
                                    this.props.onCancelCreateNew(this.props.itemId);
                                    this.setState({ isOpen: false });
                                }}
                                secondary
                            >
                                {i18n.t('No, cancel')}
                            </Button>
                            <Button
                                onClick={() => {
                                    this.props.onConfirmCreateNew(this.props.itemId);
                                    this.setState({ isOpen: false });
                                }}
                                primary
                            >
                                {i18n.t('Yes, create new event')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            );
        }

        render() {
            const { onSave, ...passOnProps } = this.props;

            return (
                <>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        innerRef={(innerInstance) => { this.innerInstance = innerInstance; }}
                        onSave={this.handleOnSave}
                        {...passOnProps}
                    />
                    {this.renderAskToCreateNewModal()}
                </>
            );
        }
    };


export const withAskToCreateNew = () => (InnerComponent: React.ComponentType<any>) => askToCreateNewComponent(InnerComponent);
