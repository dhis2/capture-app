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
    serverMinorVersion,
}: {
    stages: Map<string, ProgramStage>,
    enrolledAt: string,
    occurredAt: string,
    programId: string,
    orgUnitId: string,
    firstStageMetadata: ?ProgramStage,
    attributeCategoryOptions: { [categoryId: string]: string } | string,
    serverMinorVersion: number,
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
                        convertCategoryOptionsToServer(attributeCategoryOptions, serverMinorVersion);
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
                    programStage,
                    program: programId,
                    orgUnit: orgUnitId,
                };
            },
        );
};
