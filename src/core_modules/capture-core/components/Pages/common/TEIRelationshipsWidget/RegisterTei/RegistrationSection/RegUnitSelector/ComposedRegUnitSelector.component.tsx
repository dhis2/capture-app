import React from 'react';
import {
    withDefaultFieldContainer,
    withLabel,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
    withOrgUnitFieldImplicitRootsFilterHandler,
    orgUnitFieldScopes,
} from '../../../../../../FormFields/New';
import type { ComposedRegUnitSelectorProps } from './RegUnitSelector.types';

const OrgUnitFieldImplicitRootsFilterHandlerHOC =
    withOrgUnitFieldImplicitRootsFilterHandler()(SingleOrgUnitSelectField);

class OrgUnitFieldWrapper extends React.Component<ComposedRegUnitSelectorProps> {
    render() {
        const { onUpdateSelectedOrgUnit, ...passOnProps } = this.props;
        return (
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
    withDefaultFieldContainer()(
        withLabel({
            onGetUseVerticalOrientation: (props: Record<string, any>) => props.formHorizontal,
            onGetCustomFieldLabeClass: (props: Record<string, any>) =>
                props.labelClass,
        })(
            withFilterProps((props: Record<string, any>) => {
                const { labelClass, ...passOnProps } = props;
                return passOnProps;
            })(
                withInternalChangeHandler()(
                    OrgUnitFieldWrapper,
                ),
            ),
        ),
    ) as any;
