import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { PlainProps } from './BulkDataEntryPlugin.types';

const styles = () => ({
    container: {
        height: 'calc(100vh - 250px)',
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
                setPluginSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
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
