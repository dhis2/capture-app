// @flow
export type CssClasses = {
    [key: string]: string,
};

export type ComponentCreator = (createdComponents?: any) => any;
export type ComponentCreators = {
    [key: string]: ComponentCreator,
};

export type Adapter = {
    componentCreators: ComponentCreators,
    creationOrder?: ?Array<string>,
};
