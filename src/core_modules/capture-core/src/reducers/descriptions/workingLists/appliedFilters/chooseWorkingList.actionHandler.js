// @flow
import { dataElementTypes } from '../../../../metaData';
import { convertClientToForm } from '../../../../converters';
import {
    getDateFilterAppliedText,
} from '../../../../components/FiltersForTypes';

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

const getDateFilterForTransformation = (dateInputFilter: DateInputFilter) => {
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

const transformFilter = (filter) => {
    if (filter.type === 'DATE') {
        const transformInput = getDateFilterForTransformation(filter.clientData);
        return getDateFilterAppliedText(transformInput);
    }
    return filter.appliedText;
};

export const handleChooseWorkingList = (state: ReduxState, action: ReduxAction<any, any>) => {
    const newState = { ...state };
    const { listId, filters } = action.payload;
    const filterTexts = filters ? filters.reduce((accFilters, filter) => ({
        ...accFilters,
        [filter.id]: transformFilter(filter),
    }), {}) : {};

    newState[listId] = {
        ...filterTexts,
    };

    return newState;
};
