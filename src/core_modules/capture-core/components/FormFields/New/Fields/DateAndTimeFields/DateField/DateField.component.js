// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton, DateField as UIDateField, orientations } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import classNames from 'classnames';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';

const getStyles = () => ({
    fieldsContainer: {
        display: 'flex',
    },
    fieldsContainerVertical: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});

type Props = {
    value?: any,
    disabled?: boolean,
    onChange?: (value: any) => void,
    formHorizontal: string,
    orientation: string,
    classes: {
        fieldsContainer: string,
        fieldsContainerVertical: string,
    },
};

class DateFieldPlain extends React.Component<Props> {
    handleClear = () => {
        const { onChange } = this.props;
        onChange && onChange(null);
    };

    renderClearButton = () => (
        <IconButton
            style={{ height: '40px', width: '40px', borderRadius: '0' }}
            disabled={!!this.props.disabled}
            onClick={this.handleClear}
        >
            <IconCross24 />
        </IconButton>
    );


    render() {
        const {
            value,
            onChange,
            disabled,
            orientation,
            ...passOnProps
        } = this.props;

        const isVertical = orientation === orientations.VERTICAL;

        return (
            <div className={classNames(this.props.classes.fieldsContainer, { [this.props.classes.fieldsContainerVertical]: isVertical })}>
                {isVertical ? this.renderClearButton() : null}
                {/*  $FlowFixMe[cannot-spread-inexact] automated comment */}
                <UIDateField
                    placeholder={systemSettingsStore.get().dateFormat.toLowerCase()}
                    locale={systemSettingsStore.get().uiLocale}
                    value={value}
                    onChange={onChange}
                    {...passOnProps}
                />
                {isVertical ? null : this.renderClearButton()}
            </div>

        );
    }
}

export const DateField = withTheme()(withStyles(getStyles)(DateFieldPlain));
