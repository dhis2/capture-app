import { ReactNode } from 'react';

export type Feedback = {
    message: string | { title: string; content: string };
    action?: ReactNode;
    displayType?: 'alert' | 'dialog';
    variant?: 'info' | 'success' | 'warning' | 'critical';
};

export type FeedbackBarComponentProps = {
    feedback?: Feedback;
    onClose: () => void;
};
