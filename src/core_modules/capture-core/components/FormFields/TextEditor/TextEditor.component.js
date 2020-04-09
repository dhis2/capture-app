// @flow

import * as React from 'react';
import RichTextEditor from 'react-rte';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core';

type Props = {
    label?: ?string,
    required?: ?boolean,
    disabled?: ?boolean,
    onChange?: ?(value: string) => void,
    onBlur?: ?(value: ?string) => void,
    format: string,
    value?: ?string,
    containerClassName?: ?string,
    classes: {
        textEditor: string,
        label: string,
        labelContainer: string,
    }
}

type State = {
    editorValue: any,
}

const styles = theme => ({
    labelContainer: {
        marginBottom: theme.typography.pxToRem(5),
    },
    label: theme.typography.formFieldTitle,
    textEditor: {
        fontFamily: 'sans-serif!important',
        minHeight: theme.typography.pxToRem(120),
    },
});

const editorDefaultValue = '<p><br></p>';

class TextEditor extends React.Component<Props, State> {
    static defaultProps = {
        format: 'html',
    }
    constructor(props: Props) {
        super(props);
        this.state = {
            editorValue: RichTextEditor.createEmptyValue(),
        };
    }

    componentWillMount() {
        this.updateStateFromProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateStateFromProps(newProps);
    }

    updateStateFromProps = (props) => {
        const editorStringValue = this.getStringValue();
        const { value, format } = props;
        const formattedValue = value || '';
        const editorValue = this.state.editorValue;
        if (editorStringValue !== formattedValue) {
            this.setState({
                editorValue: editorValue.setContentFromString(formattedValue, format),
            });
        }
    }

    onChange = (editorValue: any) => {
        this.setState({ editorValue });
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(this.getStringValue());
        }
    }

    getStringValue = () => this.state.editorValue.toString(this.props.format)

    getToolbarConfig = () => {
        const toolbarConfig = {
            display: ['INLINE_STYLE_BUTTONS', 'LINK_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Underline', style: 'UNDERLINE' },
            ],
            BLOCK_TYPE_DROPDOWN: null,
        };
        return toolbarConfig;
    }
    onBlur = () => {
        const onBlur = this.props.onBlur;
        if (onBlur) {
            const value = this.getStringValue();
            const convertedValue = value === editorDefaultValue ? null : value;
            onBlur(convertedValue);
        }
    }

    render() {
        const { classes, containerClassName, label, required, disabled } = this.props;
        return (
            <div className={containerClassName}>
                {label &&
                <div className={classes.labelContainer}>
                    <InputLabel
                        classes={{ root: classes.label }}
                        disabled={!!disabled}
                        required={!!required}
                    >
                        {label}
                    </InputLabel>
                </div>
                }

                <RichTextEditor
                    className={classes.textEditor}
                    value={this.state.editorValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    toolbarConfig={this.getToolbarConfig()}
                />
            </div>

        );
    }
}

export default withStyles(styles)(TextEditor);
