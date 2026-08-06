import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    SelectionBoxes,
    withDefaultFieldContainer,
    withLabel,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    SingleOrgUnitSelectField,
} from '../../FormFields/New';
import type { SearchOrgUnitSelectorProps } from './SearchOrgUnitSelector.types';

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

export class SearchOrgUnitSelector extends React.Component<SearchOrgUnitSelectorProps> {
    gotoInstance: any;

    onSelectOrgUnitScope = (value: any) => {
        if (value) {
            this.props.onSelectOrgUnitScope(this.props.searchId, value);
        }
    }
    onSetOrgUnit = (orgUnit?: any) => {
        this.props.onSetOrgUnit(this.props.searchId, orgUnit);
    }
    renderOrgUnitScopeSelector = () => {
        const { selectedOrgUnitScope, orgUnitLabel } = this.props;
        const orgUnit = orgUnitLabel ?? i18n.t('Organisation unit');
        return (
            <TeiSearchSelectionBoxes
                options={options}
                label={i18n.t('{{orgUnit}} scope', { orgUnit, interpolation: { escapeValue: false } })}
                styles={selectionBoxesStyles}
                onSelect={this.onSelectOrgUnitScope}
                value={selectedOrgUnitScope}
            />
        );
    }

    isValid = () => this.props.selectedOrgUnitScope === 'ACCESSIBLE' || this.props.selectedOrgUnit

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

    getErrorMessage = () => {
        if (!this.isValid() && this.props.searchAttempted) {
            const orgUnit = this.props.orgUnitLabel ?? i18n.t('organisation unit');
            return i18n.t('Please select an {{orgUnit}}.', {
                orgUnit,
                interpolation: { escapeValue: false },
            });
        }
        return null;
    }

    handleFilterOrgUnits = (searchText?: string) => {
        this.props.onFilterOrgUnits(this.props.searchId, searchText);
    }

    renderOrgUnitField = () => {
        const { selectedOrgUnit, treeRoots, treeReady, treeKey, treeSearchText, orgUnitLabel } = this.props;
        return (
            <TeiSearchOrgUnitField
                label={orgUnitLabel ?? i18n.t('Organisation unit')}
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
