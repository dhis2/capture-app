// @flow

type Attributes = {| [id: string]: {
        IdFromPlugin: string;
        IdFromApp: string;
    }
|}

export const PluginConfigConvertFns = Object.freeze({
    attributeValues: (value: any, attributes: Attributes) => {
        if (Array.isArray(value)) {
            const attributeValues = value.reduce((acc, curr: any) => {
                const configAttribute = attributes && attributes[curr.attribute.id];
                if (!configAttribute) return acc;

                acc[configAttribute.IdFromPlugin] = curr.value;

                return acc;
            }, {});

            if (Object.keys(attributeValues).length > 0) {
                return { key: 'attributes', value: attributeValues };
            }
        }
        return null;
    },
});
