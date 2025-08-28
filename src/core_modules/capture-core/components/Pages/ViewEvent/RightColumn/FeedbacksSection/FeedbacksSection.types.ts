export type PlainProps = {
    feedbacks?: {
        displayTexts?: Array<string> | null;
        displayKeyValuePairs?: Array<{ key: string; value: string }> | null;
    } | null;
};
