// @flow
import { createReducerDescription } from '../../trackerRedux';
import {
    actionTypes as notesActionTypes,
} from '../../components/Notes/notes.actions';


export const notesDesc = createReducerDescription({
    [notesActionTypes.SET_NOTES]: (state, action) => ({
        ...state,
        [action.payload.key]: action.payload.notes,
    }),
    [notesActionTypes.ADD_NOTE]: (state, action) => {
        const {key} = action.payload;
        const {note} = action.payload;

        return {
            ...state,
            [key]: [...state[key], note],
        };
    },
    [notesActionTypes.REMOVE_NOTE]: (state, action) => {
        const {key} = action.payload;
        const clientId = action.payload.noteClientId;

        return {
            ...state,
            [key]: state[key].filter(n => n.clientId !== clientId),
        };
    },
}, 'notes');
