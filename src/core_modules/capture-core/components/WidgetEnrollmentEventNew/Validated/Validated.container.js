// @flow
import i18n from '@dhis2/d2-i18n';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useOrganisationUnit } from '../../../dataQueries';
import type { RenderFoundation } from '../../../metaData';
import { withSaveHandler } from '../../DataEntry';
import { addEventSaveTypes } from '../../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { useLifecycle } from './useLifecycle';
import { requestSaveEvent } from './validated.actions';
import { ValidatedComponent } from './Validated.component';
import type { ContainerProps } from './validated.types';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
export const Validated = ({
    program,
    formFoundation,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    orgUnitId,
    teiId,
    enrollmentId,
    rulesExecutionDependencies,
    ...passOnProps
}: ContainerProps) => {
    const dataEntryId = 'enrollmentEvent';
    const itemId = 'newEvent';

    const { error, orgUnit } = useOrganisationUnit(orgUnitId, 'displayName, code');
    const rulesExecutionDependenciesClientFormatted =
        useClientFormattedRulesExecutionDependencies(rulesExecutionDependencies, program);
    const ready = useLifecycle({
        program,
        formFoundation,
        orgUnit,
        dataEntryId,
        itemId,
        // $FlowFixMe Investigate
        rulesExecutionDependenciesClientFormatted,
    });

    const dispatch = useDispatch();
    const handleSave = useCallback((
        eventId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        saveType?: ?string,
    ) => {
        window.scrollTo(0, 0);
        const completed = saveType === addEventSaveTypes.COMPLETE;
        dispatch(requestSaveEvent({
            eventId,
            dataEntryId: dataEntryIdArgument,
            formFoundation: formFoundationArgument,
            completed,
            programId: program.id,
            orgUnitId,
            orgUnitName: orgUnit?.name || '',
            teiId,
            enrollmentId,
            onSaveExternal,
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
    }, [
        dispatch,
        program.id,
        orgUnitId,
        orgUnit,
        teiId,
        enrollmentId,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    ]);

    if (error) {
        return (
            <div>
                {i18n.t('organisation unit could not be retrieved. Please try again later.')}
            </div>
        );
    }

    return (
        <SaveHandlerHOC
            {...passOnProps}
            ready={ready}
            id={dataEntryId}
            itemId={itemId}
            formFoundation={formFoundation}
            onSave={handleSave}
            programName={program.name}
            orgUnit={orgUnit}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};
