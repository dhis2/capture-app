// @flow
import { useMemo, useRef, useState } from 'react';
import { mainStores } from '../../storageControllers/stores';
import { getMainStorageController } from '../../storageControllers';

export const useSystemSettingsFromIndexedDB = (
    key: string,
): {| [key: string]: string, loading: boolean, error?: boolean |} => {
    const [cachedSystemSettings, setCachedSystemSettings] = useState({ });
    const [loading, setLoading] = useState(true);
    const error = useRef();
    const storageController = getMainStorageController();

    useMemo(() => {
        storageController
            .get(mainStores.SYSTEM_SETTINGS, key)
            .then((response) => {
                setCachedSystemSettings({ [key]: response?.value });
                setLoading(false);
            })
            .catch((e) => {
                error.current = e;
            });
    }, [storageController, key]);

    return {
        loading,
        error: error.current,
        [key]: cachedSystemSettings[key],
    };
};
