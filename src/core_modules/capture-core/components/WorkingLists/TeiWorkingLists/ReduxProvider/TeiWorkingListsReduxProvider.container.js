// @flow
import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TrackerWorkingListsViewMenuSetup } from '../ViewMenuSetup';
import { useWorkingListsCommonStateManagement, fetchTemplates, TEMPLATE_SHARING_TYPE } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';
import { navigateToEnrollmentOverview } from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../../../utils/routing';
import { getDefaultTemplate } from '../helpers';

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
    const defaultTemplate = getDefaultTemplate(programId);

    const {
        lastTransaction,
        lastTransactionOnListDataRefresh,
        listDataRefreshTimestamp,
        records,
        onSelectTemplate,
        onAddTemplate,
        onDeleteTemplate,
        onUpdateDefaultTemplate,
        programStage,
        currentTemplateId,
        viewPreloaded,
        ...commonStateManagementProps
    } = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);
    const dispatch = useDispatch();
    const forceUpdateOnMount = moment().diff(moment(listDataRefreshTimestamp || 0), 'minutes') > 5 ||
        lastTransaction !== lastTransactionOnListDataRefresh;

    const onLoadTemplates = useCallback(() => {
        dispatch(fetchTemplates(programId, storeId, TEI_WORKING_LISTS_TYPE, selectedTemplateId));
    }, [dispatch, programId, storeId, selectedTemplateId]);

    useEffect(() => {
        // This hook should only fire when you navigate from the search page to the main page with a working list selected
        if (selectedTemplateId &&
            selectedTemplateId !== currentTemplateId &&
            !viewPreloaded &&
            onSelectTemplate
        ) {
            onSelectTemplate(selectedTemplateId);
        }
    }, [selectedTemplateId, viewPreloaded, currentTemplateId, onSelectTemplate]);

    const onSelectListRow = useCallback(({ id }) => {
        const record = records[id];
        const orgUnitIdParameter = orgUnitId || record.orgUnit?.id || record.programOwner;

        return programStage
            ? history.push(
                `/enrollmentEventEdit?${buildUrlQueryString({ eventId: id, orgUnitId: orgUnitIdParameter })}`,
            )
            : dispatch(navigateToEnrollmentOverview({
                teiId: id,
                programId,
                orgUnitId: orgUnitIdParameter,
            }));
    }, [dispatch, orgUnitId, programId, records, programStage, history]);

    const handlePreserveCurrentViewState = useCallback((templateId, criteria) => {
        onUpdateDefaultTemplate({ ...defaultTemplate, criteria, isAltered: true });
        onSelectTemplate(templateId, criteria?.programStage);
        templateId && onChangeTemplate && onChangeTemplate(templateId);
    }, [onChangeTemplate, onSelectTemplate, onUpdateDefaultTemplate, defaultTemplate]);

    const handleOnSelectTemplate = useCallback((templateId) => {
        onUpdateDefaultTemplate(defaultTemplate);
        onSelectTemplate(templateId);
        templateId && onChangeTemplate && onChangeTemplate(templateId);
    }, [onChangeTemplate, onSelectTemplate, onUpdateDefaultTemplate, defaultTemplate]);

    const injectCallbacksForAddTemplate = useCallback((name: string, criteria: Object, data: Object) =>
        onAddTemplate(name, criteria, data, { onChangeTemplate }),
    [onAddTemplate, onChangeTemplate]);

    const injectCallbacksForDeleteTemplate = useCallback(
        (template: Object, programIdArg: string, programStageArg?: string) =>
            onDeleteTemplate(template, programIdArg, programStageArg, { onChangeTemplate }),
        [onDeleteTemplate, onChangeTemplate],
    );
    const templateSharingType = programStage
        ? TEMPLATE_SHARING_TYPE[storeId]?.programStageWorkingList
        : TEMPLATE_SHARING_TYPE[storeId]?.tei;

    return (
        <TrackerWorkingListsViewMenuSetup
            {...commonStateManagementProps}
            forceUpdateOnMount={forceUpdateOnMount}
            currentTemplateId={currentTemplateId}
            viewPreloaded={viewPreloaded}
            templateSharingType={templateSharingType}
            onSelectListRow={onSelectListRow}
            onLoadTemplates={onLoadTemplates}
            program={program}
            programStageId={programStage}
            records={records}
            orgUnitId={orgUnitId}
            apiTemplates={apiTemplates}
            onSelectTemplate={handleOnSelectTemplate}
            onPreserveCurrentViewState={handlePreserveCurrentViewState}
            onAddTemplate={injectCallbacksForAddTemplate}
            onDeleteTemplate={injectCallbacksForDeleteTemplate}
            storeId={storeId}
        />
    );
};
