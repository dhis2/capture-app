import { ReactNode } from 'react';

export type Feedback = {
    message: string | { title: string; content: string };
    action?: ReactNode;
    displayType?: 'alert' | 'dialog';
};

export type FeedbackBarComponentProps = {
    feedback: Feedback;
    onClose: () => void;
};
