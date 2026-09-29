export type Props = {
    enrollment: Record<string, any>;
    canCascadeDeleteEnrollment: boolean;
    program: Record<string, unknown>;
    onDelete: (arg: Record<string, any>) => void;
};
