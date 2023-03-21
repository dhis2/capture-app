// @flow
import React, { type ComponentType, useCallback, useState } from 'react';
import { SelectorBarItem, Menu, MenuItem, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { capitalizeFirstLetter, lowerCaseFirstLetter } from 'capture-core-utils/string';
import { compose } from 'redux';
import { withLoadingIndicator } from '../../../HOC';
import { ConfirmDialog } from '../../Dialogs/ConfirmDialog.component';
import { defaultDialogProps } from '../../Dialogs/ConfirmDialog.constants';
import { FiltrableMenuItems } from '../QuickSelector/FiltrableMenuItems';

type Props = {|
    isUserInteractionInProgress?: boolean,
    options: Array<{| label: string, value: any |}>,
    onClear?: () => void,
    onSelect?: (value: string) => void,
    title: string,
    selectedValue: string,
    displayOnly?: boolean,
    ...CssClasses,
|};

type ReadyProp = {|
    ready: boolean,
|};

const styles = () => ({
    selectBarMenu: {
        maxHeight: '80vh',
        overflow: 'auto',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
    },
});

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
    const handleConfirm = () => {
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
        ({ value }) => {
            onSelect && onSelect(value);
        },
        [onSelect],
    );
    const handleOnChange = (item) => {
        setOpenSelectorBarItem(false);
        handleOnSelect(item);
    };

    const { label } = options.find(({ value }) => value === selectedValue) || {};
    const manyOptions = options.length > 10;

    return (
        <span data-test="single-locked-select">
            <SelectorBarItem
                disabled={options.length === 0}
                displayOnly={displayOnly}
                label={capitalizeFirstLetter(title)}
                value={label}
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
                                        label={<div className={classes.label}>{option.label}</div>}
                                        value={option.value}
                                        onClick={handleOnChange}
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
                                        label={i18n.t('Clear selection')}
                                    />
                                </>
                            )}
                        </Menu>
                    </div>
                )}
            </SelectorBarItem>

            <ConfirmDialog
                onConfirm={handleConfirm}
                open={openStartAgainWarning}
                onCancel={handleClose}
                {...defaultDialogProps}
            />
        </span>
    );
};

export const SingleLockedSelect: ComponentType<$Diff<Props & ReadyProp, CssClasses>> = compose(
    withLoadingIndicator(
        () => ({ height: '100%', alignItems: 'center', justifyContent: 'center' }),
        () => ({ size: 15 }),
    ),
    withStyles(styles),
)(SingleLockedSelectPlain);
