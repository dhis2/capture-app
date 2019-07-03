// @flow
import { dataElementTypes } from '../../../../metaData';
import { convertClientToForm } from '../../../../converters';

const dateInputTypes = {
    ABSOULTE: 'ABSOLUTE',
    RELATIVE: 'RELATIVE',
};

type DateInputFilter = {
    type: $Values<typeof dateInputTypes>,
    period?: ?string,
    startDate?: ?string,
    endDate?: ?string,
    startBuffer?: ?number,
    endBuffer?: ?number,
};

const getDateFilter = (dateInputFilter: DateInputFilter) => {
    if (dateInputFilter.type === dateInputTypes.ABSOULTE) {
        return {
            main: 'CUSTOM_RANGE',
            from: convertClientToForm(dateInputFilter.startDate, dataElementTypes.DATE),
            to: convertClientToForm(dateInputFilter.endDate, dataElementTypes.DATE),
        };
    }

    return {
        main: dateInputFilter.period,
        from: dateInputFilter.startBuffer,
        to: dateInputFilter.endBuffer,
    };
};

const getFilter = (filter) => {
    if (filter.type === 'DATE') {
        return getDateFilter(filter.clientData);
    }
    return filter.value;
};

export const handleChooseWorkingList = (state: ReduxState, action: ReduxAction<any, any>) => {
    const newState = { ...state };
    const { listId, filters } = action.payload;
    const filterTexts = filters ? filters.reduce((accFilters, filter) => ({
        ...accFilters,
        [filter.id]: getFilter(filter),
    }), {}) : {};

    newState[listId] = {
        ...filterTexts,
    };

    return newState;
};
