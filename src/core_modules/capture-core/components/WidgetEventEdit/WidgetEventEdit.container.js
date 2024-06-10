// @flow
import React, { type ComponentType, useState, useEffect } from 'react';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
    spacersNum,
    Button,
    colors,
    IconEdit24,
    IconArrowLeft24,
    IconMore16,
    FlyoutMenu,
    MenuItem,
    spacers,
} from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { useEnrollmentEditEventPageMode, useAvailableProgramStages } from 'capture-core/hooks';
import { useCoreOrgUnit } from 'capture-core/metadataRetrieval/coreOrgUnit';
import type { PlainProps, Props } from './widgetEventEdit.types';
import { startShowEditEventDataEntry } from './WidgetEventEdit.actions';
import { Widget } from '../Widget';
import { EditEventDataEntry } from './EditEventDataEntry/';
import { ViewEventDataEntry } from './ViewEventDataEntry/';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { getProgramEventAccess } from '../../metaData';
import { useCategoryCombinations } from '../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { OverflowButton } from '../Buttons';
import { EventChangelogWrapper } from './EventChangelogWrapper';
import { FEATURES, useFeature } from '../../../capture-core-utils';
import { inMemoryFileStore } from '../DataEntry/file/inMemoryFileStore';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    form: {
        padding: spacersNum.dp8,
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
        justifyContent: 'space-between',
        background: colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    menuActions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
    button: { margin: spacersNum.dp8 },
    tooltip: { display: 'inline-flex' },
};

export const WidgetEventEditPlain = ({
    eventStatus,
    initialScheduleDate,
    programStage,
    programStage: { name, icon },
    onGoBack,
    onCancelEditEvent,
    onHandleScheduleSave,
    onSaveExternal,
    programId,
    orgUnitId,
    enrollmentId,
    eventId,
    teiId,
    assignee,
    onSaveAndCompleteEnrollment,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    classes,
}: PlainProps) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const dispatch = useDispatch();
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const [changeLogIsOpen, setChangeLogIsOpen] = useState(false);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    // "Edit event"-button depends on loadedValues. Delay rendering component until loadedValues has been initialized.
    const loadedValues = useSelector(({ viewEventPage }) => viewEventPage.loadedValues);

    const eventAccess = getProgramEventAccess(programId, programStage.id);
    const availableProgramStages = useAvailableProgramStages(programStage, teiId, enrollmentId, programId);
    const { programCategory } = useCategoryCombinations(programId);
    if (error) {
        return error.errorComponent;
    }

    return orgUnit && loadedValues ? (
        <div data-test="widget-enrollment-event">
            <div className={classes.menu}>
                <Button small secondary onClick={onGoBack}>
                    <IconArrowLeft24 />
                    {i18n.t('Back to all stages and events')}
                </Button>

                {currentPageMode === dataEntryKeys.VIEW && (
                    <div className={classes.menuActions}>
                        <ConditionalTooltip
                            content={i18n.t('You don\'t have access to edit this event')}
                            enabled={!eventAccess?.write}
                            wrapperClassName={classes.tooltip}
                        >
                            <Button
                                small
                                secondary
                                disabled={!eventAccess?.write}
                                icon={<IconEdit24 />}
                                onClick={() => dispatch(startShowEditEventDataEntry(orgUnit, programCategory))}
                            >
                                {i18n.t('Edit event')}
                            </Button>
                        </ConditionalTooltip>

                        {supportsChangelog && (
                            <OverflowButton
                                open={actionsIsOpen}
                                onClick={() => setActionsIsOpen(prev => !prev)}
                                icon={<IconMore16 />}
                                small
                                secondary
                                dataTest={'widget-event-edit-overflow-button'}
                                component={(
                                    <FlyoutMenu dense maxWidth="250px">
                                        <MenuItem
                                            label={i18n.t('View changelog')}
                                            dataTest={'event-overflow-view-changelog'}
                                            onClick={() => {
                                                setChangeLogIsOpen(true);
                                                setActionsIsOpen(false);
                                            }}
                                        />
                                    </FlyoutMenu>
                                )}
                            />
                        )}
                    </div>
                )}
            </div>
            <Widget
                header={
                    <div className={classes.header}>
                        {icon && (
                            <div className={classes.icon}>
                                <NonBundledDhis2Icon
                                    name={icon?.name}
                                    color={icon?.color}
                                    width={30}
                                    height={30}
                                    cornerRadius={2}
                                />
                            </div>
                        )}
                        <span> {name} </span>
                    </div>
                }
                noncollapsible
            >
                <div className={classes.form}>
                    {currentPageMode === dataEntryKeys.VIEW ? (
                        <ViewEventDataEntry
                            programId={programId}
                            formFoundation={programStage.stageForm}
                            dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                            hideDueDate={programStage.hideDueDate}
                        />
                    ) : (
                        <EditEventDataEntry
                            dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                            formFoundation={programStage.stageForm}
                            orgUnit={orgUnit}
                            programId={programId}
                            stageId={programStage.id}
                            teiId={teiId}
                            enrollmentId={enrollmentId}
                            eventId={eventId}
                            eventStatus={eventStatus}
                            onCancelEditEvent={onCancelEditEvent}
                            hasDeleteButton
                            onHandleScheduleSave={onHandleScheduleSave}
                            onSaveExternal={onSaveExternal}
                            initialScheduleDate={initialScheduleDate}
                            allowGenerateNextVisit={programStage.allowGenerateNextVisit}
                            askCompleteEnrollmentOnEventComplete={programStage.askCompleteEnrollmentOnEventComplete}
                            availableProgramStages={availableProgramStages}
                            hideDueDate={programStage.hideDueDate}
                            assignee={assignee}
                            onSaveAndCompleteEnrollmentExternal={onSaveAndCompleteEnrollment}
                            onSaveAndCompleteEnrollmentErrorActionType={onSaveAndCompleteEnrollmentErrorActionType}
                            onSaveAndCompleteEnrollmentSuccessActionType={onSaveAndCompleteEnrollmentSuccessActionType}
                        />
                    )}
                </div>
            </Widget>

            {supportsChangelog && changeLogIsOpen && (
                <EventChangelogWrapper
                    isOpen
                    setIsOpen={setChangeLogIsOpen}
                    eventId={loadedValues.eventContainer.id}
                    formFoundation={programStage.stageForm}
                />
            )}
        </div>
    ) : <LoadingMaskElementCenter />;
};
export const WidgetEventEdit: ComponentType<Props> = withStyles(styles)(WidgetEventEditPlain);
