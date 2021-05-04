// @flow
import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetFeedback.types';

export const WidgetFeedback = ({ className, feedbackRules }: Props) => {
    const [openStatus, setOpenStatus] = useState(false);

    const { filteredText, filteredKeyValue } = useMemo(() => {
        console.log('kjører');
        const data = {
            filteredText: [],
            filteredKeyValue: [],
        };
        data.filteredText = feedbackRules.filter(item => item.type === 'DISPLAYTEXT');
        data.filteredKeyValue = feedbackRules.filter(item => item.type === 'DISPLAYKEYVALUEPAIR');

        return data;
    }, [feedbackRules]);

    const printKeyValuePairs = () => filteredKeyValue && filteredKeyValue.map(item => <p>{item.displayKeyValuePair?.value}</p>);

    return (
        <div
            className={className}
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <>
                    {printKeyValuePairs()}
                </>
            </Widget>
        </div>
    );
};
