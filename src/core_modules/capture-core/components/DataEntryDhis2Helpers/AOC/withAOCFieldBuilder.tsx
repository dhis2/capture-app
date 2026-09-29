import React, { type ComponentType, useMemo } from 'react';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { useCategoryCombinations, useEnrollmentCategoryCombinations } from './useCategoryCombinations';
import { useCategoryOptionsLoader } from './useCategoryOptionsLoader';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { Props, Settings } from './withAOCFieldBuilder.types';

const getAOCFieldBuilder = (settings: Settings, InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { programId, orgUnitId } = props;
        const hideAOC = settings?.hideAOC?.(props);
        const { programCategory, isLoading } = useCategoryCombinations(programId, hideAOC);
        const programCategories = useMemo(() => (
            !isLoading && programCategory ? programCategory.categories : []),
        [isLoading, programCategory]);
        const categories = useCategoryOptionsLoader(programCategories, orgUnitId, Boolean(hideAOC));

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
        const { programId, orgUnitId } = props;
        const featureSupported = featureAvailable(FEATURES.enrollmentAOC);
        const { enrollmentProgramCategory, isLoading } =
            useEnrollmentCategoryCombinations(programId, !featureSupported);
        const enrollmentProgramCategories = useMemo(() => (
            !isLoading && enrollmentProgramCategory ? enrollmentProgramCategory.categories : []),
        [isLoading, enrollmentProgramCategory]);
        const missingCombo = !isLoading && !enrollmentProgramCategory;
        const enrollmentCategories = useCategoryOptionsLoader(enrollmentProgramCategories, orgUnitId, missingCombo);

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
