import React from 'react';
import { ConditionalTooltip } from '../../../Tooltips/ConditionalTooltip';

type GetTooltipContent = (props: any) => string | undefined;

const wrapperStyle: React.CSSProperties = {
    display: 'inline-block',
};

export const withConditionalTooltip = (getTooltipContent: GetTooltipContent) =>
    (InnerComponent: React.ComponentType<any>) =>
        (props: any) => {
            const { disabled, ...passOnProps } = props;
            const tooltipContent = getTooltipContent(props);
            const shouldShowTooltip = disabled && !!tooltipContent;

            return (
                <ConditionalTooltip
                    enabled={shouldShowTooltip}
                    content={tooltipContent}
                >
                    <div style={wrapperStyle}>
                        <InnerComponent
                            {...passOnProps}
                            disabled={disabled}
                        />
                    </div>
                </ConditionalTooltip>
            );
        };
