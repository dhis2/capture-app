// @flow
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TeiWorkingListsSetup } from '../Setup';
import { useWorkingListsCommonStateManagement, fetchTemplates, TEMPLATE_SHARING_TYPE } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';
import { navigateToEnrollmentOverview } from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../../../utils/routing';

const useApiTemplate = () => {
    const workingListsTemplatesTEI = useSelector(({ workingListsTemplates }) => workingListsTemplates.teiList);
    return workingListsTemplatesTEI && workingListsTemplatesTEI.templates;
};

export const TeiWorkingListsReduxProvider = ({
    storeId,
    programId,
    orgUnitId,
    selectedTemplateId,
    onChangeTemplate,
}: Props) => {
    const program = useTrackerProgram(programId);
    const apiTemplates = useApiTemplate();
    const history = useHistory();

    const {
        lastTransaction,
        lastTransactionOnListDataRefresh,
        listDataRefreshTimestamp,
        records,
        onSelectTemplate,
        onAddTemplate,
        onDeleteTemplate,
        onResetListColumnOrder,
        programStage,
        ...commonStateManagementProps
    } = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);
    const dispatch = useDispatch();

    const onLoadTemplates = useCallback(() => {
        dispatch(fetchTemplates(programId, storeId, TEI_WORKING_LISTS_TYPE, selectedTemplateId));
    }, [dispatch, programId, storeId, selectedTemplateId]);

    useEffect(() => {
        selectedTemplateId && onSelectTemplate && onSelectTemplate(selectedTemplateId);
    }, [selectedTemplateId, onSelectTemplate]);

    useEffect(() => {
        programStage && onResetListColumnOrder && onResetListColumnOrder();
    }, [programStage, onResetListColumnOrder]);

    const onSelectListRow = useCallback(({ id }) => {
        const record = records[id];
        const orgUnitIdParameter = orgUnitId || record.programOwner;

        return programStage
            ? history.push(`/enrollmentEventEdit?${buildUrlQueryString({ eventId: id, orgUnitId })}`)
            : dispatch(navigateToEnrollmentOverview({
                teiId: id,
                programId,
                orgUnitId: orgUnitIdParameter,
            }));
    }, [dispatch, orgUnitId, programId, records, programStage, history]);

    const handleOnSelectTemplate = useCallback((templateId) => {
        onSelectTemplate(templateId);
        templateId && onChangeTemplate && onChangeTemplate(templateId);
    }, [onChangeTemplate, onSelectTemplate]);

    const injectCallbacksForAddTemplate = useCallback((name: string, criteria: Object, data: Object) =>
        onAddTemplate(name, criteria, data, { onChangeTemplate }),
    [onAddTemplate, onChangeTemplate]);

    const injectCallbacksForDeleteTemplate = useCallback((template: Object, programIdArg: string) =>
        onDeleteTemplate(template, programIdArg, { onChangeTemplate }),
    [onDeleteTemplate, onChangeTemplate]);

    return (
        <TeiWorkingListsSetup
            {...commonStateManagementProps}
            templateSharingType={TEMPLATE_SHARING_TYPE[storeId]}
            onSelectListRow={onSelectListRow}
            onLoadTemplates={onLoadTemplates}
            program={program}
            programStage={programStage}
            records={records}
            orgUnitId={orgUnitId}
            apiTemplates={apiTemplates}
            onSelectTemplate={handleOnSelectTemplate}
            onAddTemplate={injectCallbacksForAddTemplate}
            onDeleteTemplate={injectCallbacksForDeleteTemplate}
        />
    );
};
