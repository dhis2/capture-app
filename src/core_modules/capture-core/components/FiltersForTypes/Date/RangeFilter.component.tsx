/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { StartRangeFilter } from './Start.component';
import { EndRangeFilter } from './End.component';
import type { D2TextField } from '../../FormFields/Generic/D2TextField.component';

const styles: Readonly<any> = (theme: any) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {
        width: '150px',
    },
    toLabelContainer: {
        paddingTop: theme.typography.pxToRem(6),
        paddingLeft: theme.typography.pxToRem(10),
        paddingRight: theme.typography.pxToRem(10),
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
    endD2TextFieldInstance: D2TextField | null = null

    getUpdatedValue(valuePart: { [key: string]: string | null }) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        return Object.keys(valueObject).filter(key => valueObject[key]).length > 0
            ? valueObject
            : { start: undefined, end: undefined };
    }

    handleEnterKeyInStart = () => {
        this.endD2TextFieldInstance?.focus();
    };

    handleFieldBlur = (value: { [key: string]: string | null }) => {
        this.props.handleFieldBlur && this.props.handleFieldBlur(this.getUpdatedValue(value) as any);
    };

    setEndD2TextFieldInstance = (instance: any) => {
        this.endD2TextFieldInstance = instance;
    };

    render() {
        const { value, classes, startValueError, endValueError } = this.props;
        return (
            <div>
                <div className={classes.container}>
                    <div className={classes.inputContainer}>
                        <StartRangeFilter
                            value={value && value.start}
                            error={startValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInStart}
                        />
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer}>
                        <EndRangeFilter
                            value={value && value.end}
                            error={endValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            textFieldRef={this.setEndD2TextFieldInstance}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const RangeFilter = withStyles(styles)(RangeFilterPlain);
