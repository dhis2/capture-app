// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';

type Props = {
    programId: string,
}

export const useWorkingListLabel = ({ programId }: Props) => {
    const workingListTemplate = useSelector(({ workingListsTemplates }) => workingListsTemplates?.eventList);
    const workingListProgramId = useSelector(({ workingListsContext }) => workingListsContext
        ?.eventList
        ?.programIdView,
    );

    const { selectedTemplateId, loading } = workingListTemplate ?? {};
    const isDefaultTemplate = selectedTemplateId === `${programId}-default`;
    const isSameProgram = workingListProgramId === programId;

    const { data: eventFilterLabel, isLoading } = useApiMetadataQuery(
        ['BreadCrumbs', 'workingListLabel', 'eventList', programId, selectedTemplateId],
        {
            resource: 'eventFilters',
            id: selectedTemplateId,
            params: {
                fields: 'id,displayName',
            },
        },
        {
            enabled: !loading && !!selectedTemplateId && !isDefaultTemplate && isSameProgram,
        },
    );
    const loadingTemplate = loading || isLoading;

    const computedLabel = useMemo(() => {
        if (loadingTemplate) return '...';
        if (eventFilterLabel) {
            return eventFilterLabel.displayName;
        }

        return i18n.t('Event list');
    }, [eventFilterLabel, loadingTemplate]);

    return {
        label: computedLabel,
    };
};
