// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectorBarItem, Menu, MenuItem, MenuDivider, spacers } from '@dhis2/ui';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import { errorCreator, makeCancelablePromise } from 'capture-core-utils';
import type { Category as CategoryMetadata } from '../../../../metaData';
import { buildCategoryOptionsAsync } from '../../../../metaDataMemoryStoreBuilders';
import { makeOnSelectSelector } from './categorySelector.selectors';
import { FiltrableMenuItems } from '../FiltrableMenuItems';

type SelectOption = {
    label: string,
    value: string,
};

type Props = {
    category: CategoryMetadata,
    selectedOrgUnitId: ?string,
    onSelect: (option: SelectOption) => void,
    selectedCategoryName: ?string,
    onClearSelectionClick: () => void,
    disabled?: boolean,
    displayOnly?: boolean,
    classes: Object,
};

type State = {
    options: ?Array<SelectOption>,
    prevOrgUnitId: ?string,
    open: boolean,
};

const styles = () => ({
    selectBarMenu: {
        maxHeight: '80vh',
        overflow: 'auto',
        paddingBottom: `${spacers.dp4}`,
    },
});

class CategorySelectorPlain extends React.Component<Props, State> {
    static getOptionsAsync(
        categoryId: string,
        selectedOrgUnitId: ?string,
        onIsAborted: Function,
    ) {
        const predicate = (categoryOption: Object) => {
            if (!selectedOrgUnitId) {
                return true;
            }

            const orgUnits = categoryOption.organisationUnits;
            if (!orgUnits) {
                return true;
            }

            return !!orgUnits[selectedOrgUnitId];
        };

        const project = (categoryOption: Object) => ({
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

    onSelectSelector: Function;
    cancelablePromise: Object;

    constructor(props: Props) {
        super(props);
        this.state = {
            options: null,
            prevOrgUnitId: null,
            open: false,
        };
        this.onSelectSelector = makeOnSelectSelector();
        // todo you cannot setState from this component (lgtm report)
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
            CategorySelector
                .getOptionsAsync(
                    category.id,
                    selectedOrgUnitId,
                    isRequestAborted,
                ),
        );

        currentRequestCancelablePromise
            .promise
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
                this.cancelablePromise = null;
            })
            .catch((error) => {
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
        const {
            selectedOrgUnitId,
            onSelect,
            onClearSelectionClick,
            selectedCategoryName,
            classes,
            displayOnly,
            disabled,
            ...passOnProps
        } = this.props;
        const { options } = this.state;
        const handleSelect = this.onSelectSelector({ options, onSelect });

        return (
            <SelectorBarItem
                label={passOnProps.category.name}
                value={selectedCategoryName}
                noValueMessage={i18n.t(`Choose a ${passOnProps.category.name}`)}
                open={this.state.open}
                setOpen={(open) => {
                    if (displayOnly) return;
                    this.setState({ open });
                }}
                onClearSelectionClick={!displayOnly && onClearSelectionClick}
                dataTest="category-selector-container"
                disabled={disabled}
                displayOnly={displayOnly}
            >
                {options && (
                    <div className={classes.selectBarMenu}>
                        <Menu>
                            {options.length > 10 ? (
                                <FiltrableMenuItems
                                    options={options}
                                    onChange={(item) => {
                                        this.setState({ open: false });
                                        handleSelect(item.value);
                                    }}
                                    searchText={i18n.t(`Search for a ${passOnProps.category.name}`)}
                                    dataTest="category"
                                />
                            ) : (
                                options.map(option => (
                                    <MenuItem
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        onClick={(item) => {
                                            this.setState({ open: false });
                                            handleSelect(item.value);
                                        }}
                                    />
                                ))
                            )}
                            {Boolean(selectedCategoryName) && options.length > 10 && (
                                <>
                                    <MenuDivider />
                                    <MenuItem
                                        dense
                                        onClick={() => {
                                            this.setState({ open: false });
                                            onClearSelectionClick();
                                        }}
                                        label={i18n.t('Clear selection')}
                                    />
                                </>
                            )}
                        </Menu>
                    </div>
                )}
            </SelectorBarItem>
        );
    }
}
export const CategorySelector = withStyles(styles)(CategorySelectorPlain);
