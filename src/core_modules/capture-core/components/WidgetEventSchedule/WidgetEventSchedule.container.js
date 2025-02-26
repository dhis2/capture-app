// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram, getProgramEventAccess, dataElementTypes } from '../../metaData';
import { getCachedOrgUnitName } from '../../metadataRetrieval/orgUnitName';
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
import { convertFormToClient, convertClientToServer } from '../../converters';
import { pipe } from '../../../capture-core-utils';

export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId: initialOrgUnitId,
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
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, initialScheduleDate, ...passOnProps,
    });
    const { fromClientDate } = useTimeZoneConversion();
    const orgUnitName = getCachedOrgUnitName(initialOrgUnitId);
    const { currentUser, noteId } = useNoteDetails();
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduledOrgUnit, setScheduledOrgUnit] = useState();
    useEffect(() => {
        if (initialOrgUnitId && orgUnitName) {
            const orgUnit = { id: initialOrgUnitId, name: orgUnitName };
            setScheduledOrgUnit(orgUnit);
        }
    }, [orgUnitName, initialOrgUnitId]);
    const [isFormValid, setIsFormValid] = useState(false);
    const convertFn = pipe(convertFormToClient, convertClientToServer);
    const serverScheduleDate = convertFn(scheduleDate, dataElementTypes.DATE);
    const serverSuggestedScheduleDate = convertFn(suggestedScheduleDate, dataElementTypes.DATE);
    const [notes, setNotes] = useState([]);
    const [assignee, setAssignee] = useState(storedAssignee);
    const { eventId } = useLocationQuery();
    const selectedOrgUnitId = scheduledOrgUnit?.id || initialOrgUnitId;
    const { events = [] } = useEventsInOrgUnit(selectedOrgUnitId, serverScheduleDate);
    const eventCountInOrgUnit = events
        .filter(event => moment(event.scheduledAt).format('YYYY-MM-DD') === serverScheduleDate).length;
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
        if (!isFormValid) { return; }
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
            scheduleDate: serverScheduleDate,
            orgUnitId: selectedOrgUnitId,
            notes,
            programId,
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
        serverScheduleDate,
        notes,
        programId,
        selectedOrgUnitId,
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
        isFormValid,
    ]);

    const onAddNote = (note) => {
        const newNote = {
            storedBy: currentUser.userName,
            storedAt: fromClientDate(moment().toISOString()).getServerZonedISOString(),
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
                {i18n.t('Program or stage is invalid')};
            </div>
        );
    }

    const eventAccess = getProgramEventAccess(programId, stageId);
    if (!eventAccess?.write) {
        return (
            <NoAccess onCancel={onCancel} />
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
            serverScheduleDate={serverScheduleDate}
            displayDueDateLabel={programStageScheduleConfig.displayDueDateLabel}
            suggestedScheduleDate={suggestedScheduleDate}
            serverSuggestedScheduleDate={serverSuggestedScheduleDate}
            onCancel={onCancel}
            setScheduleDate={setScheduleDate}
            setScheduledOrgUnit={setScheduledOrgUnit}
            setIsFormValid={setIsFormValid}
            onSchedule={onHandleSchedule}
            onAddNote={onAddNote}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={scheduledOrgUnit}
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
