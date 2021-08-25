// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useOrganisationUnit } from './useOrganisationUnit';
import { ValidatedComponent } from './Validated.component';
import { requestSaveEvent } from './validated.actions';
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
export const Validated = ({
    program,
    formFoundation,
    onSaveActionType,
    onSaveSuccessActionType,
    orgUnitId,
    teiId,
    enrollmentId,
    ...passOnProps
}: ContainerProps) => {
    const dataEntryId = 'enrollmentEvent';
    const itemId = 'newEvent';

    const { error, orgUnit } = useOrganisationUnit(orgUnitId);
    const ready = useLifecycle(program, formFoundation, orgUnit, dataEntryId);

    const dispatch = useDispatch();
    const handleSave = useCallback((
        eventId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        completed?: boolean,
    ) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveEvent({
            eventId,
            dataEntryId: dataEntryIdArgument,
            formFoundation: formFoundationArgument,
            completed,
            teiId,
            enrollmentId,
            onSaveActionType,
        }));
    }, [dispatch, onSaveActionType, teiId, enrollmentId]);

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
        />
    );
};
