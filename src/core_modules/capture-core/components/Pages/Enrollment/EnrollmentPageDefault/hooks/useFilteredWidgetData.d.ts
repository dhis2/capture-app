type CommonEffect = {
    type: string;
    id: string;
    error?: {
        id: string;
        message: string;
    };
    warning?: {
        id: string;
        message: string;
    };
    displayText?: {
        id: string;
        message: string;
    };
    displayKeyValuePair?: {
        id: string;
        key: string;
        value: string;
    };
};
export declare const useFilteredWidgetData: (rulesEffects: Array<CommonEffect> | undefined) => {
    warnings: CommonEffect[];
    errors: CommonEffect[];
    feedbacks: CommonEffect[];
    indicators: CommonEffect[];
};
export {};
