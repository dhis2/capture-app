import React, { type ComponentType, useMemo } from 'react';
import { useCategoryCombinations, useEnrollmentCategoryCombinations } from './useCategoryCombinations';
import { useCategoryOptionsLoader } from './loadCategoryOptions';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { Props, Settings } from './withAOCFieldBuilder.types';

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

const getEnrollmentAOCFieldBuilder = (InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, selectedOrgUnitId } = props;
        const { enrollmentProgramCategory, isLoading } = useEnrollmentCategoryCombinations(programId);
        const enrollmentProgramCategories = useMemo(() => (
            !isLoading && enrollmentProgramCategory ? enrollmentProgramCategory.categories : []),
        [isLoading, enrollmentProgramCategory]);
        const missingCombo = !isLoading && !enrollmentProgramCategory;
        const enrollmentCategories = useCategoryOptionsLoader(enrollmentProgramCategories, selectedOrgUnitId, missingCombo);

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
