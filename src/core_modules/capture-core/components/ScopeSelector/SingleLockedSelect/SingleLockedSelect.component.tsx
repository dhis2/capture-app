import React, { useCallback, useState } from 'react';
// @ts-expect-error - SelectorBarItem is available at runtime, but its TypeScript definition is not exposed by the UI library
import { SelectorBarItem, Menu, MenuItem, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { capitalizeFirstLetter, lowerCaseFirstLetter } from 'capture-core-utils/string';
import { compose } from 'redux';
import { withLoadingIndicator } from '../../../HOC';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { FiltrableMenuItems } from '../QuickSelector/FiltrableMenuItems';
import { OptionLabel } from '../OptionLabel';
import type { Icon } from '../../../metaData';

export type Props = {
    isUserInteractionInProgress?: boolean;
    options: Option[];
    onClear?: () => void;
    onSelect?: (value: string) => void;
    title: string;
    selectedValue: string;
    displayOnly?: boolean;
} & WithStyles<typeof styles>;

export type Option = {
    label: string;
    value: any;
    icon?: Icon;
};

export type ReadyProp = {
    ready: boolean;
};

const styles = () => ({
    selectBarMenu: {
        maxHeight: '80vh',
        overflow: 'auto' as const,
    },
    label: {
        display: 'flex',
        alignItems: 'center',
    },
});

const getSelectedOption = (options: Option[], selectedValue: string): Partial<Option> => (
    options.find(({ value }) => value === selectedValue) || {}
);

const SingleLockedSelectPlain = ({
    onClear,
    onSelect,
    title,
    selectedValue,
    options = [],
    displayOnly,
    classes,
    isUserInteractionInProgress,
}: Props) => {
    const [openStartAgainWarning, setOpenStartAgainWarning] = useState(false);
    const [openSelectorBarItem, setOpenSelectorBarItem] = useState(false);
    const hasMenu = !displayOnly && options?.length > 0;

    const handleClose = () => {
        setOpenStartAgainWarning(false);
    };
    const handleDestroy = () => {
        handleClose();
        onClear && onClear();
    };

    const handleOnClear = () => {
        if (!isUserInteractionInProgress) {
            onClear && onClear();
            return;
        }
        setOpenStartAgainWarning(true);
    };
    const handleOnSelect = useCallback(
        ({ value }: { value: string }) => {
            onSelect && onSelect(value);
        },
        [onSelect],
    );
    const handleOnChange = (item: { value?: string }) => {
        setOpenSelectorBarItem(false);
        if (item.value) {
            handleOnSelect({ value: item.value });
        }
    };

    const { label, icon } = getSelectedOption(options, selectedValue);
    const manyOptions = options.length > 10;

    return (
        <span data-test="single-locked-select">
            <SelectorBarItem
                disabled={options.length === 0}
                displayOnly={displayOnly}
                label={capitalizeFirstLetter(title)}
                value={label && (<OptionLabel icon={icon} label={label} />)}
                noValueMessage={hasMenu ? i18n.t(`Choose a ${lowerCaseFirstLetter(title)}`) : ''}
                open={openSelectorBarItem}
                setOpen={open => hasMenu && setOpenSelectorBarItem(open)}
                onClearSelectionClick={() => handleOnClear()}
                dataTest={`${lowerCaseFirstLetter(title)}-selector-container`}
            >
                {hasMenu && (
                    <div className={classes.selectBarMenu}>
                        <Menu>
                            {manyOptions ? (
                                <FiltrableMenuItems
                                    options={options}
                                    onChange={handleOnChange}
                                    searchText={i18n.t(`Search for a ${title}`)}
                                    dataTest={title}
                                />
                            ) : (
                                options.map(option => (
                                    <MenuItem
                                        key={option.value}
                                        label={<OptionLabel icon={option.icon} label={option.label} />}
                                        value={option.value}
                                        onClick={payload => handleOnChange(payload)}
                                        suffix=""
                                    />
                                ))
                            )}

                            {label && manyOptions && (
                                <>
                                    <MenuDivider />
                                    <MenuItem
                                        dense
                                        onClick={() => {
                                            setOpenSelectorBarItem(false);
                                            handleOnClear();
                                        }}
                                        label={i18n.t('Clear selection') as string}
                                        suffix=""
                                    />
                                </>
                            )}
                        </Menu>
                    </div>
                )}
            </SelectorBarItem>

            <DiscardDialog
                onDestroy={handleDestroy}
                open={openStartAgainWarning}
                onCancel={handleClose}
                {...defaultDialogProps}
            />
        </span>
    );
};

export const SingleLockedSelect = compose(
    withLoadingIndicator(
        () => ({ height: '100%', alignItems: 'center', justifyContent: 'center' }),
        () => ({ size: 15 }),
    ),
    withStyles(styles),
)(SingleLockedSelectPlain) as any;
