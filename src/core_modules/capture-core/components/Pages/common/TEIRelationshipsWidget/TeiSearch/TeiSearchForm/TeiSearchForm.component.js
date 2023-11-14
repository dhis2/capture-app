// @flow
import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { errorCreator } from 'capture-core-utils';
import { Button } from '@dhis2/ui';
import { D2Form } from '../../../../../D2Form';
import { SearchOrgUnitSelector } from '../SearchOrgUnitSelector/SearchOrgUnitSelector.container';
import type { SearchGroup } from '../../../../../../metaData';
import { withGotoInterface } from '../../../../../FormFields/New';

const TeiSearchOrgUnitSelector = withGotoInterface()(SearchOrgUnitSelector);

const getStyles = (theme: Theme) => ({
    orgUnitSection: {
        backgroundColor: 'white',
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(892),
    },
    searchButtonContainer: {
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
    },
    minAttributesRequired: {
        flexGrow: 1,
        textAlign: 'right',
        fontSize: theme.typography.pxToRem(14),
    },
    minAttribtuesRequiredInvalid: {
        color: theme.palette.error.main,
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
    attributesWithValuesCount: number,
    classes: {
        container: string,
        searchButtonContainer: string,
        orgUnitSection: string,
        minAttributesRequired: string,
        minAttribtuesRequiredInvalid: string,
    },
};

class SearchFormPlain extends React.Component<Props> {
    formInstance: any;
    orgUnitSelectorInstance: SearchOrgUnitSelector;

    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        SEARCH_FORM_MISSING: 'search form is missing. see log for details',
    };

    validNumberOfAttributes = () => {
        const attributesWithValuesCount = this.props.attributesWithValuesCount;
        const minAttributesRequiredToSearch = this.props.searchGroup.minAttributesRequiredToSearch;
        return attributesWithValuesCount >= minAttributesRequiredToSearch;
    }

    validateForm() {
        if (!this.formInstance) {
            log.error(
                errorCreator(
                    SearchFormPlain.errorMessages.SEARCH_FORM_MISSING)({ Search: this }),
            );
            return {
                error: true,
                isValid: false,
            };
        }

        let isValid = this.formInstance.validateFormScrollToFirstFailedField({});

        // $FlowFixMe[prop-missing] automated comment
        if (isValid && !this.props.searchGroup.unique) isValid = this.orgUnitSelectorInstance.validateAndScrollToIfFailed();

        if (isValid && !this.props.searchGroup.unique) isValid = this.validNumberOfAttributes();

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
        return `Search ${attributeName}`;
    }

    renderOrgUnitSelector = () => (
        <TeiSearchOrgUnitSelector
            innerRef={(instance) => {
                this.orgUnitSelectorInstance = instance;
            }}
            searchId={this.props.searchId}
            searchAttempted={this.props.searchAttempted}
        />
    );

    renderMinAttributesRequired = () => {
        const { classes, searchAttempted, searchGroup } = this.props;
        const displayInvalidNumberOfAttributes = searchAttempted && !this.validNumberOfAttributes();
        const minAttributesRequiredClass = classNames(
            classes.minAttributesRequired, {
                [classes.minAttribtuesRequiredInvalid]: displayInvalidNumberOfAttributes,
            },
        );

        return (
            <div className={minAttributesRequiredClass}>
                {
                    i18n.t('Fill in at least {{count}} attribute to search', {
                        count: searchGroup.minAttributesRequiredToSearch,
                        defaultValue: 'Fill in at least {{count}} attribute to search',
                        defaultValue_plural: 'Fill in at least {{count}} attributes to search',
                    })
                }
            </div>
        );
    }

    render() {
        const { searchGroup, classes, id } = this.props;

        const searchForm = searchGroup && searchGroup.searchForm;

        if (!searchForm) {
            return (
                <div>
                    {SearchFormPlain.errorMessages.SEARCH_FORM_MISSING}
                </div>
            );
        }
        const searchButtonText = searchGroup.unique ? this.getUniqueSearchButtonText(searchForm) : i18n.t('Search by attributes');
        return (
            <div
                data-test="d2-form-area"
                className={classes.container}
            >
                <D2Form
                    formRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={searchGroup.searchForm}
                    id={id}
                />
                {!searchGroup.unique && this.renderOrgUnitSelector()}
                <div
                    className={classes.searchButtonContainer}
                >
                    <Button
                        dataTest={`relationship-tei-search-button-${id}`}
                        onClick={this.handleSearchAttempt}
                    >
                        {searchButtonText}
                    </Button>
                    {!searchGroup.unique && this.renderMinAttributesRequired()}
                </div>
            </div>
        );
    }
}

export const TeiSearchFormComponent = withStyles(getStyles)(SearchFormPlain);
