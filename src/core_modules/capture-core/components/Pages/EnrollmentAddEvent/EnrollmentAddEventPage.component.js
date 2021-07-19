// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { SingleEventRegistrationEntry } from 'capture-core/components/DataEntries';
import type { Props } from './EnrollmentAddEventPage.types';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { Widget } from '../../Widget';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    programStage,
    classes,
}) => {
    const { icon, stageForm } = programStage;

    return (
        <div
            className={classes.container}
            data-test="add-event-enrollment-page-content"
        >
            <div className={classes.title}>
                {i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}
            </div>
            <div>
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
                            <span> {stageForm.name} </span>
                        </div>
                    }
                    noncollapsible
                >
                    <div data-test="edit-event-form">
                        <SingleEventRegistrationEntry
                            id="singleEvent"
                        />
                    </div>
                </Widget>

            </div>

        </div>
    );
};

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
