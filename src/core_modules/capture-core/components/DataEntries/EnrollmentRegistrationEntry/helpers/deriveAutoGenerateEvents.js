// @flow
import moment from 'moment';
import { dataElementTypes, ProgramStage } from '../../../../metaData';
import { convertClientToServer } from '../../../../converters';
import { convertCategoryOptionsToServer } from '../../../../converters/clientToServer';
import type { RequestEvent, LinkedRequestEvent } from '../../../DataEntries';
import { generateUID } from '../../../../utils/uid/generateUID';

const ignoreAutoGenerateIfApplicable = (stage, stageToSkip) =>
    !stageToSkip || stageToSkip.programStage !== stage.id;

export const deriveAutoGenerateEvents = ({
    stages,
    enrolledAt,
    occurredAt,
    programId,
    orgUnitId,
    firstStageDuringRegistrationEvent,
    relatedStageLinkedEvent,
    attributeCategoryOptions,
}: {
    stages: Map<string, ProgramStage>,
    enrolledAt: string,
    occurredAt: string,
    programId: string,
    orgUnitId: string,
    firstStageDuringRegistrationEvent: ?RequestEvent,
    relatedStageLinkedEvent: ?LinkedRequestEvent,
    attributeCategoryOptions: { [categoryId: string]: string } | string,
}) => {
    // in case we have a program that does not have an incident date (occurredAt), such as Malaria case diagnosis,
    // we want the incident to default to enrollmentDate (enrolledAt)
    const sanitizedOccurredAt = occurredAt || enrolledAt;

    // $FlowFixMe[missing-annot]
    return [...stages.values()]
        .filter(({ autoGenerateEvent }) => autoGenerateEvent)
        .filter(stage => ignoreAutoGenerateIfApplicable(stage, firstStageDuringRegistrationEvent))
        .filter(stage => ignoreAutoGenerateIfApplicable(stage, relatedStageLinkedEvent))
        .map(
            ({
                id: programStage,
                reportDateToUse: reportDateToUseInActiveStatus,
                generatedByEnrollmentDate: generateScheduleDateByEnrollmentDate,
                openAfterEnrollment,
                minDaysFromStart,
            }) => {
                const dateToUseInActiveStatus =
                    reportDateToUseInActiveStatus === 'enrolledAt' ? enrolledAt : sanitizedOccurredAt;
                const dateToUseInScheduleStatus = generateScheduleDateByEnrollmentDate
                    ? enrolledAt
                    : sanitizedOccurredAt;
                const eventAttributeCategoryOptions = {};
                if (attributeCategoryOptions) {
                    eventAttributeCategoryOptions.attributeCategoryOptions =
                        convertCategoryOptionsToServer(attributeCategoryOptions);
                }
                const eventInfo = openAfterEnrollment
                    ? {
                        status: 'ACTIVE',
                        occurredAt: dateToUseInActiveStatus,
                        scheduledAt: dateToUseInActiveStatus,
                    }
                    : {
                        status: 'SCHEDULE',
                        // for schedule type of events we want to add the standard interval days to the date
                        scheduledAt: convertClientToServer(moment(dateToUseInScheduleStatus)
                            .add(minDaysFromStart, 'days')
                            .format('YYYY-MM-DD'),
                        dataElementTypes.DATE,
                        ),
                    };

                return {
                    ...eventInfo,
                    ...eventAttributeCategoryOptions,
                    event: generateUID(),
                    programStage,
                    program: programId,
                    orgUnit: orgUnitId,
                };
            },
        );
};
