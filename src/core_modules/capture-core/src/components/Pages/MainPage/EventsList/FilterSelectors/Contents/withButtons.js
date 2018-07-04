// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../../../Buttons/Button.component';
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
        filterTypeInstance: UpdatableFilterContent;
        update = (commitValue?: any) => {
            const updateData = this.filterTypeInstance.onGetUpdateData(commitValue);
            this.props.onUpdate(updateData, commitValue);
        }

        isValid() {
            return this.filterTypeInstance.onIsValid ? this.filterTypeInstance.onIsValid() : true;
        }

        setFilterTypeInstance = (filterTypeInstance: UpdatableFilterContent) => {
            this.filterTypeInstance = filterTypeInstance;
        }

        handleUpdateClick = () => {
            if (this.isValid()) {
                this.update();
            }
        }

        render() {
            const { onUpdate, onClose, classes, ...passOnProps } = this.props; //eslint-disable-line
            return (
                <React.Fragment>
                    <InnerComponent
                        filterTypeRef={this.setFilterTypeInstance}
                        onUpdate={this.update}
                        {...passOnProps}
                    />
                    <div
                        className={classes.buttonsContainer}
                    >
                        <div
                            className={classes.firstButtonContainer}
                        >
                            <Button
                                variant="raised"
                                color="primary"
                                onClick={this.handleUpdateClick}
                            >
                                {i18n.t('Update')}
                            </Button>
                        </div>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={onClose}
                        >
                            {i18n.t('Close')}
                        </Button>
                    </div>
                </React.Fragment>
            );
        }
    });
