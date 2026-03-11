import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes, orientations } from '../../FormFields/New';
import { UserField } from '../../FormFields/UserField';
import { getModeOptions, modeKeys } from './modeOptions';
import { getAssigneeFilterData } from './assigneeFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

const getStyles: Readonly<any> = (theme: any) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
        marginInlineEnd: theme.typography.pxToRem(-24),
    },
    error: {
        color: theme.palette.error.main,
    },
});

type Value = {
    mode: string;
    provided?: any;
} | string | null;

type PlainProps = {
    value?: Value;
    onCommitValue: (value: any) => void;
};

type Props = PlainProps & WithStyles<typeof getStyles>;

type State = {
    error: string;
};

class AssigneeFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    modeOptions: Array<any>;
    constructor(props: Props) {
        super(props);
        this.modeOptions = getModeOptions();
        this.state = {
            error: '',
        };
    }

    onGetUpdateData() {
        const { value } = this.props;
        if (typeof value === 'string' && isEmptyValueFilter(value)) {
            return getAssigneeFilterData(value);
        }
        return value && getAssigneeFilterData(value);
    }

    onIsValid() { //eslint-disable-line
        const { value } = this.props;
        if (typeof value === 'string' && isEmptyValueFilter(value)) {
            return true;
        }
        if (typeof value === 'object' && value?.mode === modeKeys.PROVIDED && !value?.provided) {
            this.setState({
                error: i18n.t('Please select the user'),
            });
            return false;
        }
        return true;
    }

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    handleModeSelect = (value: string) => {
        this.setState({
            error: '',
        });

        if (!value) {
            this.props.onCommitValue(null);
        } else {
            this.props.onCommitValue({ mode: value });
        }
    }

    handleUserSelect = (user: any) => {
        this.setState({
            error: '',
        });

        this.props.onCommitValue({
            mode: modeKeys.PROVIDED,
            provided: user,
        });
    }

    render() {
        const { value, classes } = this.props;
        const objValue = typeof value === 'string' ? null : value;
        const { mode, provided } = objValue || {};

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={typeof value === 'string' ? value : undefined}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <div
                    className={classes.selectBoxesContainer}
                >
                    <SelectionBoxes
                        options={this.modeOptions}
                        value={mode}
                        orientation={orientations.VERTICAL}
                        multiSelect={false}
                        onSelect={this.handleModeSelect}
                    />
                </div>
                {mode === modeKeys.PROVIDED ? (
                    <div>
                        <UserField
                            value={provided}
                            onSet={this.handleUserSelect}
                            inputPlaceholderText={i18n.t('Search for user')}
                            focusOnMount
                            useUpwardSuggestions
                        />
                    </div>
                ) : null}
                <div
                    className={classes.error}
                >
                    {this.state.error}
                </div>
            </div>
        );
    }
}

export const AssigneeFilter = withStyles(getStyles)(AssigneeFilterPlain) as React.ComponentType<PlainProps>;
