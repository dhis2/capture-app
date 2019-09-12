// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Category as CategoryMetadata } from '../../../metaData';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import { makeOptionsSelector, makeOnSelectSelector } from './categorySelector.selectors';

const VirtualizedSelectLoadingIndicatorHOC =
    withLoadingIndicator(null, null, (props: Object) => props.options)(VirtualizedSelect);

type Props = {
    category: CategoryMetadata,
    selectedOrgUnitId: ?string,
    onSelect: (option) => void,
};

type CategoryOption = {
    id: string,
    displayName: string,
    organisationUnitIds: ?Object,
};

type SelectOption = {
    label: string,
    value: string,
};

type State = {
    categoryOptions: ?Array<CategoryOption>,
};

class CategorySelector extends React.Component<Props, State> {
    optionsSelector: Function;
    onSelectSelector: Function;
    constructor(props: Props) {
        super(props);
        this.state = {
            categoryOptions: null,
        };

        this.optionsSelector = makeOptionsSelector();
        this.onSelectSelector = makeOnSelectSelector();

        buildCategoryOptionsAsync(this.props.category)
            .then((categoryOptions) => {
                this.setState({
                    categoryOptions,
                });
            });
    }

    componentWillUnmount() {
        this.setState({
            categoryOptions: null,
        });
        this.optionsSelector({ selectedOrgUnitId: null, categoryOptions: [] });
    }

    render() {
        const { selectedOrgUnitId, onSelect, ...passOnProps } = this.props;
        const { categoryOptions } = this.state;
        const options = categoryOptions && this.optionsSelector({ selectedOrgUnitId, categoryOptions });
        const handleSelect = this.onSelectSelector({ options, onSelect });

        return (
            <VirtualizedSelectLoadingIndicatorHOC
                options={options}
                value={''}
                placeholder={i18n.t('Select')}
                {...passOnProps}
                onSelect={handleSelect}
            />
        );
    }
}

export default CategorySelector;
