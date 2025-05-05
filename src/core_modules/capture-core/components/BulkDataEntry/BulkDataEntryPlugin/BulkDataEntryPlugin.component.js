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
            <div style={{ marginTop: '50px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    TODO delete buttons before merge
                </p>
                <p style={{ marginBottom: '8px' }}>
                    Dummy buttons for testing that will be inside the Plugin.
                </p>
                <Button onClick={onBackToOriginPage} style={{ marginRight: '8px' }}>
                    Back to origin to add trackedEntities
                </Button>
                <Button onClick={onClose} style={{ marginRight: '8px' }}>
                    Close bulk data entry form
                </Button>
            </div>
        </div>
    );
};
