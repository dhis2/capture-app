import React, { type ComponentType, useMemo } from 'react';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { useCategoryCombinations } from './useCategoryCombinations';
import { useGroupedCategoryOptions } from './useGroupedCategoryOptions';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import { getTrackerProgramThrowIfNotFound } from '../../../metaData';
import type { Props, Settings } from './withAOCFieldBuilder.types';

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
        const enrollmentProgramCategory = useMemo(() => {
            if (!featureAvailable(FEATURES.enrollmentAOC)) return null;
            return getTrackerProgramThrowIfNotFound(programId).enrollmentCategoryCombination;
        }, [programId]);
        const enrollmentCategories = useGroupedCategoryOptions(
            enrollmentProgramCategory?.categories ?? [],
            orgUnitIdFieldValue ?? orgUnitId,
            !!enrollmentProgramCategory,
        );

        if (!enrollmentProgramCategory) return <InnerComponent {...props} />;
        return (
            enrollmentCategories ? <InnerComponent
                {...props}
                enrollmentProgramCategory={enrollmentProgramCategory}
                enrollmentCategories={enrollmentCategories}
            /> : <LoadingMaskElementCenter />
        );
    };

export const withEnrollmentAOCFieldBuilder = (InnerComponent: ComponentType<any>) =>
    getEnrollmentAOCFieldBuilder(InnerComponent);
