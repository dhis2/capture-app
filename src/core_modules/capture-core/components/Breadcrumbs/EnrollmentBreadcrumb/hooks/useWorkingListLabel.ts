import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';

type Template = {
    id: string;
    name: string;
    isDefault?: boolean;
};

type Props = {
    programId: string;
    displayFrontPageList: boolean;
}

const DefaultFilterKeys = {
    DEFAULT: 'default',
    ACTIVE: 'active',
    COMPLETE: 'complete',
    CANCELLED: 'cancelled',
} as const;

type DefaultFilterKey = typeof DefaultFilterKeys[keyof typeof DefaultFilterKeys];

export const useWorkingListLabel = ({
    programId,
    displayFrontPageList,
}: Props) => {
    const enrollmentsLabel = useTermLabel('enrollment', { programId, plural: true });
    const workingListTemplates = useSelector((state: any) => state.workingListsTemplates?.teiList);
    const workingListProgramId = useSelector((state: any) => state.workingListsContext?.teiList?.programIdView);

    const { selectedTemplateId, loading: isLoadingTemplates, templates } = workingListTemplates ?? {};

    const selectedTemplate: Template | undefined = templates?.find(({ id }) => id === selectedTemplateId);
    const isSameProgram: boolean = workingListProgramId === programId;

    const defaultFilterLabels: { [key in DefaultFilterKey]: string } = useMemo(() => ({
        [DefaultFilterKeys.DEFAULT]: i18n.t('Program overview'),
        [DefaultFilterKeys.ACTIVE]: customTerms.i18n.t('Active {{enrollmentsLabel}}', { enrollmentsLabel }),
        [DefaultFilterKeys.COMPLETE]: customTerms.i18n.t('Completed {{enrollmentsLabel}}', { enrollmentsLabel }),
        [DefaultFilterKeys.CANCELLED]: customTerms.i18n.t('Cancelled {{enrollmentsLabel}}', { enrollmentsLabel }),
    }), [enrollmentsLabel]);

    const label: string = useMemo(() => {
        if (isLoadingTemplates) return i18n.t('Loading...');

        if (isSameProgram) {
            if (selectedTemplate && !selectedTemplate.isDefault) {
                return selectedTemplate.name;
            }

            if (selectedTemplateId && !selectedTemplate &&
                DefaultFilterKeys[selectedTemplateId.toUpperCase() as keyof typeof DefaultFilterKeys]) {
                return defaultFilterLabels[selectedTemplateId as DefaultFilterKey];
            }

            return i18n.t('Program overview');
        }

        if (!displayFrontPageList) return i18n.t('Search');

        return i18n.t('Program overview');
    }, [
        displayFrontPageList,
        isLoadingTemplates,
        isSameProgram,
        selectedTemplate,
        selectedTemplateId,
        defaultFilterLabels,
    ]);

    return {
        label,
    };
};
