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

const getEnrollmentAOCFieldBuilder = (settings: Settings | undefined, InnerComponent: ComponentType<any>) =>
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

export const withEnrollmentAOCFieldBuilder = (settings?: Settings) =>
    (InnerComponent: ComponentType<any>) =>
        getEnrollmentAOCFieldBuilder(settings, InnerComponent);
