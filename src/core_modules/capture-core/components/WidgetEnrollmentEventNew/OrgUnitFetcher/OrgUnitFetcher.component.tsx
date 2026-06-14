import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { Validated } from '../Validated/Validated.container';
import { useProgramLabel } from '../../../metaData';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useCoreOrgUnit(orgUnitId);
    const orgUnitLabel = useProgramLabel('orgUnit') ?? i18n.t('organisation unit');

    if (error) {
        return (
            <div>
                {i18n.t('{{orgUnit}} could not be retrieved. Please try again later.', {
                    orgUnit: orgUnitLabel,
                    interpolation: { escapeValue: false },
                })}
            </div>
        );
    }

    return (
        <Validated
            {...passOnProps}
            orgUnitContext={orgUnit}
        />
    );
};
