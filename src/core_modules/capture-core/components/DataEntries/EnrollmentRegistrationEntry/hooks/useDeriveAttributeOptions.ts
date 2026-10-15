import { useCallback } from 'react';
import { useAlert } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getTermLabel, LabelKeys } from '../../../../customLabels';
import type { EnrollmentCategoryCombination } from '../../../../metaData';
import { deriveAttributeOptions } from '../helpers';

export const useDeriveAttributeOptions = ({ programId }: { programId: string }) => {
    const { show: showErrorAlert } = useAlert(({ message }) => message, { critical: true });

    return useCallback((
        serverValuesForMainValues: Record<string, any>,
        enrollmentCategoryCombination: EnrollmentCategoryCombination | null | undefined,
    ) => {
        const result = deriveAttributeOptions(serverValuesForMainValues, enrollmentCategoryCombination);

        if (result.aocResolveFailed) {
            log.error(
                errorCreator(
                    'Could not resolve the selected enrollment category options to an attribute option combo',
                )({
                    enrollmentCategoryOptionUids: result.enrollmentCategoryOptionUids,
                    enrollmentCategoryCombinationId: enrollmentCategoryCombination?.id,
                }),
            );
            const { enrollmentLabel } = getTermLabel([LabelKeys.enrollmentSingular], { programId });
            showErrorAlert({
                message: i18n.t(
                    'The selected {{enrollmentLabel}} category options are not a valid combination.',
                    { enrollmentLabel },
                ),
            });
        }

        return result;
    }, [programId, showErrorAlert]);
};
