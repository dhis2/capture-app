import { colors } from '@dhis2/ui';
import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

const getStyles: Readonly<any> = () => ({
    evenNumbers: {
        backgroundColor: colors.grey050,
    },
});

type Props = {
    formHorizontal: boolean;
} & WithStyles<typeof getStyles>;

type Field = {
    props: {
        hidden?: boolean;
    };
};

export const withAlternateBackgroundColors = () => (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
    class AlternateBackgroundColorsHOC extends React.Component<Props> {
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
        };

        hiddenFieldsCount = 0;

        render() {
            const { formHorizontal, classes, ...passOnProps } = this.props;
            const calculatedProps = !formHorizontal ? { onGetContainerProps: this.getContainerProps } : null;

            return (
                <InnerComponent
                    {...calculatedProps}
                    {...passOnProps}
                />
            );
        }
    });
