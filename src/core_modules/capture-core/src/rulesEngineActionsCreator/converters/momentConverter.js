// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from '../../utils/date';
import type { IMomentConverter } from 'capture-core-utils/RulesEngine/rulesEngine.types';

const momentFormat = 'YYYY-MM-DD';

class RulesMomentConverter implements IMomentConverter {
    rulesDateToMoment(rulesEngineValue: string): moment$Moment {
        return moment(rulesEngineValue, momentFormat);
    }
    momentToRulesDate(momentObject: moment$Moment): string {
        return getFormattedStringFromMomentUsingEuropeanGlyphs(momentObject, momentFormat);
    }
}

export default new RulesMomentConverter();
