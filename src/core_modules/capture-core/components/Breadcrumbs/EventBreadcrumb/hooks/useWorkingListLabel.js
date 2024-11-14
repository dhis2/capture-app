// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';

type Props = {
    programId: string,
}

export const useWorkingListLabel = ({ programId }: Props) => {
    const workingListTemplate = useSelector(({ workingListsTemplates }) => workingListsTemplates?.eventList);
    const workingListProgramId = useSelector(({ workingListsContext }) => workingListsContext
        ?.eventList
        ?.programIdView,
    );


    const {
        selectedTemplateId,
        templates,
        loading: loadingTemplates,
    } = workingListTemplate ?? {};
    const selectedTemplete = templates?.find(({ id }) => id === selectedTemplateId);
    const isDefaultTemplate = selectedTemplete?.isDefault;
    const isSameProgram = workingListProgramId === programId;

    const computedLabel = useMemo(() => {
        if (loadingTemplates) return '...';

        if (isSameProgram && !isDefaultTemplate && selectedTemplete) {
            return selectedTemplete.name;
        }

        return i18n.t('Event list');
    }, [isDefaultTemplate, isSameProgram, loadingTemplates, selectedTemplete]);

    return {
        label: computedLabel,
    };
};
