import log from 'loglevel';
import type { RelatedStageIsValidProps } from './relatedStageEventIsValid.types';
import { errorCreator } from '../../../../capture-core-utils';
import { ValidationFunctionsByLinkMode } from './ValidationFunctions';


export const relatedStageWidgetIsValid = (props: RelatedStageIsValidProps): boolean => {
    const { linkMode } = props;

    if (!linkMode) {
        return false;
    }

    const validationFunction = ValidationFunctionsByLinkMode[linkMode];

    if (!validationFunction) {
        log.error(errorCreator('No validation function found for referral mode'));
        return false;
    }

    return validationFunction(props);
};
