// @flow
import * as React from 'react';
import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';

type Props = {

};

function buildTranslations() {
    return {
        clearText: getTranslation('dropdown_clear', formatterOptions.CAPITALIZE_FIRST_LETTER),
        noResults: getTranslation('dropdown_no_results', formatterOptions.CAPITALIZE_FIRST_LETTER),
    };
}

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class TranslationBuilder extends React.Component<Props> {
            static translations = buildTranslations();

            render() {
                const { ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        translations={TranslationBuilder.translations}
                        {...passOnProps}
                    />
                );
            }
        };
