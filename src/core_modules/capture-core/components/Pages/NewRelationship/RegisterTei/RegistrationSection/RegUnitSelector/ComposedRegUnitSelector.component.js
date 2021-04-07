// @flow
import * as React from 'react';
import {
    withDefaultShouldUpdateInterface,
    withDefaultFieldContainer,
    withLabel,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
    withOrgUnitFieldImplicitRootsFilterHandler,
    orgUnitFieldScopes,
} from '../../../../../FormFields/New';

const OrgUnitFieldImplicitRootsFilterHandlerHOC =
    withOrgUnitFieldImplicitRootsFilterHandler()(SingleOrgUnitSelectField);


type Props = {
    onUpdateSelectedOrgUnit: (orgUnit: ?Object) => void,
};

class OrgUnitFieldWrapper extends React.Component<Props> {
    render() {
        const { onUpdateSelectedOrgUnit, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <OrgUnitFieldImplicitRootsFilterHandlerHOC
                onSelect={onUpdateSelectedOrgUnit}
                scope={orgUnitFieldScopes.USER_CAPTURE}
                maxTreeHeight={200}
                {...passOnProps}
            />
        );
    }
}

export const ComposedRegUnitSelector =
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
                    withInternalChangeHandler()(
                        OrgUnitFieldWrapper,
                    ),
                ),
            ),
        ),
    );
