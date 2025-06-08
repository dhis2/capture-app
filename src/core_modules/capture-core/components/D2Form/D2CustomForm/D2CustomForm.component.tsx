import * as React from 'react';
import log from 'loglevel';
import { walk, kinds } from 'react-transform-tree';
import { errorCreator } from 'capture-core-utils';
import type { FieldConfig } from '../FormBuilder';
import { CustomForm } from '../../../metaData';

type Props = {
    fields: Array<FieldConfig>;
    onRenderField: (field: FieldConfig) => React.ReactElement<any>;
    specs: CustomForm;
};

type EventListenerSpec = {
    id: string;
    type: string;
    handler: string;
    handlerRef?: () => void;
};

/**
 * Build the form based on the specs in custom form.
 *
 * @class D2CustomForm
 * @extends {React.Component<Props>}
 */
export class D2CustomForm extends React.Component<Props> {
    static getEventListenersForCurrentNode(nodeProps: Record<string, any>): Array<string> {
        const eventListeners =
            Object
                .keys(nodeProps)
                .filter(propName => propName.startsWith('on'));
        return eventListeners;
    }

    static getEventListenerSpecsForCurrentNode(
        eventListeners: Array<string>,
        nodeProps: Record<string, any>,
        id: number): Array<EventListenerSpec> {
        const eventListenerSpecsForCurrentNode = eventListeners
            .map((propName) => {
                const handler = nodeProps[propName];
                const type = propName.replace(/^on/, '');
                return {
                    id: id.toString(),
                    type: type.toLowerCase(),
                    handler,
                };
            });

        return eventListenerSpecsForCurrentNode;
    }

    static renderField(
        fieldConfig: FieldConfig,
        customFormElementProps: Record<string, any>,
        onRenderField: (field: FieldConfig) => React.ReactNode) {
        return onRenderField({
            ...fieldConfig,
            props: {
                ...fieldConfig.props,
                customFormElementProps,
            },
        });
    }

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

    eventListenerSpecs: Array<EventListenerSpec> = [];
    preProcessedSourceTree: Array<React.ReactNode> = [];

    static errorMessages = {
        PRE_PROCESS_FAILED: 'Could not pre process custom form source tree',
    };

    /**
     * Pre process the tree, extracting all event listeners. Event listeners will be added after the component is mounted.
     *
     * @memberof D2CustomForm
     */
    preProcessSourceTree() {
        const { specs } = this.props;
        const sourceTree = specs.data.elements;
        let autoId = 1;
        let eventListenerSpecs: Array<EventListenerSpec> = [];
        let preProcessedSourceTree: Array<React.ReactNode> = [];
        try {
            preProcessedSourceTree = walk(sourceTree, {
                [kinds.DOM_ELEMENT]: (path: any) => {
                    const { node } = path;
                    const { props: nodeProps } = node;
                    if (nodeProps) {
                        const eventListeners = D2CustomForm.getEventListenersForCurrentNode(nodeProps);
                        if (eventListeners.length > 0) {
                            const eventListenerSpecsForCurrentNode =
                                D2CustomForm.getEventListenerSpecsForCurrentNode(eventListeners, nodeProps, autoId);
                            eventListenerSpecs = [...eventListenerSpecs, ...eventListenerSpecsForCurrentNode];
                            const passOnNodeProps = Object
                                .keys(nodeProps)
                                .reduce((accPassOnProps: any, key) => {
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
        } catch (error) {
            log.error(errorCreator(D2CustomForm.errorMessages.PRE_PROCESS_FAILED)({ sourceTree, error }));
            eventListenerSpecs = [];
            preProcessedSourceTree = [];
        }

        this.eventListenerSpecs = eventListenerSpecs;
        this.preProcessedSourceTree = preProcessedSourceTree;
    }

    /**
     * Add scripts to the DOM
     *
     * @memberof D2CustomForm
     */
    addScripts() {
        const scripts = this.props.specs.data.scripts;
        scripts
            .forEach((scriptData) => {
                const domScriptElement = document.createElement('script');
                domScriptElement.type = 'text/javascript';
                domScriptElement.async = true;
                domScriptElement.innerHTML = scriptData;

                if (document.body) {
                    document.body.appendChild(domScriptElement);
                }
            });
    }

    /**
     *
     * Add event listeners
     *
     * @memberof D2CustomForm
     */
    addEventListeners() {
        const eventListenerSpecs = this.eventListenerSpecs;
        const specsWithHandlerRef = eventListenerSpecs
            .map((spec) => {
                const handlerRef = () => { eval(spec.handler); } //eslint-disable-line
                const element = document.querySelector(`[data-custom-form-id="${spec.id}"]`);
                if (element) {
                    element.addEventListener(spec.type, handlerRef);
                }

                return {
                    ...spec,
                    handlerRef,
                };
            });
        this.eventListenerSpecs = specsWithHandlerRef;
    }
    /**
     * Remove event listeners
     *
     * @memberof D2CustomForm
     */
    removeEventListeners() {
        this.eventListenerSpecs
            .forEach((spec) => {
                const element = document.querySelector(`[data-custom-form-id="${spec.id}"]`);
                if (element && spec.handlerRef) {
                    element.removeEventListener(spec.type, spec.handlerRef);
                }
            });
    }

    /**
     * Transform the tree, replacing all placeholder FormField elements with the real field elements.
     *
     * @returns the transformed tree
     * @memberof D2CustomForm
     */
    transform() {
        const { fields, onRenderField } = this.props;
        const sourceTree = this.preProcessedSourceTree;


        const transformedTree = walk(sourceTree, {
            [kinds.DOM_ELEMENT]: (path: any) => {
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
