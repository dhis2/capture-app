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
import { tCustomTerm } from '../../../../utils/tCustomTerm';

export const Delete = ({ canCascadeDeleteEnrollment, enrollment, onDelete }: Props) => {
    const [toggle, setToggle] = useState(false);
    const disabled = !canCascadeDeleteEnrollment;
    const enrollmentLabel = useTermLabel('enrollment');
    const tooltipContent = tCustomTerm('You do not have access to delete this {{enrollmentLabel}}', { enrollmentLabel });

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
                    <ModalTitle>{tCustomTerm('Delete {{enrollmentLabel}}', { enrollmentLabel })}</ModalTitle>
                    <ModalContent>
                        {tCustomTerm('Are you sure you want to delete this {{enrollmentLabel}}?', { enrollmentLabel })}
                        {' '}
                        {tCustomTerm('This will permanently remove the current {{enrollmentLabel}}.', { enrollmentLabel })}
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
                                {tCustomTerm('Yes, delete {{enrollmentLabel}}.', { enrollmentLabel })}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </ConditionalTooltip>
    );
};
