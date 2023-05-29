// @flow
import React, { type ComponentType, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from '../../../../capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { useCategoryCombinations } from './useCategoryCombinations';
import { LoadingMaskElementCenter } from '../../LoadingMasks';

type Props = {
    programId: string,
    selectedOrgUnitId: string,
}
type Settings = {
    hideAOC?: ?(props: Object) => boolean;
};

const getAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const hideAOC = settings && settings.hideAOC?.(props);
        const [categories, setCategories] = useState(null);
        const cancelablePromiseRef = useRef(null);
        const { programCategory, isLoading } = useCategoryCombinations(programId, hideAOC);
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
            if (!hideAOC) {
                loadCagoryOptions();
            }
        }, [loadCagoryOptions, hideAOC]);

        useEffect(() => () => {
            cancelablePromiseRef.current && cancelablePromiseRef.current.cancel();
            cancelablePromiseRef.current = null;
        }, []);

        if (hideAOC) { return <InnerComponent{...props} />; }
        return (
            !isLoading && categories ? <InnerComponent
                {...props}
                programCategory={programCategory}
                categories={categories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withAOCFieldBuilder = (settings: Settings) =>
    (InnerComponent: ComponentType<any>) =>
        getAOCFieldBuilder(settings, InnerComponent);
