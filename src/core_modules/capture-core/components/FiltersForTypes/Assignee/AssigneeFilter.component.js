// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes, orientations } from '../../FormFields/New';
import { UserField } from '../../FormFields/UserField';
import { getModeOptions, modeKeys } from './modeOptions';
import { getAssigneeFilterData } from './assigneeFilterData';
import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
        marginRight: theme.typography.pxToRem(-24),
    },
    userFieldContainer: {

    },
});

type Value = ?{
    mode: string,
    provided: string,
};

type Props = {
    value: Value,
    onCommitValue: (value: any) => void,
    classes: Object,
};
// $FlowSuppress
class AssigneeFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    modeOptions: Array<Object>;
    constructor(props: Props) {
        super(props);
        this.modeOptions = getModeOptions();
    }

    onGetUpdateData() {
        const { value } = this.props;
        return value && getAssigneeFilterData(value);
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    handleModeSelect = (value: string) => {
        this.props.onCommitValue({ mode: value });
    }

    handleUserSelect = (user: Object) => {
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
                    <div
                        className={classes.userFieldContainer}
                    >
                        <UserField
                            value={provided}
                            onSet={this.handleUserSelect}
                            inputPlaceholderText={i18n.t('Search For user')}
                            focusOnMount
                            useUpwardSuggestions
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default withStyles(getStyles)(AssigneeFilter);
