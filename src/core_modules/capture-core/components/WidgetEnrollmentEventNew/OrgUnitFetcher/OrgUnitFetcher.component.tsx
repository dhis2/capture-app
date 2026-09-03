import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { Validated } from '../Validated/Validated.container';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';
import { useTermLabel } from '../../../metaData';

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useCoreOrgUnit(orgUnitId);
    const orgUnitLabel = useTermLabel('orgUnit', { programId: passOnProps.program?.id });

    if (error) {
        return (
            <div>
                {i18n.t('{{orgUnitLabel}} could not be retrieved. Please try again later.', { orgUnitLabel })}
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
