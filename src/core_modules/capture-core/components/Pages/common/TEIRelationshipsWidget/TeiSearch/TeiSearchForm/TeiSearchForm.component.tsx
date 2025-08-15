import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { errorCreator } from 'capture-core-utils';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import { D2Form } from '../../../../../D2Form';
import { SearchOrgUnitSelector } from '../SearchOrgUnitSelector/SearchOrgUnitSelector.container';
import type { Props, State } from './TeiSearchForm.types';
import { getStyles } from './TeiSearchForm.types';

class SearchFormPlain extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMissingSearchCriteriaModal: false,
        };
    }

    getUniqueSearchButtonText = (searchForm) => {
        const attributeName = searchForm.getElements()[0].formName;
        return `${i18n.t('Search')} ${attributeName}`;
    }

    handleSearchAttempt = () => {
        const { error: validateFormError, isValid: isFormValid } = this.validateForm();
        if (validateFormError || !isFormValid) {
            this.props.onSearchValidationFailed(this.props.id, this.props.searchGroupId);
            return;
        }
        this.props.onSearch(this.props.id, this.props.searchGroupId);
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


        if (isValid && !this.props.searchGroup.unique) isValid = this.validNumberOfAttributes();

        if (isValid && this.props.searchGroup.unique) {
            isValid = this.isSearchViaUniqueIdValid();
            this.setState({ showMissingSearchCriteriaModal: !isValid });
        }

        return {
            isValid,
            error: false,
        };
    }

    validNumberOfAttributes = () => {
        const attributesWithValuesCount = this.props.attributesWithValuesCount;
        const minAttributesRequiredToSearch = this.props.searchGroup.minAttributesRequiredToSearch;
        return attributesWithValuesCount >= minAttributesRequiredToSearch;
    }

    isSearchViaUniqueIdValid = () => {
        const searchTerms = this.props.formsValues;
        return Object.values(searchTerms).some(value => value !== undefined && value !== '');
    }

    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        SEARCH_FORM_MISSING: 'search form is missing. see log for details',
    };

    formInstance: any;
    orgUnitSelectorInstance: any;

    renderOrgUnitSelector = () => (
        <div className={this.props.classes.orgUnitSection}>
            <SearchOrgUnitSelector
                searchId={this.props.searchId}
            />
        </div>
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

    renderMissingSearchCriteriaModal = () => {
        const { searchGroup } = this.props;
        const { showMissingSearchCriteriaModal } = this.state;

        if (!searchGroup.unique || !showMissingSearchCriteriaModal) {
            return null;
        }
        const uniqueTEAName = searchGroup.searchForm.getElements()[0].formName;

        return (
            <Modal position="middle" onClose={() => this.setState({ showMissingSearchCriteriaModal: false })}>
                <ModalTitle>{i18n.t('Missing search criteria')}</ModalTitle>
                <ModalContent>{i18n.t(`Please fill in ${uniqueTEAName} to search`)}</ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={() => this.setState({ showMissingSearchCriteriaModal: false })} primary>
                            {i18n.t('Back to search')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
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
                {this.renderMissingSearchCriteriaModal()}
            </div>
        );
    }
}

export const TeiSearchFormComponent = withStyles(getStyles)(SearchFormPlain);
