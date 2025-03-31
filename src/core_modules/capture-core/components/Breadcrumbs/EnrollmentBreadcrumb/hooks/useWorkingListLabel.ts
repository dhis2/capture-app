import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

type Template = {
    id: string;
    name: string;
    isDefault?: boolean;
};

type Props = {
    programId: string;
    displayFrontPageList: boolean;
    trackedEntityName?: string;
}


// Define keys for default filters for better type safety
const DefaultFilterKeys = {
    ACTIVE: 'active',
    COMPLETE: 'complete',
    CANCELLED: 'cancelled',
} as const;

type DefaultFilterKey = typeof DefaultFilterKeys[keyof typeof DefaultFilterKeys];

const DefaultFilterLabels: { [key in DefaultFilterKey]: string } = {
    [DefaultFilterKeys.ACTIVE]: i18n.t('Active enrollments'),
    [DefaultFilterKeys.COMPLETE]: i18n.t('Completed enrollments'),
    [DefaultFilterKeys.CANCELLED]: i18n.t('Cancelled enrollments'),
};

export const useWorkingListLabel = ({
    programId,
    trackedEntityName,
    displayFrontPageList,
}: Props) => {
    // Use RootState with useSelector for better type safety
    const workingListTemplates = useSelector((state: any) => state.workingListsTemplates?.teiList);
    const workingListProgramId = useSelector((state: any) => state.workingListsContext?.teiList?.programIdView);

    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};

    // Explicitly type selectedTemplate
    const selectedTemplate: Template | undefined = templates?.find(({ id }) => id === selectedTemplateId);
    const isSameProgram: boolean = workingListProgramId === programId;

    const label: string = useMemo(() => {
        if (isLoadingTemplates) return i18n.t('Loading...');

        if (isSameProgram) {
            if (selectedTemplate && !selectedTemplate.isDefault) {
                return selectedTemplate.name;
            }

            // Type guard for selectedTemplateId
            if (selectedTemplateId && !selectedTemplate && DefaultFilterKeys[selectedTemplateId.toUpperCase() as keyof typeof DefaultFilterKeys]) {
                return DefaultFilterLabels[selectedTemplateId as DefaultFilterKey];
            }

            if (selectedTemplate?.name === 'default') {
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
