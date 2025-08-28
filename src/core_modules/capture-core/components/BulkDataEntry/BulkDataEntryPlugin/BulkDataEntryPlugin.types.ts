export type PlainProps = {
    pluginSource: string;
    configKey: string;
    dataKey?: string;
    onComplete: () => Promise<void>;
    onDefer: () => void;
    trackedEntityIds?: Array<string>;
};
