import React, { useMemo } from 'react';
import { Button, IconAdd16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../../../Tooltips/ConditionalTooltip';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

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
    const programStageLabel = useTermLabel('programStage');
    const { isDisabled, tooltipContent } = useMemo(() => {
        if (preventAddingEventActionInEffect) {
            return {
                isDisabled: true,
                tooltipContent: i18n.t("You can't add any more {{ programStageName }} events", {
                    programStageName: eventName,
                    interpolation: { escapeValue: false },
                }),
            };
        }
        if (!repeatable && eventCount > 0) {
            return {
                isDisabled: true,
                tooltipContent: tCustomTerm('This {{programStageLabel}} can only have one event', { programStageLabel }),
            };
        }
        return {
            isDisabled: false,
            tooltipContent: '',
        };
    }, [eventCount, eventName, preventAddingEventActionInEffect, repeatable, programStageLabel]);

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
