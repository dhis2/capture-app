import React from 'react';

type Props = {
    messages?: Array<any> | null;
};

export const MessageSection = ({ messages }: Props) => {
    if (!messages || messages.length === 0) {
        return null;
    }

    return (
        <div>
            {messages.map((message, index) => (
                <div key={message.id || index}>
                    {message.message || message}
                </div>
            ))}
        </div>
    );
};
