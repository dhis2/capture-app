import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import type { RenderFoundation } from '../../metaData';
import { getTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';
import { addEventSaveTypes } from '../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';

type Props = {
    onCancelCreateNew: (itemId: string) => void;
    onConfirmCreateNew: (itemId: string) => void;
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string) => void;
    allowGenerateNextVisit?: boolean;
    askCompleteEnrollmentOnEventComplete?: boolean;
    availableProgramStages?: Array<Record<string, any>>;
    isCompleted?: boolean;
    itemId: string;
    programId: string;
};

type State = {
    isOpen: boolean;
};

const askToCreateNewComponent = (InnerComponent: React.ComponentType<any>) =>
    class AskToCreateNewHOC extends React.Component<Props, State> {
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
            const eventLabel = getTermLabel(this.props.programId, 'event');
            return (
                <Modal
                    hide={!this.state.isOpen}
                    dataTest="modal-ask-to-create-new"
                >
                    <ModalTitle>
                        {tCustomTerm('Generate new {{eventLabel}}', { eventLabel })}
                    </ModalTitle>
                    <ModalContent>
                        {tCustomTerm('Do you want to create another {{eventLabel}}?', { eventLabel })}
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
                                {tCustomTerm('Yes, create new {{eventLabel}}', { eventLabel })}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            );
        }

        render() {
            const { onSave, isCompleted, ...passOnProps } = this.props;

            return (
                <>
                    <InnerComponent
                        ref={(innerInstance: any) => { this.innerInstance = innerInstance; }}
                        onSave={this.handleOnSave}
                        {...passOnProps}
                    />
                    {this.renderAskToCreateNewModal()}
                </>
            );
        }
    };


export const withAskToCreateNew = () => (InnerComponent: React.ComponentType<any>) =>
    askToCreateNewComponent(InnerComponent);
