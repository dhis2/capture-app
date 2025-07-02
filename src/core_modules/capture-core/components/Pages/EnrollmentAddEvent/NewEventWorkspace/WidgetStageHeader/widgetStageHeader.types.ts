type CssClasses = {
    classes: {
        [key: string]: string;
    };
};

export type Props = {
    stage: {
        icon?: {
            name?: string;
            color?: string;
        };
        name?: string;
    };
} & CssClasses;
