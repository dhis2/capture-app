// @flow
import React, { type ComponentType, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import log from 'loglevel';
import { makeCancelablePromise, errorCreator } from '../../../../capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { useCategoryCombinations } from './useCategoryCombinations';

type Props = {
    programId: string,
    selectedOrgUnitId: string,
}

const getAOCFieldBuilder = (InnerComponent: ComponentType<any>) =>
    (props: Object) => {
        const { programId, selectedOrgUnitId } = props;
        const [fields, setFields] = useState(null);
        const cancelablePromiseRef = useRef(null);
        const { programCategory, isLoading } = useCategoryCombinations(programId);
        const categories = useMemo(() => (
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
            setFields(null);
            cancelablePromiseRef.current && cancelablePromiseRef.current.cancel();

            let currentRequestCancelablePromises;

            const isRequestAborted = () =>
                (currentRequestCancelablePromises && cancelablePromiseRef.current !== currentRequestCancelablePromises);

            currentRequestCancelablePromises = makeCancelablePromise(
                Promise.all(categories.map(category =>
                    getOptionsAsync(
                        category,
                        selectedOrgUnitId,
                        isRequestAborted,
                    ))),
            );
            currentRequestCancelablePromises
                .promise
                .then((optionResults) => {
                    const newFields = optionResults.map(({ options, ...rest }) => {
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
                    setFields(newFields);
                    cancelablePromiseRef.current = null;
                })
                .catch((error) => {
                    if (!(error && (error.aborted || error.isCanceled))) {
                        log.error(
                            errorCreator('An error occured loading category options')({ error }),
                        );
                        setFields(null);
                    }
                });

            cancelablePromiseRef.current = currentRequestCancelablePromises;
        }, [categories, selectedOrgUnitId]);

        useEffect(() => {
            loadCagoryOptions();
        }, [loadCagoryOptions]);

        useEffect(() => () => {
            cancelablePromiseRef.current && cancelablePromiseRef.current.cancel();
            cancelablePromiseRef.current = null;
        }, []);

        return (
            <InnerComponent
                {...props}
                programCategory={programCategory}
                rawFields={fields}
            />
        );
    };

export const withAOCFieldBuilder = () =>
    (InnerComponent: ComponentType<any>) =>
        getAOCFieldBuilder(InnerComponent);
