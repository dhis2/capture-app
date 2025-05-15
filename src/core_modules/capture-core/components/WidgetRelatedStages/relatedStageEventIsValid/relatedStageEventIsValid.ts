import { ValidationFunctionsByLinkMode } from './ValidationFunctions';
import type { RelatedStageIsValidProps } from './relatedStageEventIsValid.types';

export const relatedStageEventIsValid = (props: RelatedStageIsValidProps): boolean => {
    const { linkMode } = props;

    if (!linkMode) {
        return false;
    }

    const validationFunction = ValidationFunctionsByLinkMode[linkMode as string];

    if (!validationFunction) {
        return false;
    }

    return validationFunction(props);
};
