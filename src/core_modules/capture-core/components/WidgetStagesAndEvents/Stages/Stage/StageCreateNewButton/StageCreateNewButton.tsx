import React, { useMemo } from 'react';
import { Button, IconAdd16 } from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip';
import { useTermLabel } from '../../../../../metaData';
import { customTerms } from '../../../../../utils/customTerms';

type Props = {
    onCreateNew: () => void;
    eventCount: number;
    repeatable?: boolean;
    preventAddingEventActionInEffect?: boolean;
    eventName: string;
    stageId: string;
};

export const StageCreateNewButton = ({
    onCreateNew,
    eventCount,
    repeatable,
    preventAddingEventActionInEffect,
    eventName,
    stageId,
}: Props) => {
    const programStageLabel = useTermLabel('programStage', { stageId });
    const eventLabel = useTermLabel('event', { stageId });
    const eventsLabel = useTermLabel('event', { stageId, plural: true });
    const { isDisabled, tooltipContent } = useMemo(() => {
        if (preventAddingEventActionInEffect) {
            return {
                isDisabled: true,
                tooltipContent: customTerms.i18n.t("You can't add any more {{ programStageName }} {{eventsLabel}}", {
                    programStageName: eventName,
                    eventsLabel,
                }),
            };
        }
        if (!repeatable && eventCount > 0) {
            return {
                isDisabled: true,
                tooltipContent: customTerms.i18n.t(
                    'This {{programStageLabel}} can only have one {{eventLabel}}',
                    { programStageLabel, eventLabel },
                ),
            };
        }
        return {
            isDisabled: false,
            tooltipContent: '',
        };
    }, [eventCount, eventName, preventAddingEventActionInEffect, repeatable, programStageLabel, eventLabel, eventsLabel]);

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
                {customTerms.i18n.t('New {{ eventName }} {{eventLabel}}', {
                    eventName, eventLabel,
                })}
            </Button>
        </ConditionalTooltip>
    );
};
