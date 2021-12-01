// @flow
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import * as React from 'react';
import { convertValue } from '../../../../converters/clientToForm';
import { type OptionSet } from '../../../../metaData';

type Props = {
    optionSet: OptionSet
};

export const withConvertedOptionSet = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class OptionSetConverter extends React.Component<Props> {
            formOptionSet: OptionSet;
            constructor(props: Props) {
                super(props);
                // $FlowFixMe[incompatible-type] automated comment
                this.formOptionSet = this.buildFormOptionSet();
            }
            static errorMessages = {
                DATAELEMENT_MISSING: 'DataElement missing',
            };

            buildFormOptionSet() {
                const optionSet = this.props.optionSet;
                if (!optionSet.dataElement) {
                    log.error(errorCreator(OptionSetConverter.errorMessages.DATAELEMENT_MISSING)({ OptionSetConverter: this }));
                    return null;
                }
                return optionSet.dataElement.getConvertedOptionSet(convertValue);
            }

            render() {
                return (
                    <InnerComponent
                        {...this.props}
                        optionSet={this.formOptionSet}
                    />
                );
            }
        };
