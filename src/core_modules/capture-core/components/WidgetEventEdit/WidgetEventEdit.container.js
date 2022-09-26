// @flow
import React, { type ComponentType, useEffect } from 'react';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { useDispatch } from 'react-redux';
import { spacersNum, Button, colors, IconEdit24, IconArrowLeft24, Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { useEnrollmentEditEventPageMode, useRulesEngineOrgUnit } from 'capture-core/hooks';
import type { Props } from './widgetEventEdit.types';
import { startShowEditEventDataEntry } from './WidgetEventEdit.actions';
import { Widget } from '../Widget';
import { EditEventDataEntry } from './EditEventDataEntry/';
import { ViewEventDataEntry } from './ViewEventDataEntry/';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { getProgramEventAccess } from '../../metaData';
import { cleanUpDataEntry } from '../DataEntry';

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
}: Props) => {
    const dispatch = useDispatch();
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const { orgUnit, error } = useRulesEngineOrgUnit(orgUnitId);

    useEffect(() => () => {
        dispatch(cleanUpDataEntry(dataEntryIds.ENROLLMENT_EVENT));
    }, [dispatch]);

    const eventAccess = getProgramEventAccess(programId, programStage.id);

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
                    <Tooltip
                        content={i18n.t('You don\'t have access to edit this event')}
                    >
                        {({ onMouseOver, onMouseOut, ref }) => (
                            <div
                                ref={(btnRef) => {
                                    if (btnRef && !eventAccess?.write) {
                                        btnRef.onmouseover = onMouseOver;
                                        btnRef.onmouseout = onMouseOut;
                                        ref.current = btnRef;
                                    }
                                }}
                            >
                                <Button
                                    small
                                    secondary
                                    disabled={!eventAccess?.write}
                                    className={classes.button}
                                    onClick={() => dispatch(startShowEditEventDataEntry(orgUnit))}
                                >
                                    <IconEdit24 />
                                    {i18n.t('Edit event')}
                                </Button>
                            </div>
                        )}
                    </Tooltip>
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
                            formFoundation={programStage.stageForm}
                            dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                        />
                    ) : (
                        <EditEventDataEntry
                            dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                            formFoundation={programStage.stageForm}
                            orgUnit={orgUnit}
                            programId={programId}
                            stageId={programStage.id}
                            enrollmentId={enrollmentId}
                            eventStatus={eventStatus}
                            onCancelEditEvent={onCancelEditEvent}
                            hasDeleteButton
                            onHandleScheduleSave={onHandleScheduleSave}
                            initialScheduleDate={initialScheduleDate}
                        />
                    )}
                </div>
            </Widget>
        </div>
    ) : null;
};
export const WidgetEventEdit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventEditPlain);
