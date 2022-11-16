// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import cx from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { spacersNum, colors, IconAdd16, Button } from '@dhis2/ui';
import { StageOverview } from './StageOverview';
import type { Props } from './stage.types';
import { Widget } from '../../../Widget';
import { StageDetail } from './StageDetail/StageDetail.component';

const styles = {
    overview: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        borderTop: `1px solid ${colors.grey300}`,
    },
    button: {
        margin: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    buttonRow: {
        display: 'flex',
        alignItems: 'center',
    },
};


export const StagePlain = ({ stage, events, classes, className, onCreateNew, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const { id, name, icon, description, dataElements, hideDueDate, repeatable } = stage;
    return (
        <div
            data-test="stage-content"
            className={cx(classes.overview, className)}
        >
            <Widget
                header={<StageOverview
                    title={name}
                    icon={icon}
                    description={description}
                    events={events}
                />}
                borderless
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {events.length > 0 ? <StageDetail
                    stageId={id}
                    eventName={name}
                    events={events}
                    dataElements={dataElements}
                    hideDueDate={hideDueDate}
                    repeatable={repeatable}
                    onCreateNew={onCreateNew}
                    {...passOnProps}
                /> : <Button
                    small
                    secondary
                    icon={<IconAdd16 />}
                    className={classes.button}
                    dataTest="create-new-button"
                    onClick={() => onCreateNew(id)}
                >
                    {i18n.t('New {{ eventName }} event', { eventName: name, interpolation: { escapeValue: false } })}
                </Button>}
            </Widget>
        </div>
    );
};

export const Stage: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagePlain);
