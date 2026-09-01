import React from 'react';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { Validated } from '../Validated/Validated.container';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useCoreOrgUnit(orgUnitId);
    const orgUnitLabel = useTermLabel('orgUnit');

    if (error) {
        return (
            <div>
                {tCustomTerm('{{orgUnitLabel}} could not be retrieved. Please try again later.', { orgUnitLabel })}
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
