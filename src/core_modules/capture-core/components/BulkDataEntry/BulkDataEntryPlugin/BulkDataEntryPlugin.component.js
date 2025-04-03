// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { Button } from '@dhis2/ui';
import type { Props } from './BulkDataEntryPlugin.types';

export const BulkDataEntryPlugin = ({ pluginSource, configKey, dataKey, onClose, onBackToOriginPage }: Props) => {
    const [pluginWidth, setPluginWidth] = useState(undefined);
    const containerRef = useRef<?HTMLDivElement>();

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) return () => {};

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => setPluginWidth(entry.contentRect.width));
        });

        resizeObserver.observe(container);

        // Cleanup function
        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    return (
        <div ref={containerRef}>
            <Plugin
                pluginSource={pluginSource}
                width={pluginWidth}
                configKey={configKey}
                dataKey={dataKey}
                onClose={onClose}
            />
            <div>
                <br />
                Dummy buttons for testing that will be inside the Plugin - TODO delete before merge
                <br />
                <Button onClick={onBackToOriginPage}>Back to origin to add rows</Button>
                <br />
                <Button onClick={onClose}>Close bulk data entry form</Button>
            </div>
        </div>
    );
};
