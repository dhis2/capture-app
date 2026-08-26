import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';

type Template = {
    id: string;
    name: string;
    isDefault?: boolean;
};

type Props = {
    programId: string;
}

export const useWorkingListLabel = ({ programId }: Props) => {
    const workingListTemplate = useSelector((state: any) => state.workingListsTemplates?.eventList);
    const workingListProgramId = useSelector((state: any) => state.workingListsContext?.eventList?.programIdView);

    const {
        selectedTemplateId,
        templates,
        loading: loadingTemplates,
    } = workingListTemplate ?? {};

    const selectedTemplete: Template | undefined = templates?.find(({ id }) => id === selectedTemplateId);
    const isDefaultTemplate: boolean | undefined = selectedTemplete?.isDefault;
    const isSameProgram: boolean = workingListProgramId === programId;

    const computedLabel: string = useMemo(() => {
        if (loadingTemplates) return i18n.t('Loading...');

        if (isSameProgram && !isDefaultTemplate && selectedTemplete) {
            return selectedTemplete.name;
        }

        return i18n.t('Event list');
    }, [isDefaultTemplate, isSameProgram, loadingTemplates, selectedTemplete]);

    return {
        label: computedLabel,
    };
};
