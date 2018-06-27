// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../../../Buttons/Button.component';
import type { Convertable } from '../../../../../FiltersForTypes/filters.types';

const getStyles = (theme: Theme) => ({
    buttonContainer: {
        marginLeft: -8,
        paddingTop: theme.typography.pxToRem(8),
    },
});

type Props = {
    onUpdate: () => void,
    onClose: () => void,
    classes: {
        buttonContainer: string,
    }
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class FilterContentsButtons extends React.Component<Props> {
        filterTypeInstance: Convertable;
        onUpdate = () => {
            const { requestData, appliedText } = (this.filterTypeInstance.onConvert && this.filterTypeInstance.onConvert()) || {};
            this.props.onUpdate(requestData, appliedText);
        }

        setFilterTypeInstance = (filterTypeInstance: Convertable) => {
            this.filterTypeInstance = filterTypeInstance;
        }

        render() {
            const { onUpdate, onClose, classes, ...passOnProps } = this.props; //eslint-disable-line
            return (
                <React.Fragment>
                    <InnerComponent
                        filterTypeRef={this.setFilterTypeInstance}
                        onUpdate={this.onUpdate}
                        {...passOnProps}
                    />
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.onUpdate}
                        >
                            {i18n.t('Update')}
                        </Button>
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
