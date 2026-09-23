import React, { type ComponentType, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from 'capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { useCategoryCombinations, useEnrollmentCategoryCombinations } from './useCategoryCombinations';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { Props, Settings } from './withAOCFieldBuilder.types';

const getOptionsAsync = async (
    category: any,
    orgUnitId: string | null | undefined,
    onIsAborted: () => boolean,
) => {
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

    const project = (categoryOption: any) => ({
        label: categoryOption.displayName,
        value: categoryOption.id,
        writeAccess: categoryOption.access.data.write,
    });

    const options = await buildCategoryOptionsAsync(category.id, { predicate, project, onIsAborted });
    return { id: category.id, label: category.displayName, options };
};

const sortOptionsByLabel = (a: any, b: any) => {
    if (a.label === b.label) {
        return 0;
    }
    if (a.label < b.label) {
        return -1;
    }
    return 1;
};

const useCategoryOptionsLoader = (
    programCategories: Array<any>,
    selectedOrgUnitId: string | null | undefined,
    skip: boolean,
) => {
    const [categories, setCategories] = useState<any>(null);
    const cancelablePromiseRef = useRef<any>(null);

    const loadCategoryOptions = useCallback(() => {
        setCategories(undefined);
        cancelablePromiseRef.current?.cancel();

        let currentRequestCancelablePromises: any;

        const isRequestAborted = () =>
            (currentRequestCancelablePromises && cancelablePromiseRef.current !== currentRequestCancelablePromises);

        currentRequestCancelablePromises = makeCancelablePromise(
            Promise.all(programCategories.map((category: any) =>
                getOptionsAsync(
                    category,
                    selectedOrgUnitId,
                    isRequestAborted,
                ))),
        );
        currentRequestCancelablePromises
            .promise
            .then((optionResults: any) => {
                const newCategories = optionResults.map(({ options, ...rest }: any) => {
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

const getAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const hideAOC = settings?.hideAOC?.(props);
        const { programCategory, isLoading } = useCategoryCombinations(programId, hideAOC);
        const programCategories = useMemo(() => (
            !isLoading && programCategory ? programCategory.categories : []),
        [isLoading, programCategory]);
        const categories = useCategoryOptionsLoader(programCategories, selectedOrgUnitId, Boolean(hideAOC));

        if (hideAOC) { return <InnerComponent{...props} />; }
        return (
            (!isLoading && categories) ? <InnerComponent
                {...props}
                programCategory={programCategory}
                categories={categories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withAOCFieldBuilder = (settings: Settings) =>
    (InnerComponent: ComponentType<any>) =>
        getAOCFieldBuilder(settings, InnerComponent);

const getEnrollmentAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const hideAOC = settings?.hideAOC?.(props);
        const { enrollmentProgramCategory, isLoading } = useEnrollmentCategoryCombinations(programId, hideAOC);
        const enrollmentProgramCategories = useMemo(() => (
            !isLoading && enrollmentProgramCategory ? enrollmentProgramCategory.categories : []),
        [isLoading, enrollmentProgramCategory]);
        const skipLoad = Boolean(hideAOC) || (!isLoading && !enrollmentProgramCategory);
        const enrollmentCategories = useCategoryOptionsLoader(enrollmentProgramCategories, selectedOrgUnitId, skipLoad);

        if (hideAOC || (!isLoading && !enrollmentProgramCategory)) {
            return <InnerComponent {...props} />;
        }
        return (
            (!isLoading && enrollmentCategories) ? <InnerComponent
                {...props}
                enrollmentProgramCategory={enrollmentProgramCategory}
                enrollmentCategories={enrollmentCategories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withEnrollmentAOCFieldBuilder = (settings: Settings) =>
    (InnerComponent: ComponentType<any>) =>
        getEnrollmentAOCFieldBuilder(settings, InnerComponent);
