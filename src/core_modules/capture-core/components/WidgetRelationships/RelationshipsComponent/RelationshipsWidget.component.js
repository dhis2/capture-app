// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import { Chip, IconLink24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../Widget';
import { Relationships } from './Relationships.component';
import type { OutputRelationship } from '../common.types';
import type { Url } from '../../../utils/url';

type Props = {|
    relationships: Array<OutputRelationship>,
    title: string,
    onAddRelationship: () => void,
    onLinkedRecordClick: (parameters: Url) => void,
    ...CssClasses,
|}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        paddingRight: spacers.dp8,
    },
};

const RelationshipsWidgetPlain = ({ relationships, title, classes, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const count = relationships.reduce((acc, curr) => { acc += curr.linkedEntityData.length; return acc; }, 0);
    return (
        <div
            data-test="relationship-widget"
        >
            <Widget
                header={<div className={classes.header}>
                    <span className={classes.icon}><IconLink24 /></span>
                    <span>{title}</span>
                    {relationships && <Chip dense>
                        {count}
                    </Chip>
                    }
                </div>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <Relationships
                    relationships={relationships}
                    classes={classes}
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};

export const RelationshipsWidget: ComponentType<Props> = withStyles(styles)(RelationshipsWidgetPlain);
