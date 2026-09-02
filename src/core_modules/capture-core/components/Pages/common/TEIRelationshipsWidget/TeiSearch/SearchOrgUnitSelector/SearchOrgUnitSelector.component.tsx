import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import {
    SelectionBoxes,
    withDefaultFieldContainer,
    withLabel,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    SingleOrgUnitSelectField,
} from '../../../../../FormFields/New';
import { customTerms } from '../../../../../../utils/customTerms';

const TeiSearchOrgUnitField = withFocusSaver()(
    withCalculateMessages()(
        withDefaultFieldContainer()(
            withLabel()(
                withDisplayMessages()(SingleOrgUnitSelectField),
            ),
        ),
    ),
);
const TeiSearchSelectionBoxes = withDefaultFieldContainer()(withLabel()(SelectionBoxes));

type Props = {
    searchId: string;
    selectedOrgUnit?: any;
    selectedOrgUnitScope?: string;
    treeRoots?: Array<any> | null;
    treeReady?: boolean;
    treeKey?: string;
    treeSearchText?: string;
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => void;
    onSetOrgUnit: (searchId: string, orgUnit?: Record<string, unknown>) => void;
    onFilterOrgUnits: (searchId: string, searchText: string) => void;
    searchAttempted?: boolean;
    orgUnitLabel: string;
};

const orgUnitFieldStyles = {
    labelContainerStyle: {
        paddingTop: 12,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const selectionBoxesStyles = {
    labelContainerStyle: {
        paddingTop: 13,
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const options = [
    {
        name: i18n.t('All accessible'),
        value: 'ACCESSIBLE',
    },
    {
        name: i18n.t('Selected'),
        value: 'SELECTED',
    },
];

export class SearchOrgUnitSelector extends React.Component<Props> {
    gotoInstance: any;
    onSelectOrgUnitScope = (value: any) => {
        if (value) {
            this.props.onSelectOrgUnitScope(this.props.searchId, value);
        }
    }
    onSetOrgUnit = (orgUnit?: Record<string, unknown>) => {
        this.props.onSetOrgUnit(this.props.searchId, orgUnit);
    }

    getErrorMessage = () => {
        if (!this.isValid() && this.props.searchAttempted) {
            return customTerms.i18n.t('Please select an {{orgUnitLabel}}.', { orgUnitLabel: this.props.orgUnitLabel });
        }
        return null;
    }

    isValid = () => this.props.selectedOrgUnitScope === 'ACCESSIBLE' || this.props.selectedOrgUnit

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validateAndScrollToIfFailed() {
        const isValid = this.isValid();
        if (!isValid) {
            this.goto();
        }

        return isValid;
    }

    goto() {
        if (this.gotoInstance) {
            this.gotoInstance.scrollIntoView();

            const scrolledY = window.scrollY;
            if (scrolledY) {
                window.scroll(0, scrolledY - 48);
            }
        }
    }

    handleFilterOrgUnits = (searchText?: string) => {
        this.props.onFilterOrgUnits(this.props.searchId, searchText || '');
    }

    renderOrgUnitScopeSelector = () => {
        const { selectedOrgUnitScope, orgUnitLabel } = this.props;
        return (
            <TeiSearchSelectionBoxes
                options={options}
                label={customTerms.i18n.t('{{orgUnitLabel}} scope', { orgUnitLabel })}
                styles={selectionBoxesStyles}
                onSelect={this.onSelectOrgUnitScope}
                value={selectedOrgUnitScope}
            />
        );
    }

    renderOrgUnitField = () => {
        const { selectedOrgUnit, treeRoots, treeReady, treeKey, treeSearchText, orgUnitLabel } = this.props;
        return (
            <TeiSearchOrgUnitField
                label={capitalizeFirstLetter(orgUnitLabel)}
                styles={orgUnitFieldStyles}
                searchText={treeSearchText}
                roots={treeRoots}
                ready={treeReady}
                treeKey={treeKey}
                onBlur={this.onSetOrgUnit}
                value={selectedOrgUnit}
                validationAttempted={this.props.searchAttempted}
                errorMessage={this.getErrorMessage()}
                onSearch={this.handleFilterOrgUnits}
                autoSelectSingleOrgUnit={false}
            />
        );
    }

    render() {
        const { selectedOrgUnitScope } = this.props;
        return (
            <div
                ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
            >
                {this.renderOrgUnitScopeSelector()}
                {selectedOrgUnitScope !== 'ACCESSIBLE' && this.renderOrgUnitField()}
            </div>
        );
    }
}
