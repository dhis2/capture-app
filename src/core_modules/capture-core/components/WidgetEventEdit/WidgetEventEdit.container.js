// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { Widget } from '../Widget';
import type { Props } from './widgetEventEdit.types';
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
            onOpen={() => {}}
            onClose={() => {}}
            open
        >
            {mode === pageMode.VIEW ? (
                <ViewEventDataEntry formFoundation={programStage.stageForm} />
            ) : (
                <EditEventDataEntry formFoundation={programStage.stageForm} />
            )}
        </Widget>
    </div>
);
export const WidgetEventEdit: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(WidgetEventEditPlain);
