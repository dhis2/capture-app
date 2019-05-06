// @flow
import * as React from 'react';
import log from 'loglevel';
import errorCreator from '../../../utils/errorCreator';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import { convertValue } from '../../../converters/clientToForm';

type Props = {
    optionSet: OptionSet
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class OptionSetConverter extends React.Component<Props> {
            static errorMessages = {
                DATAELEMENT_MISSING: 'DataElement missing',
            };

            formOptionSet: OptionSet;
            constructor(props: Props) {
                super(props);
                this.formOptionSet = this.buildFormOptionSet();
            }

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
