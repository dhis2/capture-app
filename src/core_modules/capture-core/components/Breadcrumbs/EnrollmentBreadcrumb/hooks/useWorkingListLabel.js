// @flow
import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
    const workingListTemplates = useSelector(({ workingListsTemplates }) => workingListsTemplates?.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};
    const selectedTemplate = templates?.find(({ id }) => id === selectedTemplateId);
    const isSameProgram = workingListProgramId === programId;

    const label = useMemo(() => {
        if (isLoadingTemplates) return '...';

        if (isSameProgram) {
            if (selectedTemplate && !selectedTemplate.isDefault) {
                return selectedTemplate.name;
            }

            if (selectedTemplateId && !selectedTemplate) {
                return DefaultFilterLabels[selectedTemplateId];
            }

            if (selectedTemplate.name === 'default') {
                return i18n.t('{{trackedEntityName}} list', { trackedEntityName });
            }
        }

        if (!displayFrontPageList) return i18n.t('Search');
        return trackedEntityName ? i18n.t('{{trackedEntityName}} list', { trackedEntityName }) : i18n.t('Working List');
    }, [
        displayFrontPageList,
        isLoadingTemplates,
        isSameProgram,
        selectedTemplate,
        selectedTemplateId,
        trackedEntityName,
    ]);

    return {
        label,
    };
};
