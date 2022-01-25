// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Chip } from '@dhis2/ui';
import { Widget } from '../Widget';
import { useTeiRelationship } from './hooks/useTeiRelationship';
import type { Props } from './widgetRelationship.types';
import { Relationships } from './Relationships/';

export const WidgetRelationship = ({ teiId }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const { teiRelationship } = useTeiRelationship(teiId);

    return (
        <div
            data-test="relationship-widget"
        >
            <Widget
                header={<div>
                    <span>{i18n.t("TEI's Relationships")}</span>
                    {teiRelationship && <Chip dense>
                        {teiRelationship.length}
                    </Chip>
                    }
                </div>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <Relationships teiRelationship={teiRelationship} />
            </Widget>
        </div>
    );
};
