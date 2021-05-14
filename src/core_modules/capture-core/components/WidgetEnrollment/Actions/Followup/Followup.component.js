// @flow
import { IconFlag16, MenuItem } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './followup.types';

export const Followup = ({ enrollment, mutate }: Props) =>
    (enrollment.followup ? (
        <MenuItem
            dense
            onClick={async () =>
                mutate({
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
            onClick={async () =>
                mutate({
                    ...enrollment,
                    followup: true,
                })
            }
            icon={<IconFlag16 />}
            label={i18n.t('Mark for follow-up')}
        />
    ));
