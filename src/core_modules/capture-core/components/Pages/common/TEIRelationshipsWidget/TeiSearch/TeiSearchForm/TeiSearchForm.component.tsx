import * as React from 'react';
import log from 'loglevel';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { Button, Modal, ModalTitle, ModalContent, ModalActions, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { D2Form } from '../../../../../D2Form';
import { SearchOrgUnitSelector } from '../SearchOrgUnitSelector/SearchOrgUnitSelector.container';
import type { SearchGroup } from '../../../../../../metaData';

const TeiSearchOrgUnitSelector = SearchOrgUnitSelector;

const styles: any = (theme: Theme) => ({
    orgUnitSection: {
        backgroundColor: 'white',
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(892),
    },
    searchButtonContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth: theme.typography.pxToRem(892),
    },
    searchButton: {
        marginRight: theme.typography.pxToRem(8),
    },
    clearButton: {
        marginRight: theme.typography.pxToRem(8),
    },
    title: {
        padding: `${theme.typography.pxToRem(16)} 0 ${theme.typography.pxToRem(8)} 0`,
        fontWeight: 500,
        color: colors.grey900,
    },
});

type State = {
    showMissingSearchCriteriaModal: boolean;
};

type OwnProps = {
    id: string;
    searchGroupId: string;
    onSearch: (formId: string, searchGroupId: string) => void;
    onSearchValidationFailed: (formId: string, SearchGroupId: string) => void;
    searchAttempted: boolean;
    searchId: string;
    searchGroup: SearchGroup;
    attributesWithValuesCount: number;
};

type Props = OwnProps & WithStyles<any>;

class SearchFormPlain extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { showMissingSearchCriteriaModal: false };
    }

    formInstance?: any;

    validateForm = () => {
        let isFormValid = true;

        if (this.formInstance) {
            isFormValid = this.formInstance.validateFormScrollToFirstFailedField({ isScrollToTop: false }) && isFormValid;
        }
        return isFormValid;
    }

    handleSearch = () => {
        const isFormValid = this.validateForm();
        if (isFormValid) {
            const { attributesWithValuesCount } = this.props;
            if (attributesWithValuesCount > 0) {
                this.props.onSearch(this.props.id, this.props.searchGroupId);
            } else {
                this.setState({ showMissingSearchCriteriaModal: true });
            }
        } else {
            this.props.onSearchValidationFailed(this.props.id, this.props.searchGroupId);
        }
    }

    handleSearchWithoutCriteria = () => {
        this.setState({ showMissingSearchCriteriaModal: false });
        this.props.onSearch(this.props.id, this.props.searchGroupId);
    }

    handleCancelSearchWithoutCriteria = () => {
        this.setState({ showMissingSearchCriteriaModal: false });
    }

    handleClearSearch = () => {
        if (this.formInstance) {
            this.formInstance.resetFormValues();
        }
    }

    renderForm = () => {
        const { searchGroup } = this.props;
        if (!searchGroup) {
            log.error(`Could not find searchGroup: ${this.props.searchGroupId}`);
            return null;
        }

        return (
            <D2Form
                formRef={(formInstance) => { this.formInstance = formInstance; }}
                formFoundation={searchGroup.searchForm}
                id={this.props.id}
                validationAttempted={this.props.searchAttempted}
            />
        );
    }

    renderOrgUnitSelector = () => (
        <TeiSearchOrgUnitSelector
            searchId={this.props.searchId}
        />
    )

    renderMissingSearchCriteriaModal = () => (
        <Modal hide={!this.state.showMissingSearchCriteriaModal} onClose={this.handleCancelSearchWithoutCriteria}>
            <ModalTitle>
                {i18n.t('Search without criteria')}
            </ModalTitle>
            <ModalContent>
                {i18n.t('You are about to search without any criteria. This may return a lot of results. Are you sure you want to continue?')}
            </ModalContent>
            <ModalActions>
                <Button
                    onClick={this.handleCancelSearchWithoutCriteria}
                    secondary
                >
                    {i18n.t('Cancel')}
                </Button>
                <Button
                    onClick={this.handleSearchWithoutCriteria}
                    primary
                >
                    {i18n.t('Yes, search without criteria')}
                </Button>
            </ModalActions>
        </Modal>
    )

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.title}>
                    {i18n.t('Search for a {{trackedEntityTypeName}}', {
                        trackedEntityTypeName: (this.props.searchGroup.trackedEntityType && this.props.searchGroup.trackedEntityType.name) || '',
                        interpolation: { escapeValue: false },
                    })}
                </div>
                <div className={classes.orgUnitSection}>
                    {this.renderOrgUnitSelector()}
                </div>
                <div className={classes.container}>
                    {this.renderForm()}
                </div>
                <div className={classes.searchButtonContainer}>
                    <Button
                        className={classes.searchButton}
                        onClick={this.handleSearch}
                        primary
                        small
                    >
                        {i18n.t('Search')}
                    </Button>
                    <Button
                        className={classes.clearButton}
                        onClick={this.handleClearSearch}
                        secondary
                        small
                    >
                        {i18n.t('Clear search')}
                    </Button>
                </div>
                {this.renderMissingSearchCriteriaModal()}
            </div>
        );
    }
}

export const TeiSearchFormComponent = withStyles(styles)(SearchFormPlain);
