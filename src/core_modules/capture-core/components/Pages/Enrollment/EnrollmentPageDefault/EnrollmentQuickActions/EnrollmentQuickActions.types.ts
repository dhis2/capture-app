import type { OutputEffect } from '@dhis2/rules-engine-javascript';

export type EventCount = { eventCount?: number };

export type ProgramStage = {
    id: string;
    dataAccess: {
        write: boolean;
    };
    repeatable: boolean;
};

export type Event = { programStage: string };

export type OwnProps = {
    stages: Array<ProgramStage & EventCount>;
    events: Array<Event>;
    ruleEffects?: Array<OutputEffect>;
};
