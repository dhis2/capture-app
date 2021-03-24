// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentEventEditPagePageActionTypes } from '../../components/Pages/Enrollment/Event/Edit/EnrollmentEventEditPage.actions';
import { enrollmentEventEditPageStatuses } from '../../components/Pages/Enrollment/Event/Edit/enrollmentEventEditPage.constants';

const initialReducerValue = {
    pageStatus: null,
};

export const enrollmentEventEditPageDesc = createReducerDescription({
    [enrollmentEventEditPagePageActionTypes.EVENT_LOADING_FETCH]: state => ({
        ...state,
        pageStatus: enrollmentEventEditPageStatuses.LOADING,
    }),
    [enrollmentEventEditPagePageActionTypes.EVENT_ERROR_FETCH]: state => ({
        ...state,
        pageStatus: enrollmentEventEditPageStatuses.ERROR,
    }),
    [enrollmentEventEditPagePageActionTypes.EVENT_SUCCESS_FETCH]:
      (state, { payload: { teiDisplayName, tetDisplayName, enrollmentDisplayName, enrollmentDisplayDate, programStageDisplayName, eventDisplayDate } }) => ({
          ...state,
          teiDisplayName,
          tetDisplayName,
          enrollmentDisplayDate,
          enrollmentDisplayName,
          programStageDisplayName,
          eventDisplayDate,
          pageStatus: enrollmentEventEditPageStatuses.DEFAULT,
      }),
}, 'enrollmentEventEditPage', initialReducerValue);
