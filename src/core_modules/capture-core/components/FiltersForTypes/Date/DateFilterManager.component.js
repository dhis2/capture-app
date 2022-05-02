// @flow
import * as React from 'react';
import moment from 'moment';
import log from 'loglevel';
import { convertMomentToDateFormatString } from '../../../utils/converters/date';
import { DateFilter } from './DateFilter.component';
import { mainOptionKeys } from './options';
import { dateFilterTypes } from './constants';
import type { DateFilterData } from './types';
import type { Value } from './DateFilter.component';
import { areRelativeRangeValuesSupported } from '../../../utils/validators/areRelativeRangeValuesSupported';

type Props = {
    filter: ?DateFilterData,
    filterTypeRef: Function,
    handleCommitValue: () => void,
};

type State = {
    value?: Value,
};

export class DateFilterManager extends React.Component<Props, State> {
    static convertDateForEdit(rawValue: string) {
        const momentInstance = moment(rawValue);
        return convertMomentToDateFormatString(momentInstance);
    }
    static calculateAbsoluteRangeValueState(filter: DateFilterData) {
        return {
            main: mainOptionKeys.ABSOLUTE_RANGE,
            from: filter.ge && DateFilterManager.convertDateForEdit(filter.ge),
            to: filter.le && DateFilterManager.convertDateForEdit(filter.le),
        };
    }
    static calculateRelativeRangeValueState(filter: DateFilterData) {
        return {
            main: mainOptionKeys.RELATIVE_RANGE,
            start:
                (filter.startBuffer || filter.startBuffer === 0)
                    ? Math.abs(filter.startBuffer).toString()
                    : undefined,
            end: (filter.endBuffer || filter.endBuffer === 0) ? filter.endBuffer.toString() : undefined,
        };
    }

    static calculateDefaultValueState(filter: ?DateFilterData) {
        if (!filter) {
            return undefined;
        }

        if (filter.type === dateFilterTypes.RELATIVE) {
            if (filter.period) {
                return {
                    main: filter.period,
                };
            }
            if (areRelativeRangeValuesSupported(filter.startBuffer, filter.endBuffer)) {
                return DateFilterManager.calculateRelativeRangeValueState(filter);
            }
            log.warn(
                'The startBuffer and endBuffer values are not supported by the UI',
                filter.startBuffer,
                filter.endBuffer,
            );
            return undefined;
        }

        return DateFilterManager.calculateAbsoluteRangeValueState(filter);
    }
    constructor(props: Props) {
        super(props);
        this.state = {
            value: DateFilterManager.calculateDefaultValueState(this.props.filter),
        };
    }

    handleCommitValue = (value: ?Object) => {
        this.setState({ value });
        this.props.handleCommitValue && this.props.handleCommitValue();
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DateFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
