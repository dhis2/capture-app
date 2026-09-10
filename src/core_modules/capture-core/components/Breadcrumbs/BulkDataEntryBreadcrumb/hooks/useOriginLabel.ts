import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import { breadcrumbsKeys } from '../BulkDataEntryBreadcrumb';
import { LabelKeys, useTermLabel } from '../../../../metaData';

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
    const { enrollmentsLabel } = useTermLabel([LabelKeys.enrollmentPlural]);
    const workingListTemplates = useSelector(({ workingListsTemplates }: any) => workingListsTemplates?.teiList);
    const workingListProgramId = useSelector(({ workingListsContext }: any) => workingListsContext?.teiList?.programIdView);
    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};
    const selectedTemplate = templates?.find(({ id }: any) => id === selectedTemplateId);
    const isSameProgram = workingListProgramId === programId;

    const defaultFilterLabels = {
        default: i18n.t('Program overview'),
        active: i18n.t('Active {{enrollmentsLabel}}', { enrollmentsLabel }),
        complete: i18n.t('Completed {{enrollmentsLabel}}', { enrollmentsLabel }),
        cancelled: i18n.t('Cancelled {{enrollmentsLabel}}', { enrollmentsLabel }),
    };

    const getLabel = () => {
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
    };

    return {
        label: getLabel(),
    };
};
