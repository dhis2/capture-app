// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Category as CategoryMetadata } from '../../../metaData';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';

const VirtualizedSelectLoadingIndicatorHOC =
    withLoadingIndicator(null, null, (props: Object) => props.options)(VirtualizedSelect);

type Props = {
    category: CategoryMetadata,
    selectedOrgUnitId: ?string,
};

type CategoryOption = {
    id: string,
    name: string,
    organisationUnitIds: ?Object,
};

type SelectOption = {
    label: string,
    value: string,
};

type State = {
    options: ?Array<SelectOption>,
};

class CategorySelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            options: null,
        };

        buildCategoryOptionsAsync(this.props.category)
            .then((categoryOptions) => {
                const options = this.getSelectOptions(categoryOptions);
                this.setState({
                    options,
                });
            });
    }

    getSelectOptions(categoryOptions: Array<CategoryOption>): Array<SelectOption> {
        const { selectedOrgUnitId } = this.props;

        const ouFilteredCategoryOptions = !selectedOrgUnitId ?
            categoryOptions :
            categoryOptions
                .filter(option =>
                    !option.organisationUnitIds || option.organisationUnitIds[selectedOrgUnitId]);

        return ouFilteredCategoryOptions
            .map(option => ({
                label: option.name,
                value: option.id,
            }));
    }

    render() {
        const { ...passOnProps } = this.props;
        return (
            <VirtualizedSelectLoadingIndicatorHOC
                options={this.state.options}
                value={''}
                placeholder={i18n.t('Select')}
                {...passOnProps}
            />
        );
    }
}

export default CategorySelector;

