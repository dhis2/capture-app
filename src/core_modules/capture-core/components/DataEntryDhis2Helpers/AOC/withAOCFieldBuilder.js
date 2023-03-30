// @flow
import React, { type ComponentType, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from '../../../../capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { useCategoryCombinations } from './useCategoryCombinations';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import { getProgramThrowIfNotFound } from '../../../metaData';

type Props = {
    programId: string,
    selectedOrgUnitId: string,
}

const getAOCFieldBuilder = (InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const { stages } = getProgramThrowIfNotFound(programId);
        /*
        * Show AOC selection ONLY if there are any program stages in the program with:
        * “Auto-generate event” and NOT “Open data entry form after enrollment”.
        */
        const shouldShowAOC = [...stages.values()].some(stage => stage.autoGenerateEvent && !stage.openAfterEnrollment);
        const [categories, setCategories] = useState(null);
        const cancelablePromiseRef = useRef(null);
        const { programCategory, isLoading } = useCategoryCombinations(programId, !shouldShowAOC);
        const programCategories = useMemo(() => (
            !isLoading && programCategory ? programCategory.categories : []),
        [isLoading, programCategory]);

        const getOptionsAsync = async (
            category: Object,
            orgUnitId: ?string,
            onIsAborted: Function,
        ) => {
            const predicate = (categoryOption: Object) => {
                if (!orgUnitId) {
                    return true;
                }

                const orgUnits = categoryOption.organisationUnits;
                if (!orgUnits) {
                    return true;
                }

                return !!orgUnits[orgUnitId];
            };

            const project = (categoryOption: Object) => ({
                label: categoryOption.displayName,
                value: categoryOption.id,
                writeAccess: categoryOption.access.data.write,
            });

            const options = await buildCategoryOptionsAsync(category.id, { predicate, project, onIsAborted });
            return { id: category.id, label: category.displayName, options };
        };

        const loadCagoryOptions = useCallback(() => {
            setCategories([]);
            cancelablePromiseRef.current && cancelablePromiseRef.current.cancel();

            let currentRequestCancelablePromises;

            const isRequestAborted = () =>
                (currentRequestCancelablePromises && cancelablePromiseRef.current !== currentRequestCancelablePromises);

            currentRequestCancelablePromises = makeCancelablePromise(
                Promise.all(programCategories.map(category =>
                    getOptionsAsync(
                        category,
                        selectedOrgUnitId,
                        isRequestAborted,
                    ))),
            );
            currentRequestCancelablePromises
                .promise
                .then((optionResults) => {
                    const newCategories = optionResults.map(({ options, ...rest }) => {
                        options.sort((a, b) => {
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
                .catch((error) => {
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
            if (shouldShowAOC) {
                loadCagoryOptions();
            }
        }, [loadCagoryOptions, shouldShowAOC]);

        useEffect(() => () => {
            cancelablePromiseRef.current && cancelablePromiseRef.current.cancel();
            cancelablePromiseRef.current = null;
        }, []);

        if (!shouldShowAOC) { return <InnerComponent{...props} />; }
        return (
            !isLoading && categories ? <InnerComponent
                {...props}
                programCategory={programCategory}
                categories={categories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withAOCFieldBuilder = () =>
    (InnerComponent: ComponentType<any>) =>
        getAOCFieldBuilder(InnerComponent);
