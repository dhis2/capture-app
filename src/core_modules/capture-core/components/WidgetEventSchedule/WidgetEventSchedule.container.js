// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram, getProgramEventAccess, dataElementTypes } from '../../metaData';
import { useOrgUnitNameWithAncestors } from '../../metadataRetrieval/orgUnitName';
import { useLocationQuery } from '../../utils/routing';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
    useNoteDetails,
} from './hooks';
import { requestScheduleEvent } from './WidgetEventSchedule.actions';
import { NoAccess } from './AccessVerification';
import { useCategoryCombinations } from '../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { convertClientToServer } from '../../converters';

export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId,
    onSave,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    onCancel,
    initialScheduleDate,
    enableUserAssignment,
    assignee: storedAssignee,
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const dispatch = useDispatch();
    const orgUnit = { id: orgUnitId, name: useOrgUnitNameWithAncestors(orgUnitId).displayName };
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, initialScheduleDate, ...passOnProps,
    });
    const { currentUser, noteId } = useNoteDetails();
    const [scheduleDate, setScheduleDate] = useState('');
    const [notes, setNotes] = useState([]);
    const [assignee, setAssignee] = useState(storedAssignee);
    const { events } = useEventsInOrgUnit(orgUnitId, scheduleDate);
    const { eventId } = useLocationQuery();
    const eventCountInOrgUnit = events
        .filter(event => moment(event.scheduledAt).format('YYYY-MM-DD') === scheduleDate).length;

    const [selectedCategories, setSelectedCategories] = useState({});
    const [categoryOptionsError, setCategoryOptionsError] = useState();
    const { programCategory } = useCategoryCombinations(programId);
    useEffect(() => {
        if (!scheduleDate && suggestedScheduleDate) { setScheduleDate(suggestedScheduleDate); }
    }, [suggestedScheduleDate, scheduleDate]);

    useEffect(() => {
        setAssignee(storedAssignee);
    }, [storedAssignee]);

    const onHandleSchedule = useCallback(() => {
        if (programCategory?.categories &&
            Object.keys(selectedCategories).length !== programCategory?.categories?.length) {
            const errors = programCategory.categories
                .filter(({ id }) => !selectedCategories[id])
                .reduce((acc, category) => {
                    acc[category.id] = { touched: true, valid: false };
                    return acc;
                }, {});
            setCategoryOptionsError(errors);
            return;
        }
        dispatch(requestScheduleEvent({
            scheduleDate,
            notes,
            programId,
            orgUnitId,
            stageId,
            teiId,
            enrollmentId,
            eventId,
            categoryOptions: selectedCategories,
            onSaveExternal: onSave,
            onSaveSuccessActionType,
            onSaveErrorActionType,
            // $FlowFixMe[incompatible-call]
            ...(assignee && { assignedUser: convertClientToServer(assignee, dataElementTypes.ASSIGNEE) }),
        }));
    }, [
        dispatch,
        scheduleDate,
        notes,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
        eventId,
        selectedCategories,
        onSave,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        programCategory,
        assignee,
    ]);

    React.useEffect(() => {
        if (suggestedScheduleDate && !scheduleDate) {
            setScheduleDate(suggestedScheduleDate);
        }
    }, [scheduleDate, suggestedScheduleDate]);


    const onAddNote = (note) => {
        const newNote = {
            storedBy: currentUser.userName,
            storedAt: moment().toISOString(),
            value: note,
            createdBy: {
                firstName: currentUser.firstName,
                surname: currentUser.surname,
            },
            note: noteId,
        };
        setNotes([...notes, newNote]);
    };

    const onSetAssignee = useCallback(user => setAssignee(user), []);
    const onClickCategoryOption = useCallback((optionId: string, categoryId: string) => {
        setSelectedCategories(prevCategoryOptions => ({
            ...prevCategoryOptions,
            ...{ [categoryId]: optionId },
        }));
        setCategoryOptionsError(prevError => ({
            ...prevError,
            ...{ [categoryId]: { touched: true, valid: true } },
        }));
    }, [setSelectedCategories]);

    const onResetCategoryOption = useCallback((categoryId: string) => {
        const newCategoryOptions = { ...selectedCategories };
        delete newCategoryOptions[categoryId];
        setSelectedCategories(newCategoryOptions);
        setCategoryOptionsError(prevError => ({
            ...prevError,
            ...{ [categoryId]: { touched: true, valid: false } },
        }));
    }, [setSelectedCategories, selectedCategories]);

    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    const eventAccess = getProgramEventAccess(programId, stageId);
    if (!eventAccess?.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    return (
        <WidgetEventScheduleComponent
            assignee={assignee}
            stageId={stageId}
            stageName={stage.name}
            programId={programId}
            programCategory={programCategory}
            programName={program.name}
            enableUserAssignment={enableUserAssignment && stage?.enableUserAssignment}
            scheduleDate={scheduleDate}
            displayDueDateLabel={programStageScheduleConfig.displayDueDateLabel}
            suggestedScheduleDate={suggestedScheduleDate}
            onCancel={onCancel}
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            onAddNote={onAddNote}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={orgUnit}
            notes={notes}
            selectedCategories={selectedCategories}
            categoryOptionsError={categoryOptionsError}
            onClickCategoryOption={onClickCategoryOption}
            onResetCategoryOption={onResetCategoryOption}
            onSetAssignee={onSetAssignee}
            {...passOnProps}
        />

    );
};

