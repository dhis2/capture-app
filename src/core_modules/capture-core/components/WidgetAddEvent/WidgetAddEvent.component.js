// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { Widget } from '../Widget';
import type { Props } from './WidgetAddEvent.types';
import { NewEnrollmentEvent } from './NewEnrollmentEvent';

const styles = () => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
});

const WidgetAddEventPlain = ({ programStage, classes }: Props) => {
    const { icon, stageForm } = programStage;

    return (
        <Widget
            noncollapsible
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

        >
            <div data-test="add-event-form">
                <NewEnrollmentEvent
                    id="singleEvent"
                />
            </div>
        </Widget>
    );
};

export const WidgetAddEvent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(WidgetAddEventPlain);
