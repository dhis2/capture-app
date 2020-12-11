// @flow
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from '../../../../capture-core-utils/date';
import type { IMomentConverter } from '../rulesEngine.types';

const momentFormat = 'YYYY-MM-DD';

class RulesMomentConverter implements IMomentConverter {
  // eslint-disable-next-line class-methods-use-this
  rulesDateToMoment(rulesEngineValue: string): moment$Moment {
    return moment(rulesEngineValue, momentFormat);
  }

  // eslint-disable-next-line class-methods-use-this
  momentToRulesDate(momentObject: moment$Moment): string {
    return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject);
  }
}

export default new RulesMomentConverter();
