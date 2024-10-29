// @flow
import i18n from '@dhis2/d2-i18n';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';

type Props = {
    programId: string,
    displayFrontPageList: boolean,
    trackedEntityName?: string,
}

const DefaultFilterLabels = {
    active: i18n.t('Active enrollments'),
    complete: i18n.t('Completed enrollments'),
    cancelled: i18n.t('Cancelled enrollments'),
};

export const useWorkingListLabel = ({
    programId,
    trackedEntityName,
    displayFrontPageList,
}: Props) => {
    const [shouldFetchPSFilter, setShouldFetchPSFilter] = useState(false);
    const workingListTemplates = useSelector(({ workingListsTemplates }) => workingListsTemplates.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates } = workingListTemplates ?? {};
    const isDefaultTemplate = selectedTemplateId === `${programId}-default`;
    const isSameProgram = workingListProgramId === programId;

    const {
        data: psListTemplate,
        isLoading: psFilterLoading,
    } = useApiMetadataQuery(
        ['BreadCrumbs', 'workingListLabel', 'programStageFilter', programId, selectedTemplateId],
        {
            resource: 'programStageWorkingLists',
            id: selectedTemplateId,
            params: {
                fields: 'id,displayName',
            },
        }, {
            enabled: shouldFetchPSFilter && isSameProgram,
        },
    );

    const {
        data: teiListLabel,
        isLoading: teiListLoading,
    } = useApiMetadataQuery(
        ['BreadCrumbs', 'workingListLabel', 'trackedEntityInstanceFilter', programId, selectedTemplateId],
        {
            resource: 'trackedEntityInstanceFilters',
            id: selectedTemplateId,
            params: {
                fields: 'id,displayName',
            },
        }, {
            enabled: !!selectedTemplateId &&
                !DefaultFilterLabels[selectedTemplateId] &&
                !isDefaultTemplate &&
                isSameProgram,
            onError: () => {
                setShouldFetchPSFilter(true);
            },
        },
    );

    const isLoading = psFilterLoading || teiListLoading || isLoadingTemplates;

    const label = useMemo(() => {
        if (isLoading) return '...';

        if (isSameProgram && DefaultFilterLabels[selectedTemplateId]) {
            return DefaultFilterLabels[selectedTemplateId];
        }

        if (psListTemplate) {
            return psListTemplate.displayName;
        }
        if (teiListLabel) {
            return teiListLabel.displayName;
        }
        if (!displayFrontPageList && (!isSameProgram || !selectedTemplateId)) {
            return i18n.t('Search');
        }
        if (trackedEntityName) {
            return i18n.t('{{trackedEntityName}} list', { trackedEntityName });
        }
        return i18n.t('Working List');
    }, [
        displayFrontPageList,
        isLoading,
        isSameProgram,
        psListTemplate,
        selectedTemplateId,
        teiListLabel,
        trackedEntityName,
    ]);

    return {
        label,
    };
};
