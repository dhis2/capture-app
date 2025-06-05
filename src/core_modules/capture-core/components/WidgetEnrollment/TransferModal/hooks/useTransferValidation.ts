import { useEffect, useMemo, useState } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { ProgramAccessLevels, useProgramAccessLevel } from './useProgramAccessLevel';

type OrgUnit = {
    id: string;
    path: string[];
};

type Props = {
    programId: string;
    ownerOrgUnitId: string;
};

export const OrgUnitScopes = Object.freeze({
    CAPTURE: 'CAPTURE',
    SEARCH: 'SEARCH',
});

const orgUnitIsInCaptureScope = async (orgUnitId: string, dataEngine: { query: (query: any) => Promise<any> }) => {
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
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<OrgUnit | undefined>();
    const [orgUnitScopes, setOrgUnitScopes] = useState<{
        origin: keyof typeof OrgUnitScopes | null;
        destination: keyof typeof OrgUnitScopes | null;
    }>({
        origin: null,
        destination: null,
    });
    const { accessLevel } = useProgramAccessLevel({ programId });

    const ready = useMemo(() => !!accessLevel && !!orgUnitScopes.origin,
        [accessLevel, orgUnitScopes.origin]);

    useEffect(() => {
        const updateOriginScope = (newScope: keyof typeof OrgUnitScopes) => setOrgUnitScopes(
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

    const updateDestinationScope = (newScope: keyof typeof OrgUnitScopes) => setOrgUnitScopes(
        prevOrgUnitScopes => ({
            ...prevOrgUnitScopes,
            destination: newScope,
        }),
    );

    const handleOrgUnitChange = async (orgUnit: OrgUnit) => {
        if (!orgUnit || orgUnit.id === selectedOrgUnit?.id) return;

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
