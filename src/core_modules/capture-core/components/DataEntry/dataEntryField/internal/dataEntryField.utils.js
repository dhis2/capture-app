// @flow
import i18n from '@dhis2/d2-i18n';

type Validator = (value: any) => boolean | { valid: boolean, message: ?string };

export type ValidatorContainer = {
  validator: Validator,
  message: string,
};

export function getValidationError(value: any, validatorContainers: ?Array<ValidatorContainer>) {
  if (!validatorContainers) {
    return null;
  }

  let message;
  const errorEncountered = validatorContainers.some((validatorContainer) => {
    const { validator } = validatorContainer;
    const result = validator(value);

    if (result === true || (result && result.valid)) {
      return false;
    }

    message = (result && result.message) || validatorContainer.message;
    return true;
  });

  return errorEncountered ? message || i18n.t('validation failed') : null;
}
