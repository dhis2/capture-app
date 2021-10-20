// @flow
import moment from 'moment';

const sortByMostRecentDate = (a, b) => moment.utc(a.eventDate).diff(moment.utc(b.eventDate));

const getSuggestedDateByNextScheduleDate = (id, eventData) => {
    const possibleNextScheduleValues = eventData.reduce((acc, event) => {
        event.dataValues.forEach((item) => {
            if (item.dataElement === id && item.value !== null) {
                acc.push({ ...item, eventDate: event.eventDate });
            }
        });
        return acc;
    }, []).sort(sortByMostRecentDate);
    if (!possibleNextScheduleValues.length) { return undefined; }
    return possibleNextScheduleValues[0].value;
};

const getSuggestedDateByStandardInterval = (stageId, standardInterval, eventData) => {
    const eventsInStage = eventData.filter(event => event.programStage === stageId).sort(sortByMostRecentDate);
    if (!eventsInStage.length) { return undefined; }

    return moment(eventsInStage[0].eventDate).add(standardInterval, 'days').format();
};

/* eslint-disable complexity */
/**
 * Based on this docs https://docs.google.com/document/d/1I9-xc1oA95cWb64MHmIJXTHXQnxzi1SJ3RUmiuzSh78/edit#heading=h.6omlcjr0bk5n
 * to determine the suggested schedule date
 */
export const useDetermineSuggestedScheduleDate = ({
    programStageScheduleConfig,
    programConfig,
    enrollmentDate,
    incidentDate,
    eventData,
}: Object) => {
    if (!programStageScheduleConfig) { return undefined; }

    const {
        id,
        nextScheduleDate,
        standardInterval,
        generatedByEnrollmentDate,
        minDaysFromStart,
    } = programStageScheduleConfig;

    let suggestedScheduleDate;

    if (nextScheduleDate?.id) {
        suggestedScheduleDate = getSuggestedDateByNextScheduleDate(nextScheduleDate.id, eventData);
    }
    if (standardInterval && !suggestedScheduleDate) {
        suggestedScheduleDate = getSuggestedDateByStandardInterval(id, standardInterval, eventData);
    }
    if (generatedByEnrollmentDate && !suggestedScheduleDate) {
        suggestedScheduleDate = moment(enrollmentDate).add(minDaysFromStart, 'days').format();
    }
    if (programConfig.displayIncidentDate && !suggestedScheduleDate) {
        suggestedScheduleDate = moment(incidentDate).add(minDaysFromStart, 'days').format();
    }
    if (!suggestedScheduleDate) {
        suggestedScheduleDate = moment(incidentDate).add(minDaysFromStart, 'days').format();
    }
    return suggestedScheduleDate;
};
