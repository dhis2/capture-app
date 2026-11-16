import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PluginContextIds } from './FormFieldPlugin.types';

const noContextIds: PluginContextIds = {
    ownerOrgUnitId: undefined,
    programId: undefined,
    programStageId: undefined,
    enrollmentId: undefined,
    eventId: undefined,
    teiId: undefined,
};

const FormFieldPluginContextIdsContext = createContext<PluginContextIds>(noContextIds);

export const useFormFieldPluginContextIds = () => useContext(FormFieldPluginContextIdsContext);

type ProviderProps = Partial<PluginContextIds> & {
    children: ReactNode;
};

export const FormFieldPluginContextIdsProvider = ({
    ownerOrgUnitId,
    programId,
    programStageId,
    enrollmentId,
    eventId,
    teiId,
    children,
}: ProviderProps) => {
    const contextIds = useMemo<PluginContextIds>(() => ({
        ownerOrgUnitId,
        programId,
        programStageId,
        enrollmentId,
        eventId,
        teiId,
    }), [ownerOrgUnitId, programId, programStageId, enrollmentId, eventId, teiId]);

    return (
        <FormFieldPluginContextIdsContext.Provider value={contextIds}>
            {children}
        </FormFieldPluginContextIdsContext.Provider>
    );
};
