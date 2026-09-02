import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { breadcrumbsKeys } from '../BulkDataEntryBreadcrumb';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';

type Props = {
    programId: string;
    displayFrontPageList?: boolean;
    trackedEntityName?: string;
    page: string;
};

const getWorkingListLabel = (
    selectedTemplate: any,
    selectedTemplateId: string,
    defaultFilterLabels: Record<string, string>,
) => {
    if (selectedTemplate && !selectedTemplate.isDefault) {
        return selectedTemplate.name;
    }
    if (selectedTemplateId && !selectedTemplate) {
        return defaultFilterLabels[selectedTemplateId as keyof typeof defaultFilterLabels];
    }
    return i18n.t('Program overview');
};

export const useOriginLabel = ({ programId, displayFrontPageList, page }: Props) => {
    const enrollmentsLabel = useTermLabel('enrollment', { plural: true });
    const workingListTemplates = useSelector(({ workingListsTemplates }: any) => workingListsTemplates?.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }: any) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};
    const selectedTemplate = templates?.find(({ id }: any) => id === selectedTemplateId);
    const isSameProgram = workingListProgramId === programId;

    const defaultFilterLabels = useMemo(() => ({
        default: i18n.t('Program overview'),
        active: customTerms.i18n.t('Active {{enrollmentsLabel}}', { enrollmentsLabel }),
        complete: customTerms.i18n.t('Completed {{enrollmentsLabel}}', { enrollmentsLabel }),
        cancelled: customTerms.i18n.t('Cancelled {{enrollmentsLabel}}', { enrollmentsLabel }),
    }), [enrollmentsLabel]);

    const label = useMemo(() => {
        if (page === breadcrumbsKeys.SEARCH_PAGE) {
            return i18n.t('Search');
        }

        if (isLoadingTemplates) {
            return '...';
        }

        if (isSameProgram) {
            return getWorkingListLabel(selectedTemplate, selectedTemplateId, defaultFilterLabels);
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
        defaultFilterLabels,
    ]);

    return {
        label,
    };
};
