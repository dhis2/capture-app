// @flow
import React from 'react';
import { IconCheckmark16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { plainStatus } from '../../constants/status.const';
import type { Props } from './complete.types';

export const Complete = ({ enrollment, onUpdate }: Props) =>
    (enrollment.status === plainStatus.COMPLETED ? (
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
            label={i18n.t('Mark incomplete')}
        />
    ) : (
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
            label={i18n.t('Completed')}
        />
    ));
