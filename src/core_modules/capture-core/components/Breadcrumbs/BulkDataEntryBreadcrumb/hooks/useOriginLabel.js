// @flow
import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { breadcrumbsKeys } from '../BulkDataEntryBreadcrumb';

type Props = {
    programId: string,
    displayFrontPageList?: boolean,
    trackedEntityName?: string,
    page: string,
};

const DefaultFilterLabels = {
    default: i18n.t('Program overview'),
    active: i18n.t('Active enrollments'),
    complete: i18n.t('Completed enrollments'),
    cancelled: i18n.t('Cancelled enrollments'),
};

const getWorkingListLabel = (selectedTemplate, selectedTemplateId) => {
    if (selectedTemplate && !selectedTemplate.isDefault) {
        return selectedTemplate.name;
    }
    if (selectedTemplateId && !selectedTemplate) {
        return DefaultFilterLabels[selectedTemplateId];
    }
    return i18n.t('Program overview');
};

export const useOriginLabel = ({ programId, displayFrontPageList, page }: Props) => {
    const workingListTemplates = useSelector(({ workingListsTemplates }) => workingListsTemplates?.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};
    const selectedTemplate = templates?.find(({ id }) => id === selectedTemplateId);
    const isSameProgram = workingListProgramId === programId;

    const label = useMemo(() => {
        if (page === breadcrumbsKeys.SEARCH_PAGE) {
            return i18n.t('Search');
        }

        if (isLoadingTemplates) {
            return '...';
        }

        if (isSameProgram) {
            return getWorkingListLabel(selectedTemplate, selectedTemplateId);
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
    ]);

    return {
        label,
    };
};
