// @flow
import React, { type ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { spacersNum, Button, colors, IconEdit24, IconArrowLeft24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './widgetEventEdit.types';
import { startShowEditEventDataEntry } from './WidgetEventEdit.actions';
import { Widget } from '../Widget';
import { EditEventDataEntry } from './EditEventDataEntry/';
import { ViewEventDataEntry } from './ViewEventDataEntry/';
import { pageMode } from '../Pages/EnrollmentEditEvent/EnrollmentEditEventPage.const';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';

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
    programStage,
    programStage: { name, icon },
    onGoBack,
}: Props) => {
    const dispatch = useDispatch();
    const currentPageMode = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent) ? pageMode.EDIT : pageMode.VIEW;

    return (
        <div data-test="widget-enrollment-event">
            <div className={classes.menu}>
                <Button small secondary className={classes.button} onClick={onGoBack}>
                    <IconArrowLeft24 />
                    {i18n.t('Back to all stages and events')}
                </Button>

                <Button
                    small
                    secondary
                    className={classes.button}
                    onClick={() => dispatch(startShowEditEventDataEntry())}
                >
                    <IconEdit24 />
                    {i18n.t('Edit event')}
                </Button>
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
                    {currentPageMode === pageMode.VIEW ? (
                        <ViewEventDataEntry
                            formFoundation={programStage.stageForm}
                        />
                    ) : (
                        <EditEventDataEntry
                            formFoundation={programStage.stageForm}
                        />
                    )}
                </div>
            </Widget>
        </div>
    );
};
export const WidgetEventEdit: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(WidgetEventEditPlain);
