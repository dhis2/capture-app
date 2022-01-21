// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import { useTeiRelationship } from './hooks/useTeiRelationship';
import type { Props } from './widgetRelationship.types';

export const WidgetRelationship = ({ teiId }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const { teiRelationship } = useTeiRelationship(teiId);
    console.log({ teiRelationship });
    return (
        <div
            data-test="relationship-widget"
        >
            <Widget
                header={i18n.t("TEI's Relationships")}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                Hello world
            </Widget>
        </div>
    );
};
