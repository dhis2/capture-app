// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Plugin } from '@dhis2/app-runtime/experimental';
import { useNavigate } from 'capture-core/utils/routing';

type EnrollmentPluginProps = {|
    enrollmentId: string,
    programId?: string,
    teiId: string,
    orgUnitId: string,
    pluginSource: string,
    programStageId?: string,
    eventId?: string,
|};

export const EnrollmentPlugin = ({ pluginSource, ...passOnProps }: EnrollmentPluginProps) => {
    const [pluginWidth, setPluginWidth] = useState(undefined);
    const { navigate } = useNavigate();
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
                navigate={navigate}
                {...passOnProps}
            />
        </div>
    );
};
