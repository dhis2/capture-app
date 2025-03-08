// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

type Props = {
    translations?: ?{
        clearText?: ?string,
        noResults?: ?string,
    },
};

export const withSelectSingleTranslations = () => (InnerComponent: React.ComponentType<any>) =>
    class TranslationBuilder extends React.Component<Props> {
        static defaultProps = {
            translations: {
                clearText: '',
                noResults: '',
            },
        };

        render() {
            const { translations, ...passOnProps } = this.props;
            const translationsWithDefaultValues = {
                ...TranslationBuilder.defaultProps.translations,
                ...translations,
                clearText: translations && translations.clearText ? translations.clearText : i18n.t('Clear'),
                noResults: translations && translations.noResults ? translations.noResults : i18n.t('No results found'),
            };

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    translations={translationsWithDefaultValues}
                    {...passOnProps}
                />
            );
        }
    };
