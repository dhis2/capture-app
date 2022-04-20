// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { StartRangeFilter } from './Start.component';
import { EndRangeFilter } from './End.component';
import type { D2TextField } from '../../FormFields/Generic/D2TextField.component';

const getStyles = (theme: Theme) => ({
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
    start?: ?string,
    end?: ?string,
};

type RangeFilterData = ?{
    start?: ?number,
    end?: ?number,
};

type Props = {
    handleFieldBlur: (value: ?Value) => void,
    handleEnterKeyInTo: (value: { [key: string]: ?string }) => void,
    value: RangeFilterData,
    startValueError?: ?string,
    endValueError?: ?string,
    classes: {
        container: string,
        inputContainer: string,
        error: string,
        logicErrorContainer: string,
        toLabelContainer: string,
    },
};

class RangeFilterPlain extends Component<Props> {
    endD2TextFieldInstance: D2TextField;

    getUpdatedValue(valuePart: { [key: string]: ?string }) {
        // $FlowFixMe[cannot-spread-indexer] automated comment
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        return Object.keys(valueObject).filter(key => valueObject[key]).length > 0
            ? valueObject
            : { start: undefined, end: undefined };
    }

    handleEnterKeyInStart = () => {
        this.endD2TextFieldInstance.focus();
    };

    handleEnterKeyInEnd = (value: { [key: string]: ?string }) => {
        this.props.handleEnterKeyInTo && this.props.handleEnterKeyInTo(value);
    };

    handleFieldBlur = (value: { [key: string]: ?string }) => {
        this.props.handleFieldBlur && this.props.handleFieldBlur(this.getUpdatedValue(value));
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
                        {/* $FlowSuppress: Flow not working 100% with HOCs */}
                        {/* $FlowFixMe[prop-missing] automated comment */}
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
                        {/* $FlowSuppress: Flow not working 100% with HOCs */}
                        {/* $FlowFixMe[prop-missing] automated comment */}
                        <EndRangeFilter
                            value={value && value.end}
                            error={endValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInEnd}
                            textFieldRef={this.setEndD2TextFieldInstance}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const RangeFilter = withStyles(getStyles)(RangeFilterPlain);
