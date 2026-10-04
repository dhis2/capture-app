import React, { type ComponentType, useMemo } from 'react';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { useCategoryCombinations, useEnrollmentCategoryCombinations } from './useCategoryCombinations';
import { useCategoryOptionsFromIndexedDB } from '../../../utils/cachedDataHooks/useCategoryOptionsFromIndexedDB';
import type { ApiCategoryOption } from '../../../utils/cachedDataHooks/useCategoryOptionsFromServer';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { Props, Settings } from './withAOCFieldBuilder.types';

type CategoryOptionEntry = { label: string; value: string; writeAccess: boolean };
type LoadedCategory = { id: string; label: string; options: Array<CategoryOptionEntry> };

const sortByLabel = (a: CategoryOptionEntry, b: CategoryOptionEntry) =>
    a.label.localeCompare(b.label);

const matchesOrgUnit = (option: ApiCategoryOption, orgUnitId: string | null | undefined) => {
    if (!orgUnitId) return true;
    if (!option.organisationUnits || option.organisationUnits.length === 0) return true;
    return option.organisationUnits.includes(orgUnitId);
};

const useGroupedCategoryOptions = (
    programCategories: Array<{ id: string; displayName: string }>,
    orgUnitId: string | null | undefined,
    enabled: boolean,
): Array<LoadedCategory> | undefined => {
    const categoryIds = useMemo(
        () => (enabled ? new Set(programCategories.map(c => c.id)) : null),
        [enabled, programCategories],
    );
    const queryKey = useMemo(
        () => (categoryIds ? Array.from(categoryIds).sort() : []),
        [categoryIds],
    );
    const { categoryOptions } = useCategoryOptionsFromIndexedDB(queryKey, categoryIds);

    return useMemo(() => {
        if (!enabled) return undefined;
        if (programCategories.length === 0) return [];
        if (!categoryOptions) return undefined;
        return programCategories.map(({ id, displayName }) => ({
            id,
            label: displayName,
            options: categoryOptions
                .filter(o => !!o.access?.data?.write)
                .filter(o => o.categories?.includes(id))
                .filter(o => matchesOrgUnit(o, orgUnitId))
                .map<CategoryOptionEntry>(o => ({
                    label: o.displayName,
                    value: o.id,
                    writeAccess: true,
                }))
                .sort(sortByLabel),
        }));
    }, [enabled, categoryOptions, programCategories, orgUnitId]);
};

const getAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, orgUnitId, orgUnitIdFieldValue } = props;
        const hideAOC = settings?.hideAOC?.(props);
        const { programCategory, isLoading } = useCategoryCombinations(programId, hideAOC);
        const programCategories = useMemo(() => (
            !isLoading && programCategory ? programCategory.categories : []),
        [isLoading, programCategory]);
        const categories = useGroupedCategoryOptions(
            programCategories,
            orgUnitIdFieldValue ?? orgUnitId,
            !hideAOC,
        );

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

const getEnrollmentAOCFieldBuilder = (InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, orgUnitId, orgUnitIdFieldValue } = props;
        const featureSupported = featureAvailable(FEATURES.enrollmentAOC);
        const { enrollmentProgramCategory, isLoading } =
            useEnrollmentCategoryCombinations(programId, !featureSupported);
        const enrollmentProgramCategories = useMemo(() => (
            !isLoading && enrollmentProgramCategory ? enrollmentProgramCategory.categories : []),
        [isLoading, enrollmentProgramCategory]);
        const missingCombo = !isLoading && !enrollmentProgramCategory;
        const enrollmentCategories = useGroupedCategoryOptions(
            enrollmentProgramCategories,
            orgUnitIdFieldValue ?? orgUnitId,
            !missingCombo,
        );

        if (missingCombo) return <InnerComponent {...props} />;
        return (
            (!isLoading && enrollmentCategories) ? <InnerComponent
                {...props}
                enrollmentProgramCategory={enrollmentProgramCategory}
                enrollmentCategories={enrollmentCategories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withEnrollmentAOCFieldBuilder = () =>
    (InnerComponent: ComponentType<any>) =>
        getEnrollmentAOCFieldBuilder(InnerComponent);
