// @flow
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentEventPage.types';
import { pageMode } from './EnrollmentEventPage.const';
import { addEvent } from './EnrollmentEventPage.actions';
import { WidgetEventEdit } from '../../WidgetEventEdit/';

const styles = ({ typography }) => ({
    page: {
        margin: spacersNum.dp16,
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentEventPagePain = ({ mode, programStage, eventId, classes }) => {
    const dispatch = useDispatch();
    useEffect(
        () =>
            dispatch(
                addEvent({
                    event: {
                        extraProps: { eventId },
                        itemId: mode,
                        dataEntryId: 'singleEvent',
                        dataEntryMeta: { eventDate: { type: 'DATE' } },
                        dataEntryUI: {},
                        dataEntryValues: {},
                        dataEntryNotes: [],
                        key: 'singleEvent-viewEvent',
                    },
                }),
            ),
        [eventId, mode, dispatch],
    );

    return (
        <div className={classes.page}>
            <div className={classes.title}>
                {mode === pageMode.VIEW
                    ? i18n.t('Enrollment{{escape}} View Event', {
                        escape: ':',
                    })
                    : i18n.t('Enrollment{{escape}} Edit Event', {
                        escape: ':',
                    })}
            </div>
            {programStage ? (
                <WidgetEventEdit programStage={programStage} mode={mode} />
            ) : (
                <span>
                    {i18n.t('We could not find the stage in the program')}
                </span>
            )}
        </div>
    );
};

export const EnrollmentEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentEventPagePain);
