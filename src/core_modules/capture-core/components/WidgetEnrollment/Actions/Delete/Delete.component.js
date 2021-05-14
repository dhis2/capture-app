// @flow
import {
    IconDelete16,
    MenuItem,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './delete.types';

export const Delete = ({ deleteAction }: Props) => {
    const [toggle, setToggle] = useState(false);

    return (
        <div>
            <MenuItem
                dense
                icon={<IconDelete16 />}
                destructive
                label={i18n.t('Delete')}
                onClick={() => setToggle(true)}
            />

            {toggle && (
                <Modal small onClose={() => setToggle(false)}>
                    <ModalTitle>Delete enrollment</ModalTitle>
                    <ModalContent>
                        Are you sure you want to delete this enrollment? This
                        will permanently remove the current enrollment.
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={() => setToggle(false)} secondary>
                                No, cancel
                            </Button>
                            <Button destructive onClick={() => deleteAction()}>
                                Yes, delete enrollment.
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};
