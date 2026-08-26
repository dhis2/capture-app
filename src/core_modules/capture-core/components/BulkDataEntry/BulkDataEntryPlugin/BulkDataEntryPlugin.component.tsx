import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { PlainProps } from './BulkDataEntryPlugin.types';

const styles = () => ({
    container: {
        flex: 1,
    },
});

const BulkDataEntryPluginPlain = ({
    pluginSource,
    configKey,
    dataKey,
    onComplete,
    onDefer,
    trackedEntityIds,
    classes,
}: PlainProps & WithStyles<typeof styles>) => {
    const [pluginSize, setPluginSize] = useState<{ width?: number; height?: number }>({
        width: undefined,
        height: undefined,
    });
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) return undefined;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry =>
                // Subtracting 10 from the height; if nothing is subtracted, the plugin will infinitely expand its height when using flex grow.
                setPluginSize({ width: entry.contentRect.width, height: entry.contentRect.height - 10 }),
            );
        });

        resizeObserver.observe(container);

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
                trackedEntityIds={trackedEntityIds}
            />
        </div>
    );
};

export const BulkDataEntryPlugin = withStyles(styles)(BulkDataEntryPluginPlain);
