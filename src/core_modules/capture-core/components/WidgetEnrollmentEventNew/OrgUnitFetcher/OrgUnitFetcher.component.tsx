import React from 'react';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { Validated } from '../Validated/Validated.container';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';
import { useTermLabel } from '../../../metaData';
import { customTerms } from '../../../utils/customTerms';

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useCoreOrgUnit(orgUnitId);
    const orgUnitLabel = useTermLabel('orgUnit', { programId: passOnProps.program?.id });

    if (error) {
        return (
            <div>
                {customTerms.i18n.t('{{orgUnitLabel}} could not be retrieved. Please try again later.', { orgUnitLabel })}
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
