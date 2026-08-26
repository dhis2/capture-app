export type PlainProps = {
    formHorizontal?: boolean | null;
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void;
};

export type Props = {
    dataEntryHasChanges: boolean;
    formHorizontal?: boolean | null;
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void;
};

export type StateProps = {
    dataEntryHasChanges: boolean;
    formHorizontal?: boolean | null;
};

export type ContainerProps = Record<string, never>;

export type MapStateToProps = (state: any, props: ContainerProps) => StateProps;
