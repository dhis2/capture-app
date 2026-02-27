import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import i18n from '@dhis2/d2-i18n';
import { DateFilterInput, type ValueObject } from './DateFilterInput.component';

const styles: Readonly<any> = (theme: any) => ({
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        gap: theme.typography.pxToRem(8),
    },
    inputContainer: {
        width: '150px',
    },
    toLabelContainer: {
        paddingTop: theme.typography.pxToRem(6),
        paddingInline: theme.typography.pxToRem(10),
        fontSize: theme.typography.body1.fontSize,
    },
    error: {
        ...theme.typography.caption,
        color: theme.palette.error.main,
    },
    logicErrorContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
});

type Value = {
    start?: string | null;
    end?: string | null;
};

type RangeFilterData = {
    start?: number | null;
    end?: number | null;
} | null;

type OwnProps = {
    handleFieldBlur: (value?: Value | null) => void;
    value: RangeFilterData;
    startValueError?: string | null;
    endValueError?: string | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

class RangeFilterPlain extends Component<Props> {
    getUpdatedValue(valuePart: { [key: string]: string | null }) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        return Object.keys(valueObject).filter(key => valueObject[key]).length > 0
            ? valueObject
            : { start: undefined, end: undefined };
    }

    handleFieldBlur = (value: ValueObject) => {
        const part = value as { start?: string; end?: string };
        this.props.handleFieldBlur?.(this.getUpdatedValue(part) as any);
    };

    render() {
        const { value, classes, startValueError, endValueError } = this.props;
        return (
            <div>
                <div className={classes.container}>
                    <div className={classes.inputContainer}>
                        <DateFilterInput
                            field="start"
                            value={value?.start ?? undefined}
                            error={startValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                        />
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer}>
                        <DateFilterInput
                            field="end"
                            value={value?.end ?? undefined}
                            error={endValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const RangeFilter = withStyles(styles)(RangeFilterPlain);
