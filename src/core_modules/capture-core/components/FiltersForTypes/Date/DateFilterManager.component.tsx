import * as React from 'react';
import log from 'loglevel';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { DateFilter } from './DateFilter.component';
import { mainOptionKeys } from './options';
import { dateFilterTypes } from './constants';
import type { DateFilterData } from './types';
import type { Value } from './DateFilter.component';
import { areRelativeRangeValuesSupported } from '../../../utils/validation/validators/areRelativeRangeValuesSupported';

type Props = {
    filter?: DateFilterData | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
};

type State = {
    value?: Value;
};

export class DateFilterManager extends React.Component<Props, State> {
    static convertDateForEdit(rawValue: string) {
        const localDate = convertIsoToLocalCalendar(rawValue);
        return localDate;
    }
    static calculateAbsoluteRangeValueState(filter: DateFilterData) {
        return {
            main: mainOptionKeys.ABSOLUTE_RANGE,
            from: filter.ge ? {
                value: filter.ge && DateFilterManager.convertDateForEdit(filter.ge),
                isValid: true,
            } : undefined,
            to: filter.le ? {
                value: filter.le && DateFilterManager.convertDateForEdit(filter.le),
                isValid: true,
            } : undefined,
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

    static calculateDefaultValueState(filter?: DateFilterData | null) {
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

    handleCommitValue = (value?: Value | null) => {
        this.setState({ value });
        this.props.handleCommitValue && this.props.handleCommitValue();
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <DateFilter
                value={this.state.value}
                innerRef={filterTypeRef as any}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
