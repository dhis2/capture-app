import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIndexedDBQuery } from '../../../utils/reactQueryHelpers';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../storageControllers';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { useOrgUnitAutoSelect } from '../../../dataQueries';

const getAllPrograms = () => {
    const userStorageController = getUserMetadataStorageController();
    return userStorageController.getAll(USER_METADATA_STORES.PROGRAMS, {
        predicate: ({ access }) => access.data.read,
        project: ({ id }) => ({ id }),
    });
};

export const useMetadataAutoSelect = () => {
    const [mounted, setMounted] = useState(false);
    const history = useHistory();
    const { navigate } = useNavigate();
    const urlParams = useLocationQuery();

    const { data: programs, isInitialLoading: loadingPrograms } = useIndexedDBQuery(
        ['programIds', 'data-read'],
        () => getAllPrograms(),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            enabled: Object.keys(urlParams).length === 0 && !mounted,
        },
    );

    const queryOptions = { enabled: Object.keys(urlParams).length === 0 && !mounted };
    const { isLoading: loadingOrgUnits, data: searchOrgUnits } = useOrgUnitAutoSelect(queryOptions);

    const updateUrlIfApplicable = useCallback(() => {
        const paramsToAdd = {
            programId: null,
            orgUnitId: null,
        };
        if (programs && programs.length === 1) {
            paramsToAdd.programId = programs[0].id;
        }
        if (searchOrgUnits && (searchOrgUnits as any).length === 1) {
            paramsToAdd.orgUnitId = searchOrgUnits[0].id;
        }

        if (Object.keys(paramsToAdd).length) {
            navigate(`?${buildUrlQueryString({ ...paramsToAdd })}`);
        }
    }, [navigate, programs, searchOrgUnits]);

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
        searchOrgUnits,
        updateUrlIfApplicable,
    ]);

    return {
        isReady: mounted,
    };
};
