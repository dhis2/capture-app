// @flow

import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import errorCreator from '../../../utils/errorCreator';
import Button from '../../Buttons/Button.component';
import Form, { D2Form } from '../../D2Form/D2Form.component';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

const getStyles = theme => ({

});

type Props = {
    id: string,
    itemId: string,
    onSearch: (formId: string, itemId: string) => void,
    searchForm: RenderFoundation,
    classes: {
        container: string,
        searchButtonContainer: string,
    },
};

class SearchForm extends React.Component<Props> {
    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        SEARCH_FORM_MISSING: 'search form is missing. see log for details',
    };
    formInstance: D2Form;

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

        const isValid = this.formInstance.validateFormScrollToFirstFailedField({});

        return {
            isValid,
            error: false,
        };
    }

    handleSearchAttempt = () => {
        const { error: validateFormError, isValid: isFormValid } = this.validateForm();
        if (validateFormError || !isFormValid) {
            return;
        }
        this.props.onSearch(this.props.id, this.props.itemId);
    }

    render() {
        const {
            searchForm,
            classes,
            itemId,
            onSearch,
            ...passOnProps } = this.props;

        if (!searchForm) {
            return (
                <div>
                    {SearchForm.errorMessages.SEARCH_FORM_MISSING}
                </div>
            );
        }
        return (
            <div className={classes.container}>
                <Form
                    innerRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={searchForm}
                    {...passOnProps}
                />
                <div
                    className={classes.searchButtonContainer}
                >
                    <Button onClick={this.handleSearchAttempt}>
                        {i18n.t('Search')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(SearchForm);
