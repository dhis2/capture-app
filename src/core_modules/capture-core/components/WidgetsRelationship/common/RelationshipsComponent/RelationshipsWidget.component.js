// @flow
import React, { type ComponentType, useState } from 'react';
import { Chip, IconLink24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../Widget';
import { RelationshipTables } from './RelationshipsTables.component';
import type { OutputRelationship } from '../../../WidgetRelationships/common.types';
import type { Url } from '../../../../utils/url';
import { NewTrackedEntityRelationship } from '../../WidgetTrackedEntityRelationship/NewTrackedEntityRelationship';

type Props = {|
    relationships: Array<OutputRelationship>,
    title: string,
    onAddRelationship: () => void,
    onLinkedRecordClick: (parameters: Url) => void,
    teiId?: string,
    eventId?: string,
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

const RelationshipsWidgetPlain = ({ relationships, title, teiId, eventId, classes, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const count = relationships.reduce((acc, curr) => { acc += curr.linkedEntityData.length; return acc; }, 0);
    return (
        <div
            data-test="relationship-widget"
        >
            <Widget
                header={(
                    <div className={classes.header}>
                        <span className={classes.icon}><IconLink24 /></span>
                        <span>{title}</span>
                        {relationships && (
                            <Chip dense>
                                {count}
                            </Chip>
                        )}
                    </div>
                )}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={open}
            >
                <RelationshipTables
                    relationships={relationships}
                    classes={classes}
                    {...passOnProps}
                />

                {teiId && (
                    <NewTrackedEntityRelationship
                        teiId={teiId}
                        {...passOnProps}
                    />
                )}

                {eventId && (
                    <div>
                        <h3>Add event relationships</h3>
                        <p>Not implemented yet</p>
                    </div>
                )}
            </Widget>
        </div>
    );
};

export const RelationshipsWidget: ComponentType<Props> = withStyles(styles)(RelationshipsWidgetPlain);
