// @flow
import * as React from 'react';
import D2CustomForm from './D2CustomForm.component';

import MetadataCustomForm from '../../../metaData/RenderFoundation/CustomForm';

type Props = {
    customForm: MetadataCustomForm,
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    class CustomFormHOC extends React.Component<Props> {
        render() {
            const { customForm: customFormSpecs, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    {...passOnProps}
                >
                    {
                        customFormSpecs ? (onRenderField, fields) => (
                            <D2CustomForm
                                onRenderField={onRenderField}
                                fields={fields}
                                specs={customFormSpecs}
                            />
                        ) : null
                    }
                </InnerComponent>
            );
        }
    };
