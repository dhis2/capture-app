// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import { type RenderFoundation } from '../../../metaData';

type Props = {
    onCancelCreateNew: () => void,
    onConfirmCreateNew: () => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation?: RenderFoundation) => void,
    allowGenerateNextVisit?: ?boolean,
    isCompleted?: ?boolean
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

        handleOnSave(eventId: string, dataEntryId: string, formFoundation?: RenderFoundation) {
            if (this.props.allowGenerateNextVisit && this.props.isCompleted) {
                this.setState({ isOpen: true });
            } else {
                this.props.onSave(eventId, dataEntryId, formFoundation);
            }
        }

        renderAskToCreateNewModal = () => (
            <Modal
                hide={!this.state.isOpen}
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
                                this.props.onCancelCreateNew();
                                this.setState({ isOpen: false });
                            }}
                            secondary
                        >
                            {i18n.t('No, cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                this.props.onConfirmCreateNew();
                                this.setState({ isOpen: false });
                            }}
                            primary
                        >
                            {i18n.t('Yes, create new event')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        )

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
