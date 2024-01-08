// @flow
import React, { Component } from 'react';
import { CircularLoader, Modal, ModalContent } from '@dhis2/ui';

type Props = {
};

export class DialogLoadingMask extends Component<Props> {
    render() {
        return (
            <Modal
                hide={false}
            >
                <ModalContent>
                    <CircularLoader />
                </ModalContent>
            </Modal>
        );
    }
}
