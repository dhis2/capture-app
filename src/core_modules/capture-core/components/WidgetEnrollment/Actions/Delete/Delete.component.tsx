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
import { useTermLabel } from '../../../../metaData';

export const Delete = ({ canCascadeDeleteEnrollment, enrollment, onDelete }: Props) => {
    const [toggle, setToggle] = useState(false);
    const disabled = !canCascadeDeleteEnrollment;
    const enrollmentLabel = useTermLabel('enrollment');
    const tooltipContent = i18n.t('You do not have access to delete this {{enrollmentLabel}}', { enrollmentLabel });

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
                    <ModalTitle>{i18n.t('Delete {{enrollmentLabel}}', { enrollmentLabel })}</ModalTitle>
                    <ModalContent>
                        {i18n.t('Are you sure you want to delete this {{enrollmentLabel}}?', { enrollmentLabel })}
                        {' '}
                        {i18n.t('This will permanently remove the current {{enrollmentLabel}}.', { enrollmentLabel })}
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
                                {i18n.t('Yes, delete {{enrollmentLabel}}.', { enrollmentLabel })}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </ConditionalTooltip>
    );
};
