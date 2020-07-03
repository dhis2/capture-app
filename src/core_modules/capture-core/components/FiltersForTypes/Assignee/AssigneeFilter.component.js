// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes, orientations } from '../../FormFields/New';
import { UserField } from '../../FormFields/UserField';
import { getModeOptions, modeKeys } from './modeOptions';
import { getAssigneeFilterData } from './assigneeFilterDataGetter';
import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
        marginRight: theme.typography.pxToRem(-24),
    },
    error: {
        color: theme.palette.error.main,
    },
});

type Value = ?{
    mode: string,
    provided: ?Object,
};

type Props = {
    value: Value,
    onCommitValue: (value: any) => void,
    classes: Object,
};

type State = {
    error: string,
};
// $FlowSuppress
// $FlowFixMe[incompatible-variance] automated comment
class AssigneeFilter extends Component<Props, State> implements UpdatableFilterContent<Value> {
    modeOptions: Array<Object>;
    constructor(props: Props) {
        super(props);
        this.modeOptions = getModeOptions();
        this.state = {
            error: '',
        };
    }

    onGetUpdateData() {
        const { value } = this.props;
        return value && getAssigneeFilterData(value);
    }

    onIsValid() { //eslint-disable-line
        const { value } = this.props;
        if (value && value.mode === modeKeys.PROVIDED && !value.provided) {
            this.setState({
                error: i18n.t('Please select the user'),
            });
            return false;
        }
        return true;
    }

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

    handleUserSelect = (user: ?Object) => {
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
        const { mode, provided } = value || {};

        return (
            <div>
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

export default withStyles(getStyles)(AssigneeFilter);
