// @flow
import React, { useState, useCallback } from 'react';
import { Chip } from '@dhis2/ui';
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

export const RelationshipsWidget = ({ relationships, title, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const count = relationships.reduce((acc, curr) => { acc += curr.linkedEntityData.length; return acc; }, 0);
    return (
        <div
            data-test="relationship-widget"
        >
            <Widget
                header={<div>
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
                <Relationships relationships={relationships} {...passOnProps} />
            </Widget>
        </div>
    );
};
