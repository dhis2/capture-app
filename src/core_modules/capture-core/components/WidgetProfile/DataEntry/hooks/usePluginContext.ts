import { useMemo } from 'react';
import log from 'loglevel';
import { pipe } from 'capture-core-utils';
import { convertServerToClient, convertClientToView } from 'capture-core/converters';
import { dataElementTypes } from 'capture-core/metaData';
import type { PluginContext, PluginContextEntry } from '../../../D2Form/FormFieldPlugin/FormFieldPlugin.types';

const convertFn = pipe(convertServerToClient, convertClientToView);

type Enrollment = {
    enrolledAt?: string;
    occurredAt?: string;
    geometry?: { type: string; coordinates: any } | null;
};

type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

type Props = {
    enrollment?: Enrollment;
    orgUnit?: OrgUnit | null;
};

const readOnlyEntry = (name: string, value: any): PluginContextEntry => ({
    setDataEntryFieldValue: () => {
        log.error(`Cannot update ${name} from the profile widget. This field is read-only in this context.`);
    },
    value,
});

export const usePluginContext = ({ enrollment, orgUnit }: Props): PluginContext => useMemo(() => {
    const pluginContext: PluginContext = {};

    if (orgUnit) {
        pluginContext.orgUnit = readOnlyEntry('orgUnit', { id: orgUnit.id, name: orgUnit.name, path: orgUnit.path });
    }

    if (enrollment?.enrolledAt) {
        pluginContext.enrolledAt = readOnlyEntry('enrolledAt', convertFn(enrollment.enrolledAt, dataElementTypes.DATE));
    }

    if (enrollment?.occurredAt) {
        pluginContext.occurredAt = readOnlyEntry('occurredAt', convertFn(enrollment.occurredAt, dataElementTypes.DATE));
    }

    if (enrollment?.geometry) {
        const geometryType = enrollment.geometry.type === 'Point'
            ? dataElementTypes.COORDINATE
            : dataElementTypes.POLYGON;
        pluginContext.geometry = readOnlyEntry(
            'geometry',
            convertServerToClient(enrollment.geometry.coordinates, geometryType),
        );
    }

    return pluginContext;
}, [enrollment, orgUnit]);
