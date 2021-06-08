// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { Widget } from '../Widget';
import type { Props } from './widgetEventEdit.types';
import { EditEventDataEntry } from '../Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/';
import { ViewEventDataEntry } from '../Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/';
import { pageMode } from '../Pages/EnrollmentEvent/EnrollmentEventPage.const';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    name: {
        margin: `0 ${spacersNum.dp4}px`,
    },
    form: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
};

export const WidgetEventEditPlain = ({
    classes,
    programStage,
    programStage: { name, icon },
    mode,
}: Props) => (
    <div data-test="widget-enrollment">
        <Widget
            header={
                <div className={classes.header}>
                    <NonBundledDhis2Icon
                        name={icon?.name}
                        color={icon?.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                    <span className={classes.name}> {name} </span>
                </div>
            }
            onOpen={() => {}}
            onClose={() => {}}
            open
        >
            <div className={classes.form}>
                {mode === pageMode.VIEW ? (
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
export const WidgetEventEdit: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(WidgetEventEditPlain);
