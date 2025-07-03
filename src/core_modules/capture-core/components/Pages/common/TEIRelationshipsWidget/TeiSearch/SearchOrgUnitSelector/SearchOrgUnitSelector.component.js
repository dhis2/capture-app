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
} from '../../../../../FormFields/New';

const TeiSearchOrgUnitField = withFocusSaver()(withCalculateMessages()(withDefaultFieldContainer()(withLabel()(withDisplayMessages()(SingleOrgUnitSelectField)))));
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
        name: 'All accessible',
        value: 'ACCESSIBLE',
    },
    {
        name: 'Selected',
        value: 'SELECTED',
    },
];

const errorMessage = 'Please select an organisation unit';

export class SearchOrgUnitSelector extends React.Component {
    onSelectOrgUnitScope = (value) => {
        if (value) {
            this.props.onSelectOrgUnitScope(this.props.searchId, value);
        }
    }
    onSetOrgUnit = (orgUnit) => {
        this.props.onSetOrgUnit(this.props.searchId, orgUnit);
    }
    renderOrgUnitScopeSelector = () => {
        const { selectedOrgUnitScope } = this.props;
        return (
            <TeiSearchSelectionBoxes
                options={options}
                label="Organisation unit scope"
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
                // TODO: Set the modifier some other way (caused be the fixed header)
                window.scroll(0, scrolledY - 48);
            }
        }
    }

    getErrorMessage = () => {
        if (!this.isValid() && this.props.searchAttempted) {
            return i18n.t(errorMessage);
        }
        return null;
    }

    handleFilterOrgUnits = (searchText) => {
        this.props.onFilterOrgUnits(this.props.searchId, searchText);
    }

    renderOrgUnitField = () => {
        const { selectedOrgUnit, treeRoots, treeReady, treeKey, treeSearchText } = this.props;
        return (
            <TeiSearchOrgUnitField
                label="Organisation unit"
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
