// @flow
import moment from 'moment';
import { dataElementTypes, ProgramStage } from '../../../../../metaData';
import { convertClientToServer } from '../../../../../converters';
import { convertCategoryOptionsToServer } from '../../../../../converters/clientToServer';

const ignoreAutoGenerateIfApplicable = (stage, firstStageDuringRegistrationEvent) =>
    !firstStageDuringRegistrationEvent || firstStageDuringRegistrationEvent.id !== stage.id;

export const deriveAutoGenerateEvents = ({
    stages,
    enrolledAt,
    occurredAt,
    programId,
    orgUnitId,
    firstStageMetadata,
    attributeCategoryOptions,
}: {
    stages: Map<string, ProgramStage>,
    enrolledAt: string,
    occurredAt: string,
    programId: string,
    orgUnitId: string,
    firstStageMetadata: ?ProgramStage,
    attributeCategoryOptions: { [categoryId: string]: string } | string,
}) => {
    // in case we have a program that does not have an incident date (occurredAt), such as Malaria case diagnosis,
    // we want the incident to default to enrollmentDate (enrolledAt)
    const sanitizedOccurredAt = occurredAt || enrolledAt;

    // $FlowFixMe[missing-annot]
    return [...stages.values()]
        .filter(({ autoGenerateEvent }) => autoGenerateEvent)
        .filter(stage => ignoreAutoGenerateIfApplicable(stage, firstStageMetadata))
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
                        occurredAt: convertClientToServer(dateToUseInActiveStatus, dataElementTypes.DATE),
                        scheduledAt: convertClientToServer(dateToUseInActiveStatus, dataElementTypes.DATE),
                    }
                    : {
                        status: 'SCHEDULE',
                        // for schedule type of events we want to add the standard interval days to the date
                        scheduledAt: moment(convertClientToServer(dateToUseInScheduleStatus, dataElementTypes.DATE))
                            .add(minDaysFromStart, 'days')
                            .format('YYYY-MM-DD'),
                    };

                return {
                    ...eventInfo,
                    ...eventAttributeCategoryOptions,
                    programStage,
                    program: programId,
                    orgUnit: orgUnitId,
                };
            },
        );
};
