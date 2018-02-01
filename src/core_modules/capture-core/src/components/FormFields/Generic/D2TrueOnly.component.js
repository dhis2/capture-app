// @flow
import React, { Component } from 'react';
import Checkbox from 'material-ui-next/Checkbox';
// import gotoFn from '../Utils/gotoMixin';

type Props = {
    onBlur: (value: any) => void,
    value?: ?string
};

class D2TrueOnly extends Component<Props> {
    handleChange: (e: Object, checked: boolean) => void;
    materialUIContainerInstance: any;
    // goto: () => void;

    constructor(props: propTypesType) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // this.goto = gotoFn;
    }

    getCheckboxProps() {
        const { onBlur, value, ...other } = this.props;
        other.checked = !!value;
        return other;
    }

    handleChange(e: Object, checked: boolean) {
        let value;
        if (checked) {
            value = 'true';
        } else {
            value = null;
        }

        this.props.onBlur(value);
    }

    render() {
        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                <Checkbox
                    {...this.getCheckboxProps()}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default D2TrueOnly;
