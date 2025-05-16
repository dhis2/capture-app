import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import { errorCreator, makeCancelablePromise } from 'capture-core-utils';
import { buildCategoryOptionsAsync } from '../../../metaDataMemoryStoreBuilders';
import { OptionsSelectVirtualized } from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

export type SelectOption = {
    label: string;
    value: string;
    writeAccess?: boolean;
};

type Props = {
    category: { id: string; name: string };
    selectedOrgUnitId?: string;
    onChange: (option: SelectOption | null) => void;
    initialValue?: SelectOption | null;
    classes: Record<string, string>;
};

type State = {
    options: Array<SelectOption> | null;
    prevOrgUnitId?: string | null;
    open: boolean;
    selectedOption?: SelectOption | null;
};

const styles = () => ({});

class CategorySelectorPlain extends React.Component<Props, State> {
    static getOptionsAsync(
        categoryId: string,
        selectedOrgUnitId: string | null | undefined,
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
        this.cancelablePromise && this.cancelablePromise.cancel();
        this.cancelablePromise = null;
    }

    cancelablePromise: any;

    loadCagoryOptions(props: Props) {
        const { category, selectedOrgUnitId } = props;

        this.setState({
            options: null,
        });
        this.cancelablePromise && this.cancelablePromise.cancel();

        let currentRequestCancelablePromise;

        const isRequestAborted = () =>
            (currentRequestCancelablePromise && this.cancelablePromise !== currentRequestCancelablePromise);

        currentRequestCancelablePromise = makeCancelablePromise(
            CategorySelectorPlain
                .getOptionsAsync(
                    category.id,
                    selectedOrgUnitId,
                    isRequestAborted,
                ),
        );

        currentRequestCancelablePromise
            .promise
            .then((options) => {
                options.sort((a: SelectOption, b: SelectOption) => {
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
                onSelect={(option) => {
                    this.setState({ selectedOption: option });
                    onChange(option);
                }}
                options={options}
            /> : null
        );
    }
}
export const CategorySelector = withStyles(styles)(CategorySelectorPlain);
