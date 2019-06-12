
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../../../Buttons';
import type { UpdatableFilterContent } from '../../../../../FiltersForTypes/filters.types';

const getStyles = (theme: Theme) => ({
    buttonsContainer: {
        paddingTop: theme.typography.pxToRem(8),
    },
    firstButtonContainer: {
        paddingRight: theme.typography.pxToRem(8),
        display: 'inline-block',
    },
});

type Props = {
    onUpdate: (data: ?Object, commitValue?: any) => void,
    onClose: () => void,
    classes: {
        buttonsContainer: string,
        firstButtonContainer: string,
    },
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class FilterContentsButtons extends React.Component<Props> {
        filterTypeInstance: UpdatableFilterContent<any>;
        updateButtonInstance: HTMLButtonElement;
        closeButtonInstance: HTMLButtonElement;

        update = (commitValue?: any) => {
            const updateData = this.filterTypeInstance.onGetUpdateData(commitValue);
            this.props.onUpdate(updateData, commitValue);
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

        setFilterTypeInstance = (filterTypeInstance: UpdatableFilterContent<any>) => {
            this.filterTypeInstance = filterTypeInstance;
        }

        setUpdateButtonInstance = (buttonInstance: HTMLButtonElement) => {
            this.updateButtonInstance = buttonInstance;
        }

        setCloseButtonInstance = (buttonInstance: HTMLButtonElement) => {
            this.closeButtonInstance = buttonInstance;
        }

        render() {
            const { onUpdate, onClose, classes, ...passOnProps } = this.props; //eslint-disable-line

            return (
                <React.Fragment>
                    <InnerComponent
                        filterTypeRef={this.setFilterTypeInstance}
                        onUpdate={this.update}
                        onFocusUpdateButton={this.focusUpdateButton}
                        onFocusCloseButton={this.focusCloseButton}
                        {...passOnProps}
                    />
                    <div
                        className={classes.buttonsContainer}
                    >
                        <div
                            className={classes.firstButtonContainer}
                        >
                            <Button
                                muiButtonRef={this.setUpdateButtonInstance}
                                primary
                                onClick={this.handleUpdateClick}
                            >
                                {i18n.t('Update')}
                            </Button>
                        </div>
                        <Button
                            muiButtonRef={this.setCloseButtonInstance}
                            secondary
                            onClick={onClose}
                        >
                            {i18n.t('Close')}
                        </Button>
                    </div>
                </React.Fragment>
            );
        }
    });
