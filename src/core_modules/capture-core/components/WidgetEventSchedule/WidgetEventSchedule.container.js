// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram, getProgramEventAccess } from '../../metaData';
import { useOrganisationUnit } from '../../dataQueries';
import { useLocationQuery } from '../../utils/routing';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
    useCommentDetails,
} from './hooks';
import { requestScheduleEvent } from './WidgetEventSchedule.actions';
import { NoAccess } from './AccessVerification';
import type { CategoryOption } from '../FormFields/New/CategoryOptions/CategoryOptions.types';
import { useCategoryCombinations } from '../DataEntryDhis2Helpers/AOC/useCategoryCombinations';

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
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const dispatch = useDispatch();
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName');
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, initialScheduleDate, ...passOnProps,
    });
    const { currentUser, noteId } = useCommentDetails();
    const [scheduleDate, setScheduleDate] = useState('');
    const [comments, setComments] = useState([]);
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

    const onHandleSchedule = useCallback(() => {
        dispatch(requestScheduleEvent({
            scheduleDate,
            comments,
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
        }));
    }, [
        dispatch,
        scheduleDate,
        comments,
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
    ]);

    React.useEffect(() => {
        if (suggestedScheduleDate && !scheduleDate) {
            setScheduleDate(suggestedScheduleDate);
        }
    }, [scheduleDate, suggestedScheduleDate]);


    const onAddComment = (comment) => {
        const newComment = {
            storedBy: currentUser.userName,
            storedAt: moment().toISOString(),
            value: comment,
            createdBy: {
                firstName: currentUser.firstName,
                surname: currentUser.surname,
            },
            note: noteId,
        };
        setComments([...comments, newComment]);
    };

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
            stageId={stageId}
            stageName={stage.name}
            programId={programId}
            programCategory={programCategory}
            programName={program.name}
            scheduleDate={scheduleDate}
            dueDateLabel={programStageScheduleConfig.dueDateLabel}
            suggestedScheduleDate={suggestedScheduleDate}
            onCancel={onCancel}
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            onAddComment={onAddComment}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={orgUnit}
            comments={comments}
            selectedCategories={selectedCategories}
            categoryOptionsError={categoryOptionsError}
            onClickCategoryOption={onClickCategoryOption}
            onResetCategoryOption={onResetCategoryOption}
            {...passOnProps}
        />

    );
};

