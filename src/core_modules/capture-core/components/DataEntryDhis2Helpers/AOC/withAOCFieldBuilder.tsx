import React, { type ComponentType, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from '../../../../capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { useCategoryCombinations } from './useCategoryCombinations';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { Props, Settings } from './withAOCFieldBuilder.types';

const getAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const hideAOC = settings?.hideAOC?.(props);
        const [categories, setCategories] = useState<any>(null);
        const cancelablePromiseRef = useRef<any>(null);
        const { programCategory, isLoading } = useCategoryCombinations(programId, hideAOC);
        const programCategories = useMemo(() => (
            !isLoading && programCategory ? programCategory.categories : []),
        [isLoading, programCategory]);

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

        const loadCagoryOptions = useCallback(() => {
            setCategories([]);
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
                        options.sort((a: any, b: any) => {
                            if (a.label === b.label) {
                                return 0;
                            }
                            if (a.label < b.label) {
                                return -1;
                            }
                            return 1;
                        });

                        return { options, ...rest };
                    });
                    setCategories(newCategories);
                    cancelablePromiseRef.current = null;
                })
                .catch((error: any) => {
                    if (!(error && (error.aborted || error.isCanceled))) {
                        log.error(
                            errorCreator('An error occured loading category options')({ error }),
                        );
                        setCategories([]);
                    }
                });

            cancelablePromiseRef.current = currentRequestCancelablePromises;
        }, [programCategories, selectedOrgUnitId]);

        useEffect(() => {
            if (!hideAOC) {
                loadCagoryOptions();
            }
        }, [loadCagoryOptions, hideAOC]);

        useEffect(() => () => {
            cancelablePromiseRef.current?.cancel();
            cancelablePromiseRef.current = null;
        }, []);

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
