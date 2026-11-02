import React from 'react';
import { ConditionalTooltip } from '../../../Tooltips/ConditionalTooltip';

type GetTooltipContent = (props: any) => string | undefined;

const inlineWrapperStyle: React.CSSProperties = {
    display: 'inline-block',
};

export const withConditionalTooltip = (
    getTooltipContent: GetTooltipContent,
    { inline = false }: { inline?: boolean } = {},
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
                    <div style={inline ? inlineWrapperStyle : undefined}>
                        <InnerComponent
                            {...passOnProps}
                            disabled={disabled}
                        />
                    </div>
                </ConditionalTooltip>
            );
        };
