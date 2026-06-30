import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { breadcrumbsKeys } from '../BulkDataEntryBreadcrumb';
import { useProgramLabel } from '../../../../metaData';

type Props = {
    programId: string;
    displayFrontPageList?: boolean;
    trackedEntityName?: string;
    page: string;
};

const getWorkingListLabel = (
    selectedTemplate: any,
    selectedTemplateId: string,
    defaultFilterLabels: { [key: string]: string },
) => {
    if (selectedTemplate && !selectedTemplate.isDefault) {
        return selectedTemplate.name;
    }
    if (selectedTemplateId && !selectedTemplate) {
        return defaultFilterLabels[selectedTemplateId];
    }
    return i18n.t('Program overview');
};

export const useOriginLabel = ({ programId, displayFrontPageList, page }: Props) => {
    const workingListTemplates = useSelector(({ workingListsTemplates }: any) => workingListsTemplates?.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }: any) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};
    const selectedTemplate = templates?.find(({ id }: any) => id === selectedTemplateId);
    const isSameProgram = workingListProgramId === programId;
    const enrollments = useProgramLabel('enrollment', { plural: true, programId }) ?? i18n.t('enrollments');

    const DefaultFilterLabels = useMemo(() => ({
        default: i18n.t('Program overview'),
        active: i18n.t('Active {{enrollments}}', { enrollments }),
        complete: i18n.t('Completed {{enrollments}}', { enrollments }),
        cancelled: i18n.t('Cancelled {{enrollments}}', { enrollments }),
    }), [enrollments]);

    const label = useMemo(() => {
        if (page === breadcrumbsKeys.SEARCH_PAGE) {
            return i18n.t('Search');
        }

        if (isLoadingTemplates) {
            return '...';
        }

        if (isSameProgram) {
            return getWorkingListLabel(selectedTemplate, selectedTemplateId, DefaultFilterLabels);
        }

        if (!displayFrontPageList) {
            return i18n.t('Search');
        }
        return i18n.t('Program overview');
    }, [
        displayFrontPageList,
        isLoadingTemplates,
        isSameProgram,
        selectedTemplate,
        selectedTemplateId,
        page,
        DefaultFilterLabels,
    ]);

    return {
        label,
    };
};
