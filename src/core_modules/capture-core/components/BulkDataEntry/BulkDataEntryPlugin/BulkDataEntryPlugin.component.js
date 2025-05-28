// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { Props } from './BulkDataEntryPlugin.types';

const styles = () => ({
    container: {
        height: '80vh',
    },
});

const BulkDataEntryPluginPlain = ({
    pluginSource,
    configKey,
    dataKey,
    onComplete,
    onDefer,
    classes,
}: Props) => {
    const [pluginSize, setPluginSize] = useState({ width: undefined, height: undefined });
    const containerRef = useRef<?HTMLDivElement>();

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) return () => {};

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry =>
                setPluginSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
            );
        });

        resizeObserver.observe(container);

        // Cleanup function
        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    return (
        <div ref={containerRef} className={classes.container}>
            <Plugin
                pluginSource={pluginSource}
                width={pluginSize.width}
                height={pluginSize.height}
                configKey={configKey}
                dataKey={dataKey}
                onComplete={onComplete}
                onDefer={onDefer}
            />
            <div style={{ marginTop: '50px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    TODO delete buttons before merge
                </p>
                <p style={{ marginBottom: '8px' }}>
                    Dummy buttons for testing that will be inside the Plugin.
                </p>
                <Button onClick={onDefer} style={{ marginRight: '8px' }}>
                    Back to origin to add trackedEntities
                </Button>
                <Button onClick={onComplete} style={{ marginRight: '8px' }}>
                    Close bulk data entry form
                </Button>
            </div>
        </div>
    );
};

export const BulkDataEntryPlugin = withStyles(styles)(BulkDataEntryPluginPlain);
