import * as React from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
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
    onUpdateSelectedOrgUnit: (orgUnit?: OrgUnit | null) => void;
};

class OrgUnitFieldWrapper extends React.Component<Props> {
    render() {
        const { onUpdateSelectedOrgUnit, ...passOnProps } = this.props;
        return (
            <OrgUnitFieldImplicitRootsFilterHandlerHOC
                onSelect={onUpdateSelectedOrgUnit}
                scope={orgUnitFieldScopes.USER_CAPTURE}
                maxTreeHeight={200}
                {...passOnProps as any}
            />
        );
    }
}

export const ComposedRegUnitSelector =
    withDefaultShouldUpdateInterface()(
        withDefaultFieldContainer()(
            withLabel({
                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                onGetCustomFieldLabeClass: (props: any) =>
                    props.labelClass,
            })(
                withFilterProps((props: any) => {
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
