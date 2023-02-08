// @flow
import moment from 'moment';
import { convertServerToClient, convertClientToForm } from '../../../converters';
import { dataElementTypes } from '../../../metaData';
import { convertStringToDateFormat } from '../../../utils/converters/date';


const convertDate = (date): any => convertServerToClient(date, dataElementTypes.DATE);

const sortByMostRecentDate = (a, b) => moment.utc(b.eventDate).diff(moment.utc(a.eventDate));

const getSuggestedDateByNextScheduleDate = (id, eventData) => {
    const possibleNextScheduleValues = eventData
        .map(event => ({ ...event, eventDate: event.scheduledAt ?? event.occurredAt }))
        .reduce((acc, event) => {
            event.dataValues.forEach((item) => {
                if (item.dataElement === id && item.value !== null) {
                    acc.push({ ...item, eventDate: convertDate(event.eventDate) });
                }
            });
            return acc;
        }, []).sort(sortByMostRecentDate);
    if (!possibleNextScheduleValues.length) { return undefined; }
    return possibleNextScheduleValues[0].value;
};

const getSuggestedDateByStandardInterval = (standardInterval, eventData) => {
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
        id: string,
        nextScheduleDate?: {
            id: string
        },
        standardInterval?: ?number,
        generatedByEnrollmentDate?: ?boolean,
        minDaysFromStart: number
    },
    programConfig: {
        displayIncidentDate?: boolean
    },
    enrolledAt: string,
    occurredAt: string,
    initialScheduleDate: string,
    eventData: Array<Object>,
    hideDueDate?: boolean
}

const calculateSuggestedDateFromStart = ({
    generatedByEnrollmentDate,
    displayIncidentDate,
    enrolledAt,
    occurredAt,
    minDaysFromStart,
    stageEvents,
}: Object) => {
    let baseDate;
    if (stageEvents && stageEvents.length) {
        const mostRecentScheduledEvent = stageEvents
            .sort((a, b) => moment.utc(b.scheduledAt).diff(moment.utc(a.scheduledAt)))[0];
        baseDate = mostRecentScheduledEvent.scheduledAt;
    } else if (generatedByEnrollmentDate || !displayIncidentDate) {
        baseDate = enrolledAt;
    } else {
        baseDate = occurredAt;
    }
    return moment(baseDate).add(minDaysFromStart, 'days').format();
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
    if (initialScheduleDate && !hideDueDate) { return convertStringToDateFormat(initialScheduleDate); }
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
        () => {
            if (hideDueDate) {
                return calculateSuggestedDateFromStart({
                    generatedByEnrollmentDate,
                    displayIncidentDate,
                    enrolledAt,
                    occurredAt,
                    minDaysFromStart,
                    stageEvents,
                });
            }
            return undefined;
        },
        () => nextScheduleDate?.id && getSuggestedDateByNextScheduleDate(nextScheduleDate.id, eventData),
        () => standardInterval && getSuggestedDateByStandardInterval(standardInterval, eventData),
        () => calculateSuggestedDateFromStart({
            generatedByEnrollmentDate,
            displayIncidentDate,
            enrolledAt,
            occurredAt,
            minDaysFromStart,
            stageEvents,
        }),
    ];
    const suggestedDate = scheduleDateComputeSteps.reduce((currentScheduleDate, computeScheduleDate) =>
        (!currentScheduleDate ? computeScheduleDate() : currentScheduleDate)
    , undefined);

    // $FlowFixMe dataElementTypes flow error
    return convertStringToDateFormat(convertClientToForm(suggestedDate, dataElementTypes.DATE));
};
