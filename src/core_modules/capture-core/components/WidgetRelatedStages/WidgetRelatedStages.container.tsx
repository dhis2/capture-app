import React, { useRef, useCallback, useState } from 'react';
import { IconLink24, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import { RelatedStagesActions } from './RelatedStagesActions';
import { useLinkedEventByOriginId } from '../WidgetTwoEventWorkspace/hooks';
import type { Props as PlainProps, RelatedStageRefPayload } from './WidgetRelatedStages.types';
import {
    useRelatedStages,
    useBuildRelatedStageEventPayload,
    useAddEventWithRelationship,
    createServerData,
} from './hooks';
import { relatedStageStatus } from './constants';
import { useCommonEnrollmentDomainData } from '../Pages/common/EnrollmentOverviewDomain';
import type { RequestEvent } from '../DataEntries';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        paddingInlineEnd: spacers.dp8,
    },
    actions: {
        marginBlockStart: 0,
        marginBlockEnd: spacers.dp16,
        marginInline: spacers.dp16,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

export const WidgetRelatedStagesPlain = ({
    programId,
    eventId,
    enrollmentId,
    programStageId,
    teiId,
    actionsOptions,
    onUpdateOrAddEnrollmentEvents,
    onUpdateEnrollmentEventsSuccess,
    onUpdateEnrollmentEventsError,
    onNavigateToEvent,
    classes,
}: Props) => {
    const [isLinking, setIsLinking] = useState(false);
    const { enrollment } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { currentRelatedStagesStatus } = useRelatedStages({ programStageId, programId });
    const {
        linkedEvent,
        isLoading: isLinkedEventLoading,
    } = useLinkedEventByOriginId({ originEventId: eventId, skipBidirectionalChecks: true });
    const relatedStageRef = useRef<RelatedStageRefPayload>(null);
    const { buildRelatedStageEventPayload } = useBuildRelatedStageEventPayload();
    const { addEventWithRelationship } = useAddEventWithRelationship({
        eventId,
        onUpdateOrAddEnrollmentEvents,
        onUpdateEnrollmentEventsSuccess,
        onUpdateEnrollmentEventsError,
        onNavigateToEvent,
        setIsLinking,
    });

    const onLink = useCallback(() => {
        setIsLinking(true);
        const serverRequestEvent: RequestEvent | undefined = enrollment?.events.find(e => e.event === eventId);

        const {
            formHasError,
            linkedEvent: relatedStageLinkedEvent,
            relationship,
            linkMode,
        } = buildRelatedStageEventPayload({
            serverRequestEvent,
            relatedStageRef,
            programStageId,
            programId,
            teiId,
            enrollmentId,
        });

        if (formHasError) {
            setIsLinking(false);
            return;
        }

        if (relationship && linkMode) {
            const serverData = createServerData({ enrollment, linkedEvent: relatedStageLinkedEvent, relationship });
            addEventWithRelationship({ serverData, linkMode, eventIdToRedirectTo: relatedStageLinkedEvent?.event });
        }
    }, [
        programStageId,
        programId,
        teiId,
        eventId,
        enrollmentId,
        enrollment,
        buildRelatedStageEventPayload,
        addEventWithRelationship,
    ]);

    if (isLinkedEventLoading || linkedEvent || currentRelatedStagesStatus !== relatedStageStatus.LINKABLE) {
        return null;
    }

    return (
        <Widget
            noncollapsible
            header={
                <div className={classes.header}>
                    <span className={classes.icon}>
                        <IconLink24 />
                    </span>
                    {i18n.t('Linked event')}
                </div>
            }
        >
            <div className={classes.actions}>
                <RelatedStagesActions
                    ref={relatedStageRef}
                    enrollmentId={enrollmentId}
                    programId={programId}
                    programStageId={programStageId}
                    actionsOptions={actionsOptions}
                    onLink={onLink}
                    isLinking={isLinking}
                />
            </div>
        </Widget>
    );
};

export const WidgetRelatedStages = withStyles(styles)(WidgetRelatedStagesPlain);
