import React, { useMemo } from 'react';
import { Button, IconAdd16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip';
import { useStageLabel } from '../../../../../metaData';

type Props = {
    onCreateNew: () => void;
    eventCount: number;
    repeatable?: boolean;
    preventAddingEventActionInEffect?: boolean;
    eventName: string;
};

export const StageCreateNewButton = ({
    onCreateNew,
    eventCount,
    repeatable,
    preventAddingEventActionInEffect,
    eventName,
}: Props) => {
    const event = useStageLabel('event') ?? i18n.t('event');
    const eventsPlural = useStageLabel('event', { plural: true }) ?? i18n.t('events');
    const stageLabel = useStageLabel('programStage') ?? i18n.t('stage');
    const { isDisabled, tooltipContent } = useMemo(() => {
        if (preventAddingEventActionInEffect) {
            return {
                isDisabled: true,
                tooltipContent: i18n.t("You can't add any more {{ programStageName }} {{events}}", {
                    programStageName: eventName,
                    events: eventsPlural,
                    interpolation: { escapeValue: false },
                }),
            };
        }
        if (!repeatable && eventCount > 0) {
            return {
                isDisabled: true,
                tooltipContent: i18n.t('This {{stage}} can only have one {{event}}', {
                    stage: stageLabel,
                    event,
                    interpolation: { escapeValue: false },
                }),
            };
        }
        return {
            isDisabled: false,
            tooltipContent: '',
        };
    }, [eventCount, eventName, preventAddingEventActionInEffect, repeatable, event, eventsPlural, stageLabel]);

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
                {i18n.t('New {{ eventName }} {{event}}', {
                    eventName, event, interpolation: { escapeValue: false },
                })}
            </Button>
        </ConditionalTooltip>
    );
};
