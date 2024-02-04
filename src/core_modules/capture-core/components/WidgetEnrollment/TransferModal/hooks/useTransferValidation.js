// @flow
import { useEffect, useState } from 'react';
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
    const captureScopeQuery = dataEngine.query({
        orgUnits: {
            resource: 'organisationUnits',
            params: {
                paging: false,
                userOnly: true,
                fields: 'id,displayName',
            },
        },
    });

    const ancestorsQuery = dataEngine.query({
        ancestors: {
            resource: 'organisationUnits',
            id: orgUnitId,
            params: {
                fields: 'ancestors[id,displayName]',
            },
        },
    });

    const result = await Promise.all([
        captureScopeQuery,
        ancestorsQuery,
    ]);

    const [{ orgUnits: { organisationUnits } }, { ancestors: { ancestors } }] = result;
    ancestors.push({ id: orgUnitId });
    return ancestors.some(({ id: ancestorId }) => organisationUnits.some(({ id }) => ancestorId === id));
};

export const useTransferValidation = ({ ownerOrgUnitId, programId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<?OrgUnit>();
    const [orgUnitScopes, setOrgUnitScopes] = useState({
        ORIGIN: null,
        DESTINATION: null,
    });
    const dataEngine = useDataEngine();
    const { accessLevel } = useProgramAccessLevel({ programId });

    useEffect(() => {
        const updateOriginScope = (newScope: $Values<typeof OrgUnitScopes>) => setOrgUnitScopes(
            prevOrgUnitScopes => ({
                ...prevOrgUnitScopes,
                ORIGIN: newScope,
            }),
        );

        orgUnitIsInCaptureScope(ownerOrgUnitId, dataEngine).then((isInCaptureScope) => {
            if (isInCaptureScope) {
                updateOriginScope(OrgUnitScopes.CAPTURE);
            } else {
                updateOriginScope(OrgUnitScopes.SEARCH);
            }
        });
    }, [dataEngine, ownerOrgUnitId]);

    const updateDestinationScope = (newScope: $Values<typeof OrgUnitScopes>) => setOrgUnitScopes(
        prevOrgUnitScopes => ({
            ...prevOrgUnitScopes,
            DESTINATION: newScope,
        }),
    );

    const handleOrgUnitChange = async (orgUnit: OrgUnit) => {
        if (!orgUnit || orgUnit.id === selectedOrgUnit) return;
        setLoading(true);
        if (accessLevel === ProgramAccessLevels.OPEN || accessLevel === ProgramAccessLevels.AUDITED) {
            updateDestinationScope(OrgUnitScopes.CAPTURE);
        }
        if (accessLevel === ProgramAccessLevels.PROTECTED || accessLevel === ProgramAccessLevels.CLOSED) {
            const isInCaptureScope = await orgUnitIsInCaptureScope(orgUnit.id, dataEngine);
            if (isInCaptureScope) {
                updateDestinationScope(OrgUnitScopes.CAPTURE);
            } else {
                updateDestinationScope(OrgUnitScopes.SEARCH);
            }
        }
        setSelectedOrgUnit(orgUnit);
        setLoading(false);
    };

    return {
        handleOrgUnitChange,
        loading,
        selectedOrgUnit,
        programAccessLevel: accessLevel,
        orgUnitScopes,
    };
};
