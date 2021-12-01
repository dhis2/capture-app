// @flow
import moment from 'moment';
import { dataElementTypes } from '../../../metaData';
import { convertServerToClient, convertClientToForm } from '../../../converters';

const convertDate = (date): any => convertServerToClient(date, dataElementTypes.DATE);

const sortByMostRecentDate = (a, b) => moment.utc(b.eventDate).diff(moment.utc(a.eventDate));

const getSuggestedDateByNextScheduleDate = (id, eventData) => {
    const possibleNextScheduleValues = eventData.reduce((acc, event) => {
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
        .map(event => ({ eventDate: convertDate(event.eventDate) }))
        .sort(sortByMostRecentDate);
    if (!events.length) { return undefined; }

    return moment(events[0].eventDate).add(standardInterval, 'days').format();
};

/* eslint-disable complexity */
/**
 * Based on this docs https://docs.google.com/document/d/1I9-xc1oA95cWb64MHmIJXTHXQnxzi1SJ3RUmiuzSh78/edit#heading=h.6omlcjr0bk5n
 * to determine the suggested schedule date
 */
type Props = {
    programStageScheduleConfig: {
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
    enrollmentDate: string,
    incidentDate: string,
    eventData: Array<Object>
}
export const useDetermineSuggestedScheduleDate = ({
    programStageScheduleConfig,
    programConfig,
    enrollmentDate,
    incidentDate,
    eventData,
}: Props) => {
    if (!programStageScheduleConfig) { return undefined; }

    const {
        nextScheduleDate,
        standardInterval,
        generatedByEnrollmentDate,
        minDaysFromStart,
    } = programStageScheduleConfig;
    const scheduleDateComputeSteps = [
        () => nextScheduleDate?.id && getSuggestedDateByNextScheduleDate(nextScheduleDate.id, eventData),
        () => standardInterval && getSuggestedDateByStandardInterval(standardInterval, eventData),
        () => {
            let suggestedScheduleDate;
            if (generatedByEnrollmentDate || !programConfig.displayIncidentDate) {
                suggestedScheduleDate = moment(enrollmentDate).add(minDaysFromStart, 'days').format();
            } else {
                suggestedScheduleDate = moment(incidentDate).add(minDaysFromStart, 'days').format();
            }
            return suggestedScheduleDate;
        },
    ];
    const suggestedDate = scheduleDateComputeSteps.reduce((currentScheduleDate, computeScheduleDate) =>
        (!currentScheduleDate ? computeScheduleDate() : currentScheduleDate)
    , undefined);

    return convertClientToForm(suggestedDate, dataElementTypes.DATE);
};
