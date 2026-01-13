import React from 'react';

const messageTypeClass = {
    error: 'innerInputError',
    info: 'innerInputInfo',
    warning: 'innerInputWarning',
    validating: 'innerInputValidating',
};

type Props = {
    innerMessage?: any;
    messageKey: string;
    classes?: any;
}

export function InnerMessage(props: Props) {
    const { innerMessage: messageContainer, messageKey: key, classes } = props;
    if (messageContainer) {
        const message = messageContainer.message && messageContainer.message[key];
        const className = (classes && classes[messageTypeClass[messageContainer.messageType]]) || '';
        return message ? (<div className={className}>{message}</div>) : null;
    }
    return null;
}
