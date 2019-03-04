// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import {
    withGotoInterface,
    withDefaultShouldUpdateInterface,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
    withOrgUnitFieldImplicitRootsFilterHandler,
    orgUnitFieldScopes,
} from '../../../../../FormFields/New';

const getStyles = (theme: Theme) => ({
    label: {
        paddingTop: '10px',
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

const ComposedRegUnitSelector =
    withGotoInterface()(
        withDefaultShouldUpdateInterface()(
            withDefaultFieldContainer()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        props.labelClass,
                })(
                    withFilterProps((props: Object) => {
                        const { labelClass, ...passOnProps } = props;
                        return passOnProps;
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withOrgUnitFieldImplicitRootsFilterHandler()(
                                    SingleOrgUnitSelectField,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );

type Props = {
    classes: Object,
    value: string,
    onUpdateSelectedOrgUnit: (orgUnit: ?Object) => void,
};

class RegUnitSelector extends React.Component<Props> {
    static baseComponentStyles = {
        labelContainerStyle: {
            flexBasis: 200,
        },
        inputContainerStyle: {
            flexBasis: 150,
        },
    };
    render() {
        const { classes, onUpdateSelectedOrgUnit, ...passOnProps } = this.props;
        return (
            <ComposedRegUnitSelector
                labelClass={classes.label}
                label={i18n.t('Organisation Unit')}
                styles={RegUnitSelector.baseComponentStyles}
                scope={orgUnitFieldScopes.USER_CAPTURE}
                onSelect={onUpdateSelectedOrgUnit}
                maxTreeHeight={200}
                {...passOnProps}
            />
        );
    }
}
// $FlowFixMe
export default withStyles(getStyles)(RegUnitSelector);
