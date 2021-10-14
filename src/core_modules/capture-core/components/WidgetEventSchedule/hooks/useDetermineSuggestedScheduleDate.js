// @flow
import moment from 'moment';

const sortByMostRecentDate = (a, b) => moment.utc(a.eventDate).diff(moment.utc(b.eventDate));

const getNextScheduleDate = (id, eventData) => {
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

const getScheduleDateByStandardInterval = (stageId, standardInterval, eventData) => {
    const eventsInStage = eventData.filter(event => event.programStage === stageId).sort(sortByMostRecentDate);
    if (!eventsInStage.length) { return undefined; }

    return moment(eventsInStage[0].eventDate).add(standardInterval, 'days').format();
};

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
        suggestedScheduleDate = getNextScheduleDate(nextScheduleDate.id, eventData);
    } else if (standardInterval) {
        suggestedScheduleDate = getScheduleDateByStandardInterval(id, standardInterval, eventData);
    } else if (generatedByEnrollmentDate || !programConfig.displayIncidentDate) {
        suggestedScheduleDate = moment(enrollmentDate).add(minDaysFromStart, 'days').format();
    } else {
        suggestedScheduleDate = moment(incidentDate).add(minDaysFromStart, 'days').format();
    }
    return suggestedScheduleDate;
};
