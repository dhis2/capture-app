import * as React from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import {
    withDefaultFieldContainer,
    withLabel,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
} from '../../../../../FormFields/New';

type Props = {
    onUpdateSelectedOrgUnit: (orgUnit?: OrgUnit | null) => void;
};

class OrgUnitFieldWrapper extends React.Component<Props> {
    render() {
        const { onUpdateSelectedOrgUnit, ...passOnProps } = this.props;
        return (
            <SingleOrgUnitSelectField
                onBlur={onUpdateSelectedOrgUnit}
                maxTreeHeight={200}
                {...passOnProps as any}
            />
        );
    }
}

export const ComposedRegUnitSelector =
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
    );
