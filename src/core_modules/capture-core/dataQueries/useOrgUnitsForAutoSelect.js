// @flow
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useApiMetadataQuery, useIndexedDBQuery } from '../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../storageControllers';
import { buildUrlQueryString, useLocationQuery } from '../utils/routing';

const getAllPrograms = () => {
    const userStorageController = getUserStorageController();
    return userStorageController.getAll(userStores.PROGRAMS, {
        predicate: ({ access }) => access.data.read,
        project: ({ id }) => ({ id }),
    });
};

export const useOrgUnitsForAutoSelect = () => {
    const [mounted, setMounted] = useState(false);
    const history = useHistory();
    const urlParams = useLocationQuery();

    const { data: programs, isLoading: loadingPrograms } = useIndexedDBQuery(
        ['programIds', 'data-read'],
        () => getAllPrograms(),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: Object.keys(urlParams).length === 0 && !mounted,
        },
    );

    const queryKey = ['orgUnitsForAutoSelect'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: ['id, displayName~rename(name), path'],
            withinUserHierarchy: true,
            pageSize: 2,
        },
    };
    const queryOptions = {
        enabled: !mounted,
        select: ({ organisationUnits }) => organisationUnits,
    };

    const { data: orgUnits, isLoading: loadingOrgUnits } = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    const updateUrlIfApplicable = useCallback(() => {
        const paramsToAdd = {
            programId: null,
            orgUnitId: null,
        };
        if (programs && programs.length === 1) {
            paramsToAdd.programId = programs[0].id;
        }
        if (orgUnits && orgUnits.length === 1) {
            paramsToAdd.orgUnitId = orgUnits[0].id;
        }

        if (Object.keys(paramsToAdd).length) {
            history.push(`?${buildUrlQueryString({ ...paramsToAdd })}`);
        }
    }, [history, programs, orgUnits]);

    useEffect(() => {
        if (mounted) return;
        if (Object.keys(urlParams).length > 0 || history.location.pathname !== '/') {
            setMounted(true);
            return;
        }

        if (!loadingPrograms && !loadingOrgUnits) {
            updateUrlIfApplicable();
            setMounted(true);
        }
    }, [
        programs,
        history,
        loadingPrograms,
        mounted,
        urlParams,
        loadingOrgUnits,
        orgUnits,
        updateUrlIfApplicable,
    ]);

    const isLoading = loadingPrograms || loadingOrgUnits;

    return {
        isLoading,
        orgUnits,
    };
};
