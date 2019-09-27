// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Category as CategoryMetadata } from '../../../metaData';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import { makeOptionsSelector, makeOnSelectSelector } from './categorySelector.selectors';
import { getApi } from '../../../d2/d2Instance';

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
    options: ?Array<SelectOption>,
};

class CategorySelector extends React.Component<Props, State> {
    static getOptionsAsync(categoryId: string, selectedOrgUnitId: ?string) {
        const predicate = (categoryOption: Object) => {
            const orgUnits = categoryOption.organisationUnits;
            if (!orgUnits) {
                return true;
            }
            return !!orgUnits[selectedOrgUnitId];
        };

        const project = (categoryOption: Object) => ({
            label: categoryOption.displayName,
            value: categoryOption.id,
        });

        return buildCategoryOptionsAsync(categoryId, predicate, project);
    }

    optionsSelector: Function;
    onSelectSelector: Function;
    constructor(props: Props) {
        super(props);
        this.state = {
            options: null,
        };

        this.optionsSelector = makeOptionsSelector();
        this.onSelectSelector = makeOnSelectSelector();

        const { category, selectedOrgUnitId } = this.props;

        CategorySelector
            .getOptionsAsync(category.id, selectedOrgUnitId)
            .then((options) => {
                this.setState({
                    options,
                });
            });
    }

    componentWillUnmount() {
    }

    render() {
        const { selectedOrgUnitId, onSelect, ...passOnProps } = this.props;
        const { options } = this.state;
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
