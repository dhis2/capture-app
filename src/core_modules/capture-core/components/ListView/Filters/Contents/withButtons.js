// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import type { UpdatableFilterContent } from '../../../FiltersForTypes';

const getStyles = (theme: Theme) => ({
    buttonsContainer: {
        paddingTop: theme.typography.pxToRem(8),
    },
    buttonContainer: {
        paddingRight: theme.typography.pxToRem(8),
        display: 'inline-block',
    },
});

type Props = {
    onUpdate: (data: ?Object, commitValue?: any) => void,
    onClose: () => void,
    onRemove: () => void,
    isRemovable?: boolean,
    disabledReset: boolean,
    disabledUpdate: boolean,
    classes: {
        buttonsContainer: string,
        buttonContainer: string,
    },
};

export const withButtons = () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class FilterContentsButtons extends React.Component<Props> {
        filterTypeInstance: UpdatableFilterContent<any>;
        updateButtonInstance: HTMLButtonElement;
        closeButtonInstance: HTMLButtonElement;
        removeButtonInstance: HTMLButtonElement;

        update = (commitValue?: any) => {
            const updateData = this.filterTypeInstance.onGetUpdateData(commitValue);
            this.props.onUpdate(updateData);
        }

        isValid() {
            return this.filterTypeInstance.onIsValid ? this.filterTypeInstance.onIsValid() : true;
        }

        handleUpdateClick = () => {
            if (this.isValid()) {
                this.update();
            }
        }

        focusUpdateButton = () => {
            this.updateButtonInstance && this.updateButtonInstance.focus();
        }

        focusCloseButton = () => {
            this.closeButtonInstance && this.closeButtonInstance.focus();
        }

        focusRemoveButton = () => {
            this.removeButtonInstance && this.removeButtonInstance.focus();
        }

        setFilterTypeInstance = (filterTypeInstance: UpdatableFilterContent<any>) => {
            this.filterTypeInstance = filterTypeInstance;
        }

        setUpdateButtonInstance = (buttonInstance: HTMLButtonElement) => {
            this.updateButtonInstance = buttonInstance;
        }

        setCloseButtonInstance = (buttonInstance: HTMLButtonElement) => {
            this.closeButtonInstance = buttonInstance;
        }

        setRemoveButtonInstance = (buttonInstance: HTMLButtonElement) => {
            this.removeButtonInstance = buttonInstance;
        }

        render() {
            const { onUpdate,
                onClose,
                onRemove,
                classes,
                disabledUpdate,
                disabledReset,
                isRemovable,
                ...passOnProps
            } = this.props;

            return (
                <React.Fragment>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        filterTypeRef={this.setFilterTypeInstance}
                        onUpdate={this.update}
                        onFocusUpdateButton={this.focusUpdateButton}
                        onFocusCloseButton={this.focusCloseButton}
                        onFocusRemoveButton={this.focusRemoveButton}
                        {...passOnProps}
                    />
                    <div
                        className={classes.buttonsContainer}
                    >
                        <div
                            className={classes.buttonContainer}
                        >
                            <Button
                                dataTest="list-view-filter-apply-button"
                                muiButtonRef={this.setUpdateButtonInstance}
                                primary
                                onClick={this.handleUpdateClick}
                                disabled={disabledUpdate}
                            >
                                {i18n.t('Update')}
                            </Button>
                        </div>
                        <div
                            className={classes.buttonContainer}
                        >
                            <Button
                                dataTest="list-view-filter-cancel-button"
                                muiButtonRef={this.setCloseButtonInstance}
                                secondary
                                onClick={onClose}
                                disabled={disabledReset}
                            >
                                {i18n.t('Reset filter')}
                            </Button>
                        </div>
                        {isRemovable &&
                        (<div
                            className={classes.buttonContainer}
                        >
                            <Button
                                dataTest="list-view-filter-remove-button"
                                muiButtonRef={this.setRemoveButtonInstance}
                                destructive
                                onClick={onRemove}
                            >
                                {i18n.t('Remove filter')}
                            </Button>
                        </div>)
                        }
                    </div>
                </React.Fragment>
            );
        }
    });
