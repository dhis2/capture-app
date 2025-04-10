import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
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

type PropsWithoutClasses = {
    searchId: string;
    selectedOrgUnit?: any | null;
    selectedOrgUnitScope?: string | null;
    treeRoots: any[] | null;
    treeReady: boolean | null;
    treeKey: string | null;
    treeSearchText?: string | null;
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => void;
    onSetOrgUnit: (searchId: string, orgUnit: Record<string, unknown> | null) => void;
    onFilterOrgUnits: (searchId: string, searchText: string | null) => void;
    searchAttempted?: boolean;
};

const styles = createStyles({});

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

class SearchOrgUnitSelectorPlain extends React.Component<PropsWithoutClasses & WithStyles<typeof styles>> {
    onSelectOrgUnitScope = (value: any) => {
        if (value) {
            this.props.onSelectOrgUnitScope(this.props.searchId, value);
        }
    }

    onSetOrgUnit = (orgUnit: Record<string, unknown> | null) => {
        this.props.onSetOrgUnit(this.props.searchId, orgUnit);
    }

    getErrorMessage = () => {
        if (!this.isValid() && this.props.searchAttempted) {
            return i18n.t(errorMessage);
        }
        return null;
    }

    gotoInstance: any;

    isValid = () => this.props.selectedOrgUnitScope === 'ACCESSIBLE' || this.props.selectedOrgUnit

    handleFilterOrgUnits = (searchText: string | null) => {
        this.props.onFilterOrgUnits(this.props.searchId, searchText);
    }

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

export const SearchOrgUnitSelector = withStyles(styles)(SearchOrgUnitSelectorPlain);
