// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { EditEventDataEntry } from '../../WidgetEventEdit/EditEventDataEntry/EditEventDataEntry.container';
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
    contentWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formWrapper: {
        flexGrow: 2,
        flexBasis: 0,
    },
    rightColumn: {
        flexGrow: 1,
        minWidth: '18.75rem',
        flexBasis: '0rem',
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
            <div className={classes.contentWrapper}>
                <div className={classes.formWrapper}>
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
                            <EditEventDataEntry formFoundation={programStage.stageForm} />
                        </div>
                    </Widget>
                </div>
                <div className={classes.rightColumn}> [right column placeholder]</div>
            </div>


        </div>
    );
};

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
