// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const getStyles = (theme: Theme) => ({
    evenNumbers: {
        backgroundColor: theme.palette.grey.lightest,
    },
});

type Props = {
    formHorizontal: boolean,
    classes: {
        evenNumbers: string,
        oddNumbers: string,
    },
};

type Field = {
    props: {
        hidden?: ?boolean,
    }
};

export default () => (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
    class AlternateBackgroundColorsHOC extends React.Component<Props> {
        hiddenFieldsCount: number;

        getContainerProps = (index: number, total: number, field: Field) => {
            if (index === 0) {
                this.hiddenFieldsCount = 0;
            }

            if (field.props && field.props.hidden) {
                this.hiddenFieldsCount += 1;
                return {};
            }

            const { classes } = this.props;
            const indexHiddenModified = index - this.hiddenFieldsCount;
            return {
                className: indexHiddenModified % 2 === 0 ? null : classes.evenNumbers,
            };
        }

        render() {
            const { formHorizontal, classes, ...passOnProps } = this.props;
            const calculatedProps = !formHorizontal ? { onGetContainerProps: this.getContainerProps } : null;

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    {...calculatedProps}
                    {...passOnProps}
                />
            );
        }
    });
