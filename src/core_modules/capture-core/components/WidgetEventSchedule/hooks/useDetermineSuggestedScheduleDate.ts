import moment from 'moment';
import { convertServerToClient, convertClientToForm } from '../../../converters';
import { dataElementTypes } from '../../../metaData';

const convertDate = (date: any): any => convertServerToClient(date, dataElementTypes.DATE);

const sortByMostRecentDate = (a: { eventDate: string }, b: { eventDate: string }): number => 
    moment.utc(b.eventDate).diff(moment.utc(a.eventDate));

const getSuggestedDateByNextScheduleDate = (id: string, eventData: Array<any>): string | undefined => {
    const possibleNextScheduleValues = eventData
        .map(event => ({ ...event, eventDate: event.scheduledAt ?? event.occurredAt }))
        .reduce((acc: Array<any>, event) => {
            event.dataValues.forEach((item: any) => {
                if (item.dataElement === id && item.value !== null) {
                    acc.push({ ...item, eventDate: convertDate(event.eventDate) });
                }
            });
            return acc;
        }, []).sort(sortByMostRecentDate);
    if (!possibleNextScheduleValues.length) { return undefined; }
    return possibleNextScheduleValues[0].value;
};

const getSuggestedDateByStandardInterval = (standardInterval: number, eventData: Array<any>): string | undefined => {
    const events = eventData
        .map(event => ({ eventDate: event.scheduledAt ?? event.occurredAt }))
        .filter(event => event.eventDate)
        .map(event => ({ eventDate: convertDate(event.eventDate) }))
        .sort(sortByMostRecentDate);
    if (!events.length) { return undefined; }

    return moment(events[0].eventDate).add(standardInterval, 'days').format();
};

/**
 * Based on this docs https://docs.google.com/document/d/1I9-xc1oA95cWb64MHmIJXTHXQnxzi1SJ3RUmiuzSh78/edit#heading=h.6omlcjr0bk5n
 * to determine the suggested schedule date
 */
type Props = {
    programStageScheduleConfig: {
        id: string;
        nextScheduleDate?: {
            id: string;
        };
        standardInterval?: number | null;
        generatedByEnrollmentDate?: boolean | null;
        minDaysFromStart: number;
    };
    programConfig: {
        displayIncidentDate?: boolean;
    };
    enrolledAt: string;
    occurredAt: string;
    initialScheduleDate: string;
    eventData: Array<any>;
    hideDueDate?: boolean;
}

type CalculateDateParams = {
    generatedByEnrollmentDate?: boolean | null;
    displayIncidentDate?: boolean;
    enrolledAt: string;
    occurredAt: string;
    minDaysFromStart: number;
}

const calculateSuggestedDateFromStart = ({
    generatedByEnrollmentDate,
    displayIncidentDate,
    enrolledAt,
    occurredAt,
    minDaysFromStart,
}: CalculateDateParams): string => {
    let suggestedScheduleDate;
    if (generatedByEnrollmentDate || !displayIncidentDate) {
        suggestedScheduleDate = moment(enrolledAt).add(minDaysFromStart, 'days').format();
    } else {
        suggestedScheduleDate = moment(occurredAt).add(minDaysFromStart, 'days').format();
    }
    return suggestedScheduleDate;
};

export const useDetermineSuggestedScheduleDate = ({
    programStageScheduleConfig,
    programConfig,
    enrolledAt,
    occurredAt,
    eventData,
    initialScheduleDate,
    hideDueDate,
}: Props): string | undefined => {
    if (initialScheduleDate && !hideDueDate) { return initialScheduleDate; }
    if (!programStageScheduleConfig) { return undefined; }

    const {
        nextScheduleDate,
        standardInterval,
        generatedByEnrollmentDate,
        minDaysFromStart,
        id: programStageId,
    } = programStageScheduleConfig;
    const {
        displayIncidentDate,
    } = programConfig;
    const stageEvents = eventData.filter(event => event.programStage === programStageId);

    const scheduleDateComputeSteps = [
        (): string | undefined => {
            if (hideDueDate) {
                return calculateSuggestedDateFromStart({
                    generatedByEnrollmentDate,
                    displayIncidentDate,
                    enrolledAt,
                    occurredAt,
                    minDaysFromStart,
                });
            }
            return undefined;
        },
        (): string | undefined => nextScheduleDate?.id ? getSuggestedDateByNextScheduleDate(nextScheduleDate.id, stageEvents) : undefined,
        (): string | undefined => standardInterval ? getSuggestedDateByStandardInterval(standardInterval, stageEvents) : undefined,
        (): string => calculateSuggestedDateFromStart({
            generatedByEnrollmentDate,
            displayIncidentDate,
            enrolledAt,
            occurredAt,
            minDaysFromStart,
        }),
    ];
    const suggestedDate = scheduleDateComputeSteps.reduce((currentScheduleDate, computeScheduleDate) =>
        (!currentScheduleDate ? computeScheduleDate() : currentScheduleDate)
    , undefined as string | undefined);

    return convertClientToForm(suggestedDate, dataElementTypes.DATE);
};
