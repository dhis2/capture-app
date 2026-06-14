import React, { type ComponentType, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacersNum } from '@dhis2/ui';
import { compose } from 'redux';
import { Stage } from './Stage';
import type { PlainProps, InputProps } from './stages.types';
import { withLoadingIndicator } from '../../../HOC';
import { useEnrollmentAccessContext } from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useStageLabel } from '../../../metaData';

const emptyStateStyle = {
    padding: `0 ${spacersNum.dp12}px`,
    color: colors.grey600,
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '19px',
    margin: 0,
    marginBottom: spacersNum.dp12,
};

export const StagesPlain = ({
    stages,
    events,
    ...passOnProps
}: PlainProps) => {
    const { stageReadAccessById } = useEnrollmentAccessContext();
    const stagesLabel = useStageLabel('programStage', { plural: true }) ?? i18n.t('stages');
    const readableStages = useMemo(
        () => stages.filter(stage => stageReadAccessById[stage.id] ?? stage.dataAccess.read),
        [stages, stageReadAccessById],
    );
    const eventsByStage = useMemo(
        () => stages.reduce(
            (acc, stage) => {
                acc[stage.id] = acc[stage.id] || [];
                return acc;
            },
            events.reduce(
                (acc, event) => {
                    const stageId = event.programStage;
                    if (acc[stageId]) {
                        acc[stageId].push(event);
                    } else {
                        acc[stageId] = [event];
                    }
                    return acc;
                },
                {},
            ),
        ),
        [stages, events],
    );

    if (!readableStages.length) {
        return (
            <p style={emptyStateStyle}>
                {i18n.t('No {{stages}} found in this program', {
                    stages: stagesLabel,
                    interpolation: { escapeValue: false },
                })}
            </p>
        );
    }

    return (<>
        {
            readableStages
                .map(stage => (
                    <Stage
                        events={eventsByStage[stage.id]}
                        key={stage.id}
                        stage={stage}
                        {...passOnProps}
                    />
                ))
        }
    </>);
};

export const Stages = compose(withLoadingIndicator())(StagesPlain) as ComponentType<InputProps>;
