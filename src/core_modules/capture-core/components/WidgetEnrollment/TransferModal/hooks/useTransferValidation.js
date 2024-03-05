// @flow
import { useEffect, useMemo, useState } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { ProgramAccessLevels, useProgramAccessLevel } from './useProgramAccessLevel';

type OrgUnit = {
    id: string,
    path: Array<string>,
};

type Props = {
    programId: string,
    ownerOrgUnitId: string,
};

export const OrgUnitScopes = Object.freeze({
    CAPTURE: 'CAPTURE',
    SEARCH: 'SEARCH',
});

const orgUnitIsInCaptureScope = async (orgUnitId: string, dataEngine: { query: (Object) => Promise<Object> }) => {
    const captureScopeQuery = await dataEngine.query({
        captureOrgUnits: {
            resource: 'organisationUnits',
            params: {
                query: orgUnitId,
                withinUserHierarchy: true,
                fields: 'id',
            },
        },
    });

    return captureScopeQuery?.captureOrgUnits?.organisationUnits?.length > 0;
};


export const useTransferValidation = ({ ownerOrgUnitId, programId }: Props) => {
    const dataEngine = useDataEngine();
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<?OrgUnit>();
    const [orgUnitScopes, setOrgUnitScopes] = useState({
        origin: null,
        destination: null,
    });
    const { accessLevel } = useProgramAccessLevel({ programId });

    const ready = useMemo(() => !!accessLevel && !!orgUnitScopes.origin,
        [accessLevel, orgUnitScopes.origin]);

    useEffect(() => {
        const updateOriginScope = (newScope: $Values<typeof OrgUnitScopes>) => setOrgUnitScopes(
            prevOrgUnitScopes => ({
                ...prevOrgUnitScopes,
                origin: newScope,
            }),
        );

        orgUnitIsInCaptureScope(ownerOrgUnitId, dataEngine).then((isInCaptureScope) => {
            const scope = isInCaptureScope ? OrgUnitScopes.CAPTURE : OrgUnitScopes.SEARCH;
            updateOriginScope(scope);
        });
    }, [dataEngine, ownerOrgUnitId]);

    const updateDestinationScope = (newScope: $Values<typeof OrgUnitScopes>) => setOrgUnitScopes(
        prevOrgUnitScopes => ({
            ...prevOrgUnitScopes,
            destination: newScope,
        }),
    );

    const handleOrgUnitChange = async (orgUnit: OrgUnit) => {
        if (!orgUnit || orgUnit.id === selectedOrgUnit) return;

        if (accessLevel === ProgramAccessLevels.OPEN || accessLevel === ProgramAccessLevels.AUDITED) {
            updateDestinationScope(OrgUnitScopes.CAPTURE);
        }
        if (accessLevel === ProgramAccessLevels.PROTECTED || accessLevel === ProgramAccessLevels.CLOSED) {
            const isInCaptureScope = await orgUnitIsInCaptureScope(orgUnit.id, dataEngine);
            const scope = isInCaptureScope ? OrgUnitScopes.CAPTURE : OrgUnitScopes.SEARCH;
            updateDestinationScope(scope);
        }
        setSelectedOrgUnit(orgUnit);
    };

    return {
        handleOrgUnitChange,
        selectedOrgUnit,
        programAccessLevel: accessLevel,
        orgUnitScopes,
        ready,
    };
};
