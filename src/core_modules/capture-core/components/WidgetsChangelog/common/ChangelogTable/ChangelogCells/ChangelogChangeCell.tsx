import React from 'react';
import log from 'loglevel';
import { Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { CHANGE_TYPES } from '../../Changelog/Changelog.constants';
import { errorCreator } from '../../../../../../capture-core-utils';

type Config = {
    label: string;
    variant: {
        neutral?: boolean;
        positive?: boolean;
        negative?: boolean;
    };
};

const changeTypeConfigs = {
    [CHANGE_TYPES.UPDATED]: { label: i18n.t('Updated') as string, variant: { neutral: true } },
    [CHANGE_TYPES.CREATED]: { label: i18n.t('Created') as string, variant: { positive: true } },
    [CHANGE_TYPES.DELETED]: { label: i18n.t('Deleted') as string, variant: { negative: true } },
};

const ChangelogChangeComponent = ({ label, variant }: Config) => (
    <Tag {...variant}>
        {label}
    </Tag>
);

type Props = {
    changeType: string;
};

export const ChangelogChangeCell = ({ changeType }: Props) => {
    const config = changeTypeConfigs[changeType];

    if (!config) {
        log.error(errorCreator('Changelog component not found')({ changeType }));
        return null;
    }

    return (
        <ChangelogChangeComponent {...config} />
    );
};
