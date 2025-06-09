import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import type { ComponentProps } from './FormFieldPlugin.types';

export const FormFieldPluginComponent = (props: ComponentProps) => {
    const { pluginSource, ...passOnProps } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [pluginWidth, setPluginWidth] = useState(0);

    useEffect(() => {
        const { current: container } = containerRef;
        if (container) {
            setPluginWidth(container.offsetWidth);
        }
    }, []);

    return (
        <div ref={containerRef}>
            <Plugin
                pluginSource={pluginSource}
                width={pluginWidth}
                {...passOnProps}
            />
        </div>
    );
};
