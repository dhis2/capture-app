import React, { useMemo } from 'react';
import {
    Button,
    ButtonStrip,
    hasValue,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    ReactFinalForm,
    TextAreaFieldFF,
} from '@dhis2/ui';

const { Form, Field } = ReactFinalForm;

export const ProvideCommentModal = ({ setOpenStatus, submitFunc }) => useMemo(() => (
    <Form onSubmit={submitFunc}>
        {({ handleSubmit }) => (
            <Modal
                small
                onClose={() => setOpenStatus(false)}
            >
                <ModalTitle>Comment</ModalTitle>
                <form onSubmit={handleSubmit}>
                    <ModalContent>
                        <Field
                            name={'comment'}
                            label={''}
                            helpText={'Please provide a reason to why the management is not performed'}
                            component={TextAreaFieldFF}
                            validate={hasValue}
                            autoGrow
                            resize={'none'}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                primary
                                type={'submit'}
                            >
                                Add comment
                            </Button>
                            <Button
                                onClick={() => setOpenStatus(false)}
                                secondary
                            >Cancel</Button>
                        </ButtonStrip>
                    </ModalActions>
                </form>
            </Modal>
        )}
    </Form>
), [setOpenStatus, submitFunc]);
