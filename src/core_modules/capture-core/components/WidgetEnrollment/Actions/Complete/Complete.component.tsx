import React from 'react';
import { IconCheckmark16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './complete.types';
import { plainStatus, eventStatuses } from '../../constants/status.const';

export const Complete = ({ enrollment, events, onUpdate, setOpenCompleteModal }: Props) => {
    const hasActiveEvents = events?.some(event => event.status === eventStatuses.ACTIVE);

    if (enrollment.status === plainStatus.COMPLETED) {
        return (
            <MenuItem
                dense
                dataTest="widget-enrollment-actions-incomplete"
                onClick={() =>
                    onUpdate({
                        ...enrollment,
                        status: plainStatus.ACTIVE,
                    })
                }
                icon={<IconCheckmark16 />}
                label={i18n.t('Mark as incomplete') as string}
                suffix=""
            />
        );
    }

    if (hasActiveEvents) {
        return (
            <MenuItem
                dense
                dataTest="widget-enrollment-actions-complete-modal"
                onClick={() => setOpenCompleteModal(true)}
                icon={<IconCheckmark16 />}
                label={i18n.t('Complete') as string}
                suffix=""
            />
        );
    }

    return (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-complete"
            onClick={() =>
                onUpdate({
                    ...enrollment,
                    status: plainStatus.COMPLETED,
                })
            }
            icon={<IconCheckmark16 />}
            label={i18n.t('Complete') as string}
            suffix=""
        />
    );
};
