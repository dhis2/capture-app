import { useCallback, useEffect, useRef, useState } from 'react';
import log from 'loglevel';
import { errorCreator, makeCancelablePromise } from 'capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';

export type CategoryOptionEntry = {
    label: string;
    value: string;
    writeAccess: boolean;
};

export type LoadedCategory = {
    id: string;
    label: string;
    options: Array<CategoryOptionEntry>;
};

export const getOptionsAsync = async (
    category: { id: string; displayName: string },
    orgUnitId: string | null | undefined,
    onIsAborted: () => boolean,
): Promise<LoadedCategory> => {
    const predicate = (categoryOption: any) => {
        if (!orgUnitId) {
            return true;
        }

        const orgUnits = categoryOption.organisationUnits;
        if (!orgUnits) {
            return true;
        }

        return !!orgUnits[orgUnitId];
    };

    const project = (categoryOption: any): CategoryOptionEntry => ({
        label: categoryOption.displayName,
        value: categoryOption.id,
        writeAccess: categoryOption.access.data.write,
    });

    const options = await buildCategoryOptionsAsync(category.id, { predicate, project, onIsAborted });
    return { id: category.id, label: category.displayName, options };
};

const sortOptionsByLabel = (a: CategoryOptionEntry, b: CategoryOptionEntry) => {
    if (a.label === b.label) {
        return 0;
    }
    if (a.label < b.label) {
        return -1;
    }
    return 1;
};

export const useCategoryOptionsLoader = (
    programCategories: Array<{ id: string; displayName: string }>,
    selectedOrgUnitId: string | null | undefined,
    skip: boolean,
): Array<LoadedCategory> | null | undefined => {
    const [categories, setCategories] = useState<Array<LoadedCategory> | null | undefined>(null);
    const cancelablePromiseRef = useRef<any>(null);

    const loadCategoryOptions = useCallback(() => {
        setCategories(undefined);
        cancelablePromiseRef.current?.cancel();

        let currentRequestCancelablePromises: any;

        const isRequestAborted = () =>
            (currentRequestCancelablePromises && cancelablePromiseRef.current !== currentRequestCancelablePromises);

        currentRequestCancelablePromises = makeCancelablePromise(
            Promise.all(programCategories.map(category =>
                getOptionsAsync(category, selectedOrgUnitId, isRequestAborted))),
        );
        currentRequestCancelablePromises
            .promise
            .then((optionResults: Array<LoadedCategory>) => {
                const newCategories = optionResults.map(({ options, ...rest }) => {
                    options.sort(sortOptionsByLabel);
                    return { options, ...rest };
                });
                setCategories(newCategories);
                cancelablePromiseRef.current = null;
            })
            .catch((error: any) => {
                if (!(error && (error.aborted || error.isCanceled))) {
                    log.error(
                        errorCreator('An error occurred loading category options')({ error }),
                    );
                    setCategories([]);
                }
            });

        cancelablePromiseRef.current = currentRequestCancelablePromises;
    }, [programCategories, selectedOrgUnitId]);

    useEffect(() => {
        if (!skip) {
            loadCategoryOptions();
        }
    }, [loadCategoryOptions, skip]);

    useEffect(() => () => {
        cancelablePromiseRef.current?.cancel();
        cancelablePromiseRef.current = null;
    }, []);

    return categories;
};
