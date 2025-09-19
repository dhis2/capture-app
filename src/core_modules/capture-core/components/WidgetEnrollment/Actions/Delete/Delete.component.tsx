import React, { useState } from 'react';
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
import i18n from '@dhis2/d2-i18n';
import type { Props } from './delete.types';
import { ConditionalTooltip } from '../../../Tooltips/ConditionalTooltip/';

export const Delete = ({ canCascadeDeleteEnrollment, enrollment, onDelete }: Props) => {
    const [toggle, setToggle] = useState(false);
    const disabled = !canCascadeDeleteEnrollment;
    const tooltipContent = i18n.t('You do not have access to delete this enrollment');

    return (
        <ConditionalTooltip content={tooltipContent} enabled={disabled}>
            <MenuItem
                dense
                dataTest="widget-enrollment-actions-delete"
                disabled={disabled}
                icon={<IconDelete16 />}
                destructive
                label={i18n.t('Delete')}
                onClick={() => setToggle(true)}
                suffix=""
            />

            {toggle && (
                <Modal
                    small
                    onClose={() => setToggle(false)}
                    dataTest="widget-enrollment-actions-modal"
                >
                    <ModalTitle>{i18n.t('Delete enrollment')}</ModalTitle>
                    <ModalContent>
                        {i18n.t(
                            'Are you sure you want to delete this enrollment? This will permanently remove the current enrollment.',
                        )}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={() => setToggle(false)} secondary>
                                {i18n.t('No, cancel')}
                            </Button>
                            <Button
                                destructive
                                onClick={() => onDelete(enrollment)}
                            >
                                {i18n.t('Yes, delete enrollment.')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </ConditionalTooltip>
    );
};
