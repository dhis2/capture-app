// @flow
import { getGeneratedUniqueValuesAsync } from '../../../DataEntries/common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { processFormValues } from './process';

type StaticPatternValues = {
    orgUnitCode: string,
};

export const buildFormValues = async (
    foundation: ?RenderFoundation,
    trackedEntityInstanceAttributes: any,
    setFormValues: (uniqueValues: any) => void,
    staticPatternValues: StaticPatternValues,
) => {
    const formValues = processFormValues(trackedEntityInstanceAttributes);
    const generatedUniqueValues = await getGeneratedUniqueValuesAsync(foundation, {}, staticPatternValues);
    const uniqueValues = generatedUniqueValues.reduce((acc, currentValue) => ({ ...acc, [currentValue.id]: currentValue.item.value }), {});
    setFormValues && setFormValues({ ...uniqueValues, ...formValues });
};
