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
    handlerRef?: ?() => void,
};

class D2CustomForm extends React.Component<Props> {
    static getEventListenersForCurrentNode(nodeProps: Object) {
        const eventListeners =
            Object
                .keys(nodeProps)
                .filter(propName => propName.startsWith('on'));
        return eventListeners;
    }

    static getEventListenerSpecsForCurrentNode(eventListeners: Array<string>, nodeProps: Object, id: number) {
        const eventListenerSpecsForCurrentNode = eventListeners
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


    static renderField(field, customFormElementProps, onRenderField) {
        return onRenderField({
            ...field,
            props: {
                ...field.props,
                customFormElementProps,
            },
        });
    }

    eventListenerSpecs: Array<EventListenerSpec>;
    preProcessedSourceTree: React.Element<any>;
    constructor(props: Props) {
        super(props);
        this.preProcessSourceTree();
    }

    componentDidMount() {
        this.addScripts();
        this.addEventListeners();
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    preProcessSourceTree() {
        const { specs } = this.props;
        const sourceTree = specs.data.elements;
        let autoId = 1;
        let eventListenerSpecs = [];


        const preProcessedSourceTree = walk(sourceTree, {
            [kinds.DOM_ELEMENT]: (path) => {
                const { node } = path;
                const { props: nodeProps } = node;
                if (nodeProps) {
                    const eventListeners = D2CustomForm.getEventListenersForCurrentNode(nodeProps);
                    if (eventListeners.length > 0) {
                        const eventListenerSpecsForCurrentNode = D2CustomForm.getEventListenerSpecsForCurrentNode(eventListeners, nodeProps, autoId);
                        eventListenerSpecs = [...eventListenerSpecs, ...eventListenerSpecsForCurrentNode];
                        const passOnNodeProps = Object
                            .keys(nodeProps)
                            .reduce((accPassOnProps, key) => {
                                if (!eventListeners.includes(key)) {
                                    accPassOnProps[key] = nodeProps[key];
                                }
                                return accPassOnProps;
                            }, {});

                        const clonedElement = React.cloneElement(
                            node,
                            {
                                ...passOnNodeProps,
                                'data-custom-form-id': autoId,
                            },
                            ...path.walkChildren(),
                        );
                        autoId += 1;
                        return clonedElement;
                    }
                }

                return React.cloneElement(
                    node,
                    node.props,
                    ...path.walkChildren(),
                );
            },
        });

        this.eventListenerSpecs = eventListenerSpecs;
        this.preProcessedSourceTree = preProcessedSourceTree;
    }

    addScripts() {
        const scripts = this.props.specs.data.scripts;
        scripts
            .forEach((scriptData) => {
                const domScriptElement = document.createElement('script');
                domScriptElement.type = 'text/javascript';
                domScriptElement.async = true;
                domScriptElement.innerHTML = scriptData;
                document.body.appendChild(domScriptElement);
            });
    }

    addEventListeners() {
        const eventListenerSpecs = this.eventListenerSpecs;
        const specsWithHandlerRef = eventListenerSpecs
            .map((spec) => {
                const handlerRef = () => { eval(spec.handler); } //eslint-disable-line
                document
                    .querySelector(`[data-custom-form-id="${spec.id}"]`)
                    .addEventListener(spec.type, handlerRef);

                return {
                    ...spec,
                    handlerRef,
                };
            });
        this.eventListenerSpecs = specsWithHandlerRef;
    }

    removeEventListeners() {
        this.eventListenerSpecs
            .forEach((spec) => {
                document
                    .querySelector(`[data-custom-form-id="${spec.id}"]`)
                    .removeEventListener(spec.type, spec.handlerRef);
            });
    }

    transform() {
        const { fields, onRenderField } = this.props;
        const sourceTree = this.preProcessedSourceTree;

        const transformedTree = walk(sourceTree, {
            [kinds.DOM_ELEMENT]: (path) => {
                const { node } = path;
                if (node.type === 'FormField') {
                    const fieldId = node.props.id;
                    const field = fields.find(f => f.id === fieldId);
                    if (field) {
                        return D2CustomForm.renderField(field, node.props.customFormElementProps, onRenderField);
                    }
                    return null;
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

