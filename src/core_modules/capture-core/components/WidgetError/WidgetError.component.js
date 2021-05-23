// @flow
import React, { useCallback, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetError.types';

export const WidgetError = ({ classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(false);

    return (
        <div
            className={classes}
        >
            <Widget
                header={i18n.t('Error')}
                open={openStatus}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
            >
                <p>Error widget</p>
            </Widget>
        </div>
    );
};
