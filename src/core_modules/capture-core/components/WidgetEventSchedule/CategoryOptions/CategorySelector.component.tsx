import * as React from 'react';
import log from 'loglevel';
import { errorCreator, makeCancelablePromise } from 'capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { NewSingleSelectField } from
    '../../FormFields/New/Fields/SingleSelectField/SingleSelectField.component';

type SelectOption = {
    label: string;
    value: string;
};

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    category: { id: string; displayName: string};
    selectedOrgUnitId: string | null;
    onChange: (option: SelectOption | null) => void;
    initialValue?: SelectOption | null;
}

type State = {
    options: Array<SelectOption> | null;
    prevOrgUnitId: string | null;
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
                selectedOption: null,
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
            selectedOption: props.initialValue,
        };
        this.loadCategoryOptions(this.props);
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.state.options && prevProps.selectedOrgUnitId !== this.props.selectedOrgUnitId) {
            this.loadCategoryOptions(this.props);
        }
    }

    componentWillUnmount() {
        this.cancelablePromise?.cancel();
        this.cancelablePromise = null;
    }

    loadCategoryOptions(props: Props) {
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

    onSelectCategory = (value: string | null) => {
        const { onChange } = this.props;
        const { options } = this.state;

        if (value === null) {
            this.setState({ selectedOption: null });
            onChange(null);
            return;
        }

        const option = options?.find(opt => opt.value === value);
        if (option) {
            this.setState({ selectedOption: option });
            onChange(option);
        }
    }

    render() {
        const { options, selectedOption } = this.state;

        return (
            options ? <NewSingleSelectField
                value={selectedOption?.value ?? null}
                clearable
                onChange={this.onSelectCategory}
                options={options}
            /> : null
        );
    }
}
