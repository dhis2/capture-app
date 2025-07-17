export type StartCompleteEventPayload = {
    eventId: string;
    id: string;
};

export type CompleteEventErrorPayload = {
    error: string;
    id: string;
};

export type CompleteEventPayload = {
    clientValues?: Record<string, any> | null;
    eventId: string;
    event: Record<string, any>;
    requestInfo: {
        data: Record<string, any>;
        endpoint: string;
        method: string;
    };
    id: string;
};

export type CompleteValidationFailedPayload = {
    eventId: string;
    id: string;
};

export type CompleteAbortPayload = {
    eventId: string;
    id: string;
};

export type StartSaveEventPayload = {
    eventId: string;
    id: string;
};

export type SaveEventErrorPayload = {
    error: string;
    id: string;
};

export type SaveEventPayload = {
    clientValues?: Record<string, any> | null;
    eventId: string;
    event: Record<string, any>;
    requestInfo: {
        data: Record<string, any>;
        endpoint: string;
        method: string;
    };
    id: string;
};

export type SaveValidationFailedPayload = {
    itemId: string;
    id: string;
};

export type SaveAbortPayload = {
    itemId: string;
    id: string;
};

export type UpdateFieldPayload = {
    value: any;
    valueMeta: Record<string, any>;
    fieldId: string;
    dataEntryId: string;
    itemId: string;
};

export type UpdateFormFieldPayload = {
    value: any;
    uiState: Record<string, any>;
    formId: string;
    formBuilderId: string;
    elementId: string;
    dataEntryId: string;
    itemId: string;
    updateCompleteUid: string;
};

export type StartRunRulesPostUpdateFieldPayload = {
    dataEntryId: string;
    itemId: string;
    uid: string;
};

export type RulesExecutedPostUpdateFieldPayload = {
    dataEntryId: string;
    itemId: string;
    uid: string;
};

export type AddNotePayload = {
    dataEntryId: string;
    itemId: string;
    note: Record<string, any>;
};

export type RemoveNotePayload = {
    dataEntryId: string;
    itemId: string;
    noteClientId: string;
};

export type SetCurrentDataEntryPayload = {
    dataEntryId: string;
    itemId: string;
    extraProps?: any;
};

export type RemoveRelationshipPayload = {
    dataEntryId: string;
    itemId: string;
    relationshipClientId: string;
};

export type AddRelationshipPayload = {
    dataEntryId: string;
    itemId: string;
    relationship: Record<string, any>;
    newToEntity: Record<string, any>;
};

export type RelationshipAlreadyExistsPayload = {
    dataEntryId: string;
    itemId: string;
    message: string;
};

export type LoadEditDataEntryPayload = Record<string, any>;

export type CleanUpDataEntryPayload = {
    dataEntryId: string;
};
