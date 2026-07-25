import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { type RenderFoundation, useStageLabel } from '../../metaData';
import { addEventSaveTypes } from '../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';

const AskToCreateNewModal = ({
    onCancel,
    onConfirm,
}: {
    onCancel: () => void;
    onConfirm: () => void;
}) => {
    const event = useStageLabel('event') ?? i18n.t('event');
    return (
        <Modal hide={false} dataTest="modal-ask-to-create-new">
            <ModalTitle>
                {i18n.t('Generate new {{event}}', { event, interpolation: { escapeValue: false } })}
            </ModalTitle>
            <ModalContent>
                {i18n.t('Do you want to create another {{event}}?', {
                    event,
                    interpolation: { escapeValue: false },
                })}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onCancel} secondary>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button onClick={onConfirm} primary>
                        {i18n.t('Yes, create new {{event}}', {
                            event,
                            interpolation: { escapeValue: false },
                        })}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

type Props = {
    onCancelCreateNew: (itemId: string) => void;
    onConfirmCreateNew: (itemId: string) => void;
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string) => void;
    allowGenerateNextVisit?: boolean;
    askCompleteEnrollmentOnEventComplete?: boolean;
    availableProgramStages?: Array<Record<string, any>>;
    isCompleted?: boolean;
    itemId: string;
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

            return (
                <AskToCreateNewModal
                    onCancel={() => {
                        this.props.onCancelCreateNew(this.props.itemId);
                        this.setState({ isOpen: false });
                    }}
                    onConfirm={() => {
                        this.props.onConfirmCreateNew(this.props.itemId);
                        this.setState({ isOpen: false });
                    }}
                />
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
