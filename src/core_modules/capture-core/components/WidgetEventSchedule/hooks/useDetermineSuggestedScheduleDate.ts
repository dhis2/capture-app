import moment from 'moment';
import { convertServerToClient, convertClientToForm } from '../../../converters';
import { dataElementTypes } from '../../../metaData';

const convertDate = (date: any): any => convertServerToClient(date, dataElementTypes.DATE);

const sortByMostRecentDate = (a: any, b: any) => moment.utc(b.eventDate).diff(moment.utc(a.eventDate));

const getSuggestedDateByNextScheduleDate = (id: string, eventData: Array<any>) => {
    const possibleNextScheduleValues = eventData
        .map(event => ({ ...event, eventDate: event.scheduledAt ?? event.occurredAt }))
        .reduce((acc, event) => {
            event.dataValues.forEach((item: any) => {
                if (item.dataElement === id && item.value !== null) {
                    acc.push({ ...item, eventDate: convertDate(event.eventDate) });
                }
            });
            return acc;
        }, [] as any[]).sort(sortByMostRecentDate);
    if (!possibleNextScheduleValues.length) { return undefined; }
    return possibleNextScheduleValues[0].value;
};

const getSuggestedDateByStandardInterval = (standardInterval: number, eventData: Array<any>) => {
    const events = eventData
        .map(event => ({ eventDate: event.scheduledAt ?? event.occurredAt }))
        .filter(event => event.eventDate)
        .map(event => ({ eventDate: convertDate(event.eventDate) }))
        .sort(sortByMostRecentDate);
    if (!events.length) { return undefined; }

    return moment(events[0].eventDate).add(standardInterval, 'days').format();
};

type Props = {
    programStageScheduleConfig?: {
        id: string;
        nextScheduleDate?: {
            id: string;
        };
        standardInterval?: number | null;
        generatedByEnrollmentDate?: boolean | null;
        minDaysFromStart: number;
    };
    programConfig?: {
        displayIncidentDate?: boolean;
    };
    enrolledAt: string;
    occurredAt: string;
    initialScheduleDate?: string;
    eventData: Array<any>;
    hideDueDate?: boolean;
};

const calculateSuggestedDateFromStart = ({
    generatedByEnrollmentDate,
    displayIncidentDate,
    enrolledAt,
    occurredAt,
    minDaysFromStart,
}: {
    generatedByEnrollmentDate?: boolean | null;
    displayIncidentDate?: boolean;
    enrolledAt: string;
    occurredAt: string;
    minDaysFromStart: number;
}) => {
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
}: Props) => {
    if (initialScheduleDate && !hideDueDate) { return initialScheduleDate; }
    if (!programStageScheduleConfig || !programConfig) { return undefined; }

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
        () => {
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
        () => nextScheduleDate?.id &&
            getSuggestedDateByNextScheduleDate(nextScheduleDate.id, stageEvents),
        () => standardInterval &&
            getSuggestedDateByStandardInterval(standardInterval, stageEvents),
        () => calculateSuggestedDateFromStart({
            generatedByEnrollmentDate,
            displayIncidentDate,
            enrolledAt,
            occurredAt,
            minDaysFromStart,
        }),
    ];
    const suggestedDate = scheduleDateComputeSteps.reduce((currentScheduleDate, computeScheduleDate) =>
        (!currentScheduleDate ? computeScheduleDate() : currentScheduleDate)
    , undefined);

    return convertClientToForm(suggestedDate, dataElementTypes.DATE);
};
