// @flow
import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './followup.types';

export const Followup = ({ enrollment, onUpdate }: Props) =>
    (enrollment.followup ? (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-followup-remove"
            onClick={() =>
                onUpdate({
                    ...enrollment,
                    followup: false,
                })
            }
            icon={<IconFlag16 />}
            label={i18n.t('Remove mark for follow-up')}
        />
    ) : (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-followup-mark"
            onClick={() =>
                onUpdate({
                    ...enrollment,
                    followup: true,
                })
            }
            icon={<IconFlag16 />}
            label={i18n.t('Mark for follow-up')}
        />
    ));
