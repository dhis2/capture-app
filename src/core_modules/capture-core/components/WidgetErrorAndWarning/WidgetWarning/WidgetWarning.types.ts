import type { Message } from '../content/WidgetErrorAndWarningContent.types';

export type Props = {
    warning?: Array<Message> | null;
};

export type PlainProps = Props & {
    classes?: string;
};
