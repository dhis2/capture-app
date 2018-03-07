// @flow
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import type { IMomentConverter } from '../RulesEngine/rulesEngine.types';

const momentFormat = 'YYYY-MM-DD';

class RulesMomentConverter implements IMomentConverter {
    rulesDateToMoment(rulesEngineValue: string): Moment {
        return moment(rulesEngineValue, momentFormat);
    }
    momentToRulesDate(momentObject: Moment): string {
        return momentObject.format(momentFormat);
    }
}

export default new RulesMomentConverter();
