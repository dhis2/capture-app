// @flow
import React, { useMemo } from 'react';
import { Button, IconAdd16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip';

type Props = {
    onCreateNew: (stageId: string) => void,
    stageWriteAccess: ?boolean,
    eventCount: number,
    repeatable: ?boolean,
    preventAddingEventActionInEffect: ?boolean,
    eventName: string,
}

export const StageCreateNewButton = ({
    onCreateNew,
    stageWriteAccess,
    eventCount,
    repeatable,
    preventAddingEventActionInEffect,
    eventName,
}: Props) => {
    const isDisabled = useMemo(() => {
        if (!stageWriteAccess) {
            return true;
        }
        if (!repeatable && eventCount > 0) {
            return true;
        }
        return !!preventAddingEventActionInEffect;
    }, [eventCount, preventAddingEventActionInEffect, repeatable, stageWriteAccess]);
    const tooltipContent = useMemo(() => {
        if (!stageWriteAccess) {
            return i18n.t('You do not have access to create events in this stage', {
                programStageName: eventName,
                interpolation: { escapeValue: false },
            });
        }
        if (preventAddingEventActionInEffect) {
            return i18n.t("You can't add any more {{ programStageName }} events", {
                programStageName: eventName,
                interpolation: { escapeValue: false },
            });
        }
        if (!repeatable && eventCount > 0) {
            return i18n.t('This stage can only have one event');
        }
        return '';
    }, [eventCount, eventName, preventAddingEventActionInEffect, repeatable, stageWriteAccess]);

    return (
        <ConditionalTooltip
            enabled={isDisabled}
            content={tooltipContent}
            closeDelay={50}
        >
            <Button
                small
                secondary
                icon={<IconAdd16 />}
                onClick={onCreateNew}
                dataTest={'create-new-button'}
                disabled={isDisabled}
            >
                {i18n.t('New {{ eventName }} event', {
                    eventName, interpolation: { escapeValue: false },
                })}
            </Button>
        </ConditionalTooltip>
    );
};
