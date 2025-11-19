export type Props = {
    enrollment: Record<string, any>;
    onUpdate: (arg: Record<string, any>, redirect?: boolean) => void;
};
