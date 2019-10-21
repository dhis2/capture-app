// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { Category as CategoryMetadata } from '../../../metaData';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import { makeOnSelectSelector } from './categorySelector.selectors';

const VirtualizedSelectLoadingIndicatorHOC =
    withLoadingIndicator(
        () => ({ marginTop: 5, paddingTop: 3 }),
        () => ({ size: 22 }),
        (props: Object) => props.options)(VirtualizedSelect);

type SelectOption = {
    label: string,
    value: string,
};

type Props = {
    category: CategoryMetadata,
    selectedOrgUnitId: ?string,
    onSelect: (option: SelectOption) => void,
};

type State = {
    options: ?Array<SelectOption>,
    prevOrgUnitId: ?string,
};

class CategorySelector extends React.Component<Props, State> {
    static getOptionsAsync(
        categoryId: string,
        selectedOrgUnitId: ?string,
        onIsAborted: Function,
    ) {
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

        const isRequestAborted = () => onIsAborted(selectedOrgUnitId);

        return buildCategoryOptionsAsync(
            categoryId,
            { predicate, project, onIsAborted: isRequestAborted },
        );
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.selectedOrgUnitId !== state.prevOrgUnitId) {
            return {
                prevOrgUnitId: props.selectedOrgUnitId,
                options: null,
            };
        }
        return null;
    }

    onSelectSelector: Function;
    unmounted: ?boolean;
    constructor(props: Props) {
        super(props);
        this.state = {
            options: null,
            prevOrgUnitId: null,
        };
        this.onSelectSelector = makeOnSelectSelector();
        this.loadCagoryOptions(this.props);
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.state.options && prevProps.selectedOrgUnitId !== this.props.selectedOrgUnitId) {
            this.loadCagoryOptions(this.props);
        }
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    isLoadAborted = (organisationUnitId: ?string) =>
        (this.props.selectedOrgUnitId !== organisationUnitId || this.unmounted);

    loadCagoryOptions(props: Props) {
        const { category, selectedOrgUnitId } = props;

        CategorySelector
            .getOptionsAsync(category.id, selectedOrgUnitId, this.isLoadAborted)
            .then((options) => {
                options.sort((a, b) => {
                    if (a.label === b.label) {
                        return 0;
                    }
                    if (a.label < b.label) {
                        return -1;
                    }
                    return 1;
                });
                this.setState({
                    options,
                });
            })
            .catch((error) => {
                if (!error || !error.aborted) {
                    log.error(
                        errorCreator('An error occured loading category options')({ error }),
                    );
                    this.setState({
                        options: [],
                    });
                }
            });
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
