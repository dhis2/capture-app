import { systemSettingsStore } from '../../metaDataMemoryStores';
import { dataElementTypes } from '../../metaData';
import { convertValue as convertClientToForm } from '../clientToForm';
import { convertValue as convertFormToClient } from '../formToClient';

const { DATETIME } = dataElementTypes;

describe('DATETIME form round trip', () => {
    beforeEach(() => {
        systemSettingsStore.set({ calendar: 'gregory', dateFormat: 'YYYY-MM-DD', serverTimeZoneId: 'Africa/Kampala' });
    });

    it('shows legacy values in the server time zone', () => {
        expect(convertClientToForm('2026-11-10T13:00:00.000Z', DATETIME)).toEqual({
            date: '2026-11-10',
            time: '16:00',
            originalValue: '2026-11-10T13:00:00.000Z',
        });
    });

    it('keeps the original value when unchanged', () => {
        const formValue = convertClientToForm('2026-11-10T13:00:45.123Z', DATETIME);
        expect(convertFormToClient(formValue, DATETIME)).toBe('2026-11-10T13:00:45.123Z');
    });

    it('keeps the original value when changed and changed back', () => {
        const formValue = convertClientToForm('2026-11-10T13:00:00.000Z', DATETIME);
        const changedBack = { ...formValue, time: '17:00' };
        expect(convertFormToClient({ ...changedBack, time: '16:00' }, DATETIME)).toBe('2026-11-10T13:00:00.000Z');
    });

    it('sends a timezone-free value when changed', () => {
        const formValue = convertClientToForm('2026-11-10T13:00:00.000Z', DATETIME);
        expect(convertFormToClient({ ...formValue, time: '17:15' }, DATETIME)).toBe('2026-11-10T17:15:00.000');
    });

    it('sends a timezone-free value for new values', () => {
        expect(convertFormToClient({ date: '2026-11-10', time: '09:05' }, DATETIME)).toBe('2026-11-10T09:05:00.000');
    });
});
