// @flow
// TODO: Move / get rid
import { useMemo, useRef, useState } from 'react';
import {
    getCachedResourceAsync,
} from '../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../../storageControllers/stores';

export const useRelationshipTypes = () => {
    const [cachedTypes, setCachedTypes] = useState();
    const [loading, setLoading] = useState(true);
    const error = useRef();
    useMemo(() => {
        getCachedResourceAsync(userStores.RELATIONSHIP_TYPES)
            .then((relationshipTypes) => {
                setCachedTypes(relationshipTypes?.response);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    return {
        loading,
        error: error.current,
        relationshipTypes: cachedTypes,
    };
};
