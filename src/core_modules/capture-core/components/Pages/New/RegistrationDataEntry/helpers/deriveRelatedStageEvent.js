// @flow
import { ProgramStage } from '../../../../../metaData';
import { getConvertedRelatedStageEvent } from '../../../../DataEntries';
import type { RequestEvent } from '../../../../DataEntries';
import type { RelatedStageRefPayload } from '../../../../WidgetRelatedStages';

export const deriveRelatedStageEvent = ({
    clientRequestEvent,
    relatedStageRef,
    firstStageMetaData,
    programId,
    teiId,
}: {
    clientRequestEvent: ?RequestEvent,
    relatedStageRef?: { current: ?RelatedStageRefPayload},
    firstStageMetaData: ?{ stage: ?ProgramStage},
    programId: string,
    teiId?: ?string,
}) => {
    if (relatedStageRef?.current && relatedStageRef.current.eventHasLinkableStageRelationship()) {
        const isValid = relatedStageRef.current.formIsValidOnSave();
        const currentProgramStageId = firstStageMetaData?.stage?.id;
        if (
            !isValid ||
            !relatedStageRef.current?.getLinkedStageValues ||
            !currentProgramStageId ||
            !clientRequestEvent
        ) {
            return {
                formHasError: true,
                linkedEvent: null,
                relationship: null,
                linkMode: null,
            };
        }

        const { selectedRelationshipType, relatedStageDataValues, linkMode } =
            relatedStageRef.current.getLinkedStageValues();

        if (!linkMode) {
            return {
                formHasError: false,
                linkedEvent: null,
                relationship: null,
                linkMode: null,
            };
        }

        const { linkedEvent, relationship } = getConvertedRelatedStageEvent({
            linkMode,
            relatedStageDataValues,
            clientRequestEvent,
            relatedStageType: selectedRelationshipType,
            programId,
            currentProgramStageId,
            teiId,
        });

        return {
            formHasError: false,
            linkedEvent,
            relationship,
            linkMode,
        };
    }
    return {
        formHasError: false,
        linkedEvent: null,
        relationship: null,
        linkMode: null,
    };
};
