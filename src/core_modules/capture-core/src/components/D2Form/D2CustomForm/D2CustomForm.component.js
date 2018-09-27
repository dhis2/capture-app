// @flow
import * as React from 'react';
import { walk, kinds } from 'react-transform-tree';
import MetadataCustomForm from '../../../metaData/RenderFoundation/CustomForm';
import type { FieldConfig } from '../../../__TEMP__/FormBuilderExternalState.component';

type Props = {
    fields: Array<FieldConfig>,
    onRenderField: (field: FieldConfig) => React.Element<any>,
    specs: MetadataCustomForm,
};

class CustomForm extends React.Component<Props> {
    transform() {
        const { specs } = this.props;
        const sourceTree = specs.data;

        const transformedTree = walk(sourceTree, {
            // $FlowSuppress
            [kinds.DOM_ELEMENT]: (path) => {
                const { node } = path;
                if (node.type === 'div') {
                    return React.createElement(
                        'span',
                        node.props,
                        ...path.walkChildren(),
                    );
                }
                return React.cloneElement(
                    node,
                    node.props,
                    ...path.walkChildren(),
                );
            },
        });
        return transformedTree;
    }

    render() {
        const customFormElement = this.transform();
        return (
            <div>
                {customFormElement}
            </div>
        );
    }
}

export default CustomForm;

