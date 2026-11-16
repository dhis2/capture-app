import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { useNavigate } from 'capture-core/utils/routing';

export type EnrollmentPluginProps = {
    pluginSource: string;
    programId?: string;
    programStageId?: string;
    enrollmentId?: string;
    eventId?: string;
    teiId?: string;
    ownerOrgUnitId?: string;
};

export const EnrollmentPlugin = ({ pluginSource, ...passOnProps }: EnrollmentPluginProps) => {
    const [pluginWidth, setPluginWidth] = useState<number | undefined>(undefined);
    const { navigate } = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) return undefined;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => setPluginWidth(entry.contentRect.width));
        });

        resizeObserver.observe(container);

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
                navigate={navigate}
                {...passOnProps}
            />
        </div>
    );
};
