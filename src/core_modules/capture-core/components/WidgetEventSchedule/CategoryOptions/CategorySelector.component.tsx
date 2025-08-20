import * as React from 'react';
import log from 'loglevel';
import { errorCreator, makeCancelablePromise } from 'capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { OptionsSelectVirtualized } from
    '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

type SelectOption = {
    label: string;
    value: string;
};

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    category: { id: string; displayName: string};
    selectedOrgUnitId: string | null;
    onChange: (option: SelectOption) => void;
    initialValue?: SelectOption | null;
}

type State = {
    options: Array<SelectOption> | null;
    prevOrgUnitId: string | null;
    open: boolean;
    selectedOption?: SelectOption | null;
};

export class CategorySelector extends React.Component<Props, State> {
    static getOptionsAsync(
        categoryId: string,
        selectedOrgUnitId: string | null,
        onIsAborted: () => boolean,
    ) {
        const predicate = (categoryOption: any) => {
            if (!selectedOrgUnitId) {
                return true;
            }

            const orgUnits = categoryOption.organisationUnits;
            if (!orgUnits) {
                return true;
            }

            return !!orgUnits[selectedOrgUnitId];
        };

        const project = (categoryOption: any) => ({
            label: categoryOption.displayName,
            value: categoryOption.id,
            writeAccess: categoryOption.access.data.write,
        });

        return buildCategoryOptionsAsync(
            categoryId,
            { predicate, project, onIsAborted },
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

    cancelablePromise?: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            options: null,
            prevOrgUnitId: null,
            open: false,
            selectedOption: props.initialValue,
        };
        this.loadCagoryOptions(this.props);
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.state.options && prevProps.selectedOrgUnitId !== this.props.selectedOrgUnitId) {
            this.loadCagoryOptions(this.props);
        }
    }

    componentWillUnmount() {
        this.cancelablePromise?.cancel();
        this.cancelablePromise = null;
    }

    loadCagoryOptions(props: Props) {
        const { category, selectedOrgUnitId } = props;

        this.setState({
            options: null,
        });
        this.cancelablePromise?.cancel();

        let currentRequestCancelablePromise: any;

        const isRequestAborted = () =>
            (currentRequestCancelablePromise && this.cancelablePromise !== currentRequestCancelablePromise);

        currentRequestCancelablePromise = makeCancelablePromise(
            CategorySelector
                .getOptionsAsync(
                    category.id,
                    selectedOrgUnitId,
                    isRequestAborted,
                ),
        );

        currentRequestCancelablePromise
            .promise
            .then((options: SelectOption[]) => {
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
                this.cancelablePromise = null;
            })
            .catch((error: any) => {
                if (!(error && (error.aborted || error.isCanceled))) {
                    log.error(
                        errorCreator('An error occured loading category options')({ error }),
                    );
                    this.setState({
                        options: [],
                    });
                }
            });

        this.cancelablePromise = currentRequestCancelablePromise;
    }

    render() {
        const { onChange } = this.props;
        const { options } = this.state;

        return (
            options ? <OptionsSelectVirtualized
                value={this.state.selectedOption?.value}
                nullable
                onChange={(option: any) => {
                    this.setState({ selectedOption: option });
                    onChange(option);
                }}
                options={options}
            /> : null
        );
    }
}
