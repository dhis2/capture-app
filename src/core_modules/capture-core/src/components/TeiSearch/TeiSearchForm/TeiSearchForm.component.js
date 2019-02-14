// @flow

import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import errorCreator from '../../../utils/errorCreator';
import Button from '../../Buttons/Button.component';
import Form from '../../D2Form/D2Form.component';
import SearchOrgUnitSelector from '../SearchOrgUnitSelector/SearchOrgUnitSelector.container';
import { Section } from '../../Section';
import { SearchGroup } from '../../../metaData';
import { withGotoInterface } from '../../FormFields/New';

const TeiSearchOrgUnitSelector = withGotoInterface()(SearchOrgUnitSelector);

const getStyles = (theme: Theme) => ({
    orgUnitSection: {
        backgroundColor: 'white',
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(880),
    },
});

type Props = {
    id: string,
    searchGroupId: string,
    onSearch: (formId: string, searchGroupId: string) => void,
    onSearchValidationFailed: (formId: string, SearchGroupId: string) => void,
    searchAttempted: boolean,
    searchId: string,
    searchGroup: SearchGroup,
    classes: {
        container: string,
        searchButtonContainer: string,
        orgUnitSection: string,
    },
};

class SearchForm extends React.Component<Props> {
    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        SEARCH_FORM_MISSING: 'search form is missing. see log for details',
    };
    formInstance: any;
    orgUnitSelectorInstance: SearchOrgUnitSelector;

    validateForm() {
        if (!this.formInstance) {
            log.error(
                errorCreator(
                    SearchForm.errorMessages.SEARCH_FORM_MISSING)({ Search: this }),
            );
            return {
                error: true,
                isValid: false,
            };
        }

        let isValid = this.formInstance.validateFormScrollToFirstFailedField({});

        if (isValid && !this.props.searchGroup.unique) isValid = this.orgUnitSelectorInstance.validateAndScrollToIfFailed();

        return {
            isValid,
            error: false,
        };
    }

    handleSearchAttempt = () => {
        const { error: validateFormError, isValid: isFormValid } = this.validateForm();
        if (validateFormError || !isFormValid) {
            this.props.onSearchValidationFailed(this.props.id, this.props.searchGroupId);
            return;
        }
        this.props.onSearch(this.props.id, this.props.searchGroupId);
    }

    getUniqueSearchButtonText = (searchForm) => {
        const attributeName = searchForm.getElements()[0].formName;
        return `Search for ${attributeName}`;
    }

    renderOrgUnitSelector = () => (
        <Section className={this.props.classes.orgUnitSection}>
            <TeiSearchOrgUnitSelector
                innerRef={(instance) => { this.orgUnitSelectorInstance = instance; }}
                searchId={this.props.searchId}
                searchAttempted={this.props.searchAttempted}
            />
        </Section>
    );

    render() {
        const {
            searchGroup,
            classes,
            searchGroupId,
            onSearch,
            searchId,
            onSearchValidationFailed,
            searchAttempted,
            ...passOnProps } = this.props;

        const searchForm = searchGroup && searchGroup.searchForm;

        if (!searchForm) {
            return (
                <div>
                    {SearchForm.errorMessages.SEARCH_FORM_MISSING}
                </div>
            );
        }
        const searchButtonText = searchGroup.unique ? this.getUniqueSearchButtonText(searchForm) : i18n.t('Search attributes');
        return (
            <div className={classes.container}>
                <Form
                    innerRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={searchGroup.searchForm}
                    {...passOnProps}
                />
                {!searchGroup.unique && this.renderOrgUnitSelector()}
                <div
                    className={classes.searchButtonContainer}
                >
                    <Button onClick={this.handleSearchAttempt}>
                        {searchButtonText}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(SearchForm);
