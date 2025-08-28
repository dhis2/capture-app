import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';

export const breakTheGlassAccessDesc = createReducerDescription({
    [enrollmentPageActionTypes.BREAK_THE_GLASS_SUCCESS]: (state, { payload: { teiId, programId } }) => ({
        ...state,
        [teiId]: {
            ...state[teiId],
            [programId]: new Date().getTime() + 3 * 60 * 60 * 1000,
        },
    }),
}, 'breakTheGlassAccess', {});
