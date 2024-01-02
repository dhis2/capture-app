// @flow
import React, { useEffect, useRef, useState } from 'react';
// $FlowFixMe - Export will be available in next app-runtime release
import { Plugin } from '@dhis2/app-runtime';
import { useHistory } from 'react-router-dom';

type EnrollmentPluginProps = {|
    enrollmentId: string,
    programId?: string,
    teiId: string,
    orgUnitId: string,
    pluginSource: string,
|};

export const EnrollmentPlugin = ({ pluginSource, ...passOnProps }: EnrollmentPluginProps) => {
    const [pluginWidth, setPluginWidth] = useState(undefined);
    const history = useHistory();
    const containerRef = useRef<?HTMLDivElement>();

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => setPluginWidth(entry.contentRect.width));
        });

        resizeObserver.observe(container);

        // Cleanup function
        // eslint-disable-next-line consistent-return
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
                navigate={history.push}
                {...passOnProps}
            />
        </div>
    );
};
