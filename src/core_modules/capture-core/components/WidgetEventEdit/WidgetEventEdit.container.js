// @flow
import React, { type ComponentType } from 'react';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { useDispatch } from 'react-redux';
import { spacersNum, Button, colors, IconEdit24, IconArrowLeft24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from 'capture-core/components/ConditionalTooltip';
import { useEnrollmentEditEventPageMode, useAvailableProgramStages } from 'capture-core/hooks';
import { useReduxOrgUnit } from 'capture-core/redux/organisationUnits';
import type { Props } from './widgetEventEdit.types';
import { startShowEditEventDataEntry } from './WidgetEventEdit.actions';
import { Widget } from '../Widget';
import { EditEventDataEntry } from './EditEventDataEntry/';
import { ViewEventDataEntry } from './ViewEventDataEntry/';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { getProgramEventAccess } from '../../metaData';
import { useCategoryCombinations } from '../DataEntryDhis2Helpers/AOC/useCategoryCombinations';

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
        justifyContent: 'space-between',
        background: colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    button: { margin: spacersNum.dp8 },
    tooltip: { display: 'inline-flex' },
};

export const WidgetEventEditPlain = ({
    classes,
    eventStatus,
    initialScheduleDate,
    programStage,
    programStage: { name, icon },
    onGoBack,
    onCancelEditEvent,
    onHandleScheduleSave,
    programId,
    orgUnitId,
    enrollmentId,
    teiId,
}: Props) => {
    const dispatch = useDispatch();
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const { orgUnit, error } = useReduxOrgUnit(orgUnitId);

    const eventAccess = getProgramEventAccess(programId, programStage.id);
    const availableProgramStages = useAvailableProgramStages(programStage, teiId, enrollmentId, programId);
    const { programCategory } = useCategoryCombinations(programId);
    if (error) {
        return error.errorComponent;
    }

    return orgUnit ? (
        <div data-test="widget-enrollment-event">
            <div className={classes.menu}>
                <Button small secondary className={classes.button} onClick={onGoBack}>
                    <IconArrowLeft24 />
                    {i18n.t('Back to all stages and events')}
                </Button>

                {currentPageMode === dataEntryKeys.VIEW && (
                    <div className={classes.button}>
                        <ConditionalTooltip
                            content={i18n.t('You don\'t have access to edit this event')}
                            enabled={!eventAccess?.write}
                            wrapperClassName={classes.tooltip}
                        >
                            <Button
                                small
                                secondary
                                disabled={!eventAccess?.write}
                                onClick={() => dispatch(startShowEditEventDataEntry(orgUnit, programCategory))}
                            >
                                <IconEdit24 />
                                {i18n.t('Edit event')}
                            </Button>
                        </ConditionalTooltip>
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
                            eventStatus={eventStatus}
                            onCancelEditEvent={onCancelEditEvent}
                            hasDeleteButton
                            onHandleScheduleSave={onHandleScheduleSave}
                            initialScheduleDate={initialScheduleDate}
                            allowGenerateNextVisit={programStage.allowGenerateNextVisit}
                            availableProgramStages={availableProgramStages}
                            hideDueDate={programStage.hideDueDate}
                        />
                    )}
                </div>
            </Widget>
        </div>
    ) : null;
};
export const WidgetEventEdit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventEditPlain);
