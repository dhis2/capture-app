export type Props = {
    readonly onSearchSelected: () => void;
    readonly onNewSelected: () => void;
    readonly trackedEntityName: string;
};

type CssClasses = {
    classes: Record<string, string>;
};

export type PlainProps = Props & CssClasses;
