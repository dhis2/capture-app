export type Props = {
    enrollment: Record<string, any>;
    canCascadeDeleteEnrollment: boolean;
    onDelete: (arg: Record<string, any>) => void;
};
