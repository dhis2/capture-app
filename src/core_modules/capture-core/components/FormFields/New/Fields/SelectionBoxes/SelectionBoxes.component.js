// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { colors } from '@dhis2/ui';
import { SelectionBoxes as UISelectionBoxes } from 'capture-ui';

const getStyles = (theme: Theme) => ({
    iconSelected: {
        fill: theme.palette.secondary.main,
    },
    iconDisabled: {
        fill: 'rgba(0,0,0,0.30)',
    },
    iconDeselected: {
        fill: colors.grey700,
    },
    focusSelected: {
        backgroundColor: 'rgba(0, 121, 107, 0.4)',
    },
});

type Props = {};

class SelectionBoxesPlain extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <UISelectionBoxes
                {...passOnProps}
            />
        );
    }
}

export const SelectionBoxes = withStyles(getStyles)(SelectionBoxesPlain);
