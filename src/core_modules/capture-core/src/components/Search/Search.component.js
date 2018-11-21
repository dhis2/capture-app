// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Button from '../Buttons/Button.component';
import Form from '../D2Form/D2Form.component';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import Section from '../Section/Section.component';
import SectionHeaderSimple from '../Section/SectionHeaderSimple.component';

const styles = theme => ({
});

type Props = {
    searchForm: RenderFoundation,
};

class Search extends React.Component<Props> {
    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        SEARCH_FORM_MISSING: 'search form is missing. see log for details',
    };

    formInstance: ?Form;

    getWrappedInstance() {
        return this.formInstance;
    }

    handleUpdateField = (...args) => {
        // this.props.onUpdateFieldInner(...args, this.props.id, this.props.itemId, this.props.onUpdateFormField);
    }

    handleUpdateFieldAsync = (...args) => {
        // this.props.onUpdateFormFieldAsync(...args, this.props.id, this.props.itemId);
    }
    handleSearch = () => {

    }

    render() {
        const {
            searchForm,
            classes,
            ...passOnProps } = this.props;

        if (!searchForm) {
            return (
                <div>
                    {Search.errorMessages.SEARCH_FORM_MISSING}
                </div>
            );
        }
        return (
            <div className={classes.container}>
                <Form
                    innerRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={searchForm}
                    // validationAttempted={searchAttempted}
                    onUpdateField={this.handleUpdateField}
                    onUpdateFieldAsync={this.handleUpdateFieldAsync}
                    isSearchForm
                    {...passOnProps}
                />
                <div
                    className={classes.searchButtonContainer}
                >
                    <Button onClick={this.handleSearch}>
                        {i18n.t('Search')}
                    </Button>
                </div>
            </div>
        );
    }
}

const StylesHOC = withStyles(styles)(Search);

type ContainerProps = {

};

class SearchContainer extends React.Component<ContainerProps> {
    searchInstance: Search;

    getWrappedInstance() {
        return this.searchInstance;
    }

    render() {
        return (
            <StylesHOC
                innerRef={(searchInstance) => {
                    this.searchInstance = searchInstance;
                }}
                {...this.props}
            />
        );
    }
}

export default SearchContainer;
