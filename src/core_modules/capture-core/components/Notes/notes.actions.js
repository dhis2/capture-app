// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { Note } from './notes.types';

export const actionTypes = {
  SET_NOTES: 'SetNotes',
  ADD_NOTE: 'AddTTNote',
  REMOVE_NOTE: 'RemoveNote',
};

export const setNotes = (key: string, notes: Array<Note>) =>
  actionCreator(actionTypes.SET_NOTES)({ key, notes });

export const addNote = (key: string, note: Note) =>
  actionCreator(actionTypes.ADD_NOTE)({ key, note });

export const removeNote = (key: string, noteClientId: string) =>
  actionCreator(actionTypes.REMOVE_NOTE)({ key, noteClientId });
