import type { ReactNode } from 'react';
import type { CoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit/coreOrgUnit.types';

export type OrgUnitFetcherProps = {
    orgUnitId: string;
    children: ReactNode;
    error?: boolean;
};

export type FetchOrgUnitActionPayload = {
    orgUnitId: string;
};

export type SetCurrentOrgUnitActionPayload = CoreOrgUnit;
