import React from 'react';
import { ConditionalTooltip } from '../../../Tooltips/ConditionalTooltip';

type GetTooltipContent = (props: any) => string | undefined;

export const withConditionalTooltip = (
    getTooltipContent: GetTooltipContent,
    { wrapperStyle }: { wrapperStyle?: React.CSSProperties } = {},
) =>
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
