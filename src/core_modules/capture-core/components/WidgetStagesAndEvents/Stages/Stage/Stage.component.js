// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import cx from 'classnames';

import { withStyles } from '@material-ui/core';
import { spacersNum } from '@dhis2/ui';
import { StageOverview } from './StageOverview';
import type { Props } from './stage.types';
import { Widget } from '../../../Widget';
import { StageDetail } from './StageDetail/StageDetail.component';

const styles = {
    overview: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
    },
};


export const StagePlain = ({ stage: { name, icon, stageForm }, events, classes, className }: Props) => {
    const [open, setOpenStatus] = useState(true);
    return (<div className={cx(classes.overview, className)}>
        <Widget
            header={<StageOverview
                title={name}
                icon={icon}
                description={stageForm.description ?? ''}
                events={events}
            />}
            onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
            onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
            open={open}
        >
            { events.length > 0 && <StageDetail events={events} data={stageForm.sections.get('#MAIN#')?.elements} />}
        </Widget>

    </div>);
};

export const Stage: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StagePlain);
