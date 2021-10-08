// @flow
import moment from 'moment';

const sortByDate = (a, b) => moment.utc(b.eventDate).diff(moment.utc(a.eventDate));

const getNextScheduleDate = (id, eventData) => {
    const possibleNextScheduleValues = eventData.reduce((acc, event) => {
        event.dataValues.forEach((item) => {
            if (item.dataElement === id) { acc.push(item); }
        });
        return acc;
    }, []).sort(sortByDate);
    if (!possibleNextScheduleValues.length) { return undefined; }
    return possibleNextScheduleValues[0].value;
};

const getScheduleDateByStandardInterval = (stageId, standardInterval, eventData) => {
    const eventsInStage = eventData.filter(event => event.programStage === stageId).sort(sortByDate);
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
