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

type EventListenerSpec = {
    id: string,
    type: string,
    handler: string,
};

class D2CustomForm extends React.Component<Props> {
    eventListenerSpecs: Array<EventListenerSpec>;

    static getEventListenerSpecsForCurrentNode(nodeProps: ?Object, id: number) {
        if (nodeProps) {
            const eventListenerNames =
                Object
                    .keys(nodeProps)
                    .filter(propName => propName.startsWith('on'));

            if (eventListenerNames.length > 0) {
                const eventListenerSpecsForCurrentNode = eventListenerNames
                    .map((propName) => {
                        const handler = nodeProps[propName];
                        const type = propName.replace(/^on/, '');
                        return {
                            id,
                            type,
                            handler,
                        };
                    });

                return eventListenerSpecsForCurrentNode;
            }
        }
        return null;
    }
    constructor(props: Props) {
        super(props);
        this.preProcessSourceTree();
    }

    componentDidMount() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.innerHTML = 'document.getElementById("demo").innerHTML = "NOT CLICKED";function clickerFunction() { document.getElementById("clicker").innerHTML = "CLICKED"; }';
        document.body.appendChild(s);
        document.getElementById('clicker').addEventListener('click', () => {
            eval('clickerFunction();document.getElementById("clicker").innerHTML = "Hello World2"');
        });
        // window.clickerFunction();
    }

    preProcessSourceTree() {
        const { specs } = this.props;
        const sourceTree = specs.data;
        let autoId = 1;
        let eventListenerSpecs = [];


        walk(sourceTree, {
            [kinds.DOM_ELEMENT]: (path) => {
                const { node } = path;
                const eventListenerSpecsForCurrentNode = D2CustomForm.getEventListenerSpecsForCurrentNode(node.props, autoId);
                if (eventListenerSpecsForCurrentNode) {
                    eventListenerSpecs = [...eventListenerSpecs, ...eventListenerSpecsForCurrentNode];
                    const clonedElement = React.cloneElement(
                        node,
                        {
                            ...node.props,
                            dataCustomFormId: autoId,
                        },
                        ...path.walkChildren(),
                    );
                    autoId += 1;
                    return clonedElement;
                }
         
                return React.cloneElement(
                    node,
                    node.props,
                    ...path.walkChildren(),
                );
            },
        });

        this.eventListenerSpecs = eventListenerSpecs;
    }

    transform() {
        const { specs, fields, onRenderField } = this.props;
        const sourceTree = specs.data;

        const transformedTree = walk(sourceTree, {
            [kinds.DOM_ELEMENT]: (path) => {
                const { node } = path;
                if (node.type === 'FormField') {
                    const fieldId = node.props.id;
                    const field = fields.find(f => f.id === fieldId);
                    if (field) {
                        return onRenderField(field);
                    }
                }
                return path.defaultHandler();
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

export default D2CustomForm;

