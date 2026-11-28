import { featureAvailable, FEATURES } from 'capture-core-utils/featuresSupport';

// TODO: DHIS2-22491 Remove Legacy dateTimeHandling when v44 is the lowest supported version
export const dateTimeHandlingModes = Object.freeze({
    LEGACY: 'legacy',
    NEW: 'new',
});

const settings = { isNew: false };

/**
 * Sets how DATETIME values are handled, from the dataStore setting capture/dateTimeHandling.
 * Legacy: values are shown in the browser time zone and sent to the server with a timezone (Z).
 * New: values are used without a timezone. Values stored with a timezone have it stripped.
 * Servers from v44 only accept values without a timezone, so New is always used there.
 */
export const initDateTimeHandling = (mode?: string | null) => {
    settings.isNew = mode === dateTimeHandlingModes.NEW || featureAvailable(FEATURES.timeZoneFreeDateTime);
};

export const isNewDateTimeHandling = () => settings.isNew;
