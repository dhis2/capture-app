export type Props = {
    enrollment: Record<string, any>;
    program: Record<string, unknown>;
    onUpdate: (arg: Record<string, any>) => void;
};
