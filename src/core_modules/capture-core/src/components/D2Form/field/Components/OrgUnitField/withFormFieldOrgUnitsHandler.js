// @flow
import { connect } from 'react-redux';
import * as React from 'react';
import {
    get as getOrgUnitRoots,
    set as setOrgUnitRoots,
} from '../../../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import {
    requestFilterFormFieldOrgUnits,
    resetFormFieldOrgUnitsFilter,
} from './orgUnitFieldForForms.actions';
import getOrgUnitRootsKey from './getOrgUnitRootsKey';

type Props = {
    formId: string,
    elementId: string,
    filterOrgUnits: (formId: string, elementId: string, searchText: string) => void,
    resetOrgUnits: (formId: string, elementId: string) => void,
}

const getFormFieldOrgUnitsHandler = (InnerComponent: React.ComponentType<any>) =>
    class FormFieldOrgUnitsHandlerHOC extends React.Component<Props> {
        componentWillUnmount() {
            const { formId, elementId } = this.props;
            setOrgUnitRoots(getOrgUnitRootsKey(formId, elementId), null);
        }

        handleFilterOrgUnits = (searchText: string) => {
            if (searchText) {
                this.props.filterOrgUnits(this.props.formId, this.props.elementId, searchText);
            } else {
                this.props.resetOrgUnits(this.props.formId, this.props.elementId);
            }
        }

        render() {
            const { formId, elementId, filterOrgUnits, resetOrgUnits, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    onSearch={this.handleFilterOrgUnits}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { formId: string, elementId: string }) => {
    const orgUnitRootsKey = getOrgUnitRootsKey(props.formId, props.elementId);
    const formFieldMisc = state.formsFieldsMisc[props.formId][props.elementId] || {};
    const roots = getOrgUnitRoots(orgUnitRootsKey) || getOrgUnitRoots('searchRoots');
    const a = {
        searchText: formFieldMisc.orgUnitsSearchText,
        ready: !formFieldMisc.orgUnitsLoading,
        treeKey: formFieldMisc.orgUnitsSearchText || 'initial',
        roots,
    };
    return a;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    filterOrgUnits: (formId: string, elementId: string, searchText: string) => {
        dispatch(requestFilterFormFieldOrgUnits(formId, elementId, searchText));
    },
    resetOrgUnits: (formId: string, elementId: string) => {
        dispatch(resetFormFieldOrgUnitsFilter(formId, elementId));
    },
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps)(getFormFieldOrgUnitsHandler(InnerComponent));
