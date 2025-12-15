/* eslint-disable complexity */

// Vite struggles with dynamic import paths, and import(`moment/dist/locale/${locale}`) throws an error.
// Additionally, behavior differs between dev and production builds.
// For now, until dynamic imports become more reliable, I’m using a simple switch/case with static imports.
// These imports map the locales fetched from https://{instance-url}/api/{api-version}/locales/ui
// to their corresponding moment equivalents.
export const getMomentLocale = async (locale) => {
    switch (locale) {
    case 'ar': return (await import('moment/dist/locale/ar')).default;
    case 'ar-EG': return (await import('moment/dist/locale/ar')).default;
    case 'ar-IQ': return (await import('moment/dist/locale/ar')).default;
    case 'ar-SD': return (await import('moment/dist/locale/ar')).default;
    case 'bn': return (await import('moment/dist/locale/bn')).default;
    case 'cs': return (await import('moment/dist/locale/cs')).default;
    case 'da': return (await import('moment/dist/locale/da')).default;
    case 'en': return (await import('moment/dist/locale/en-gb')).default;
    case 'es': return (await import('moment/dist/locale/es')).default;
    case 'fr': return (await import('moment/dist/locale/fr')).default;
    case 'hi-IN': return (await import('moment/dist/locale/hi')).default;
    case 'id': return (await import('moment/dist/locale/id')).default;
    case 'id-ID': return (await import('moment/dist/locale/id')).default;
    case 'km': return (await import('moment/dist/locale/km')).default;
    case 'lo': return (await import('moment/dist/locale/lo')).default;
    case 'mn': return (await import('moment/dist/locale/mn')).default;
    case 'my': return (await import('moment/dist/locale/my')).default;
    case 'nb': return (await import('moment/dist/locale/nb')).default;
    case 'ne': return (await import('moment/dist/locale/ne')).default;
    case 'nl': return (await import('moment/dist/locale/nl')).default;
    case 'pt': return (await import('moment/dist/locale/pt')).default;
    case 'pt-BR': return (await import('moment/dist/locale/pt-br')).default;
    case 'ro': return (await import('moment/dist/locale/ro')).default;
    case 'ru': return (await import('moment/dist/locale/ru')).default;
    case 'si': return (await import('moment/dist/locale/si')).default;
    case 'sv': return (await import('moment/dist/locale/sv')).default;
    case 'tet': return (await import('moment/dist/locale/tet')).default;
    case 'tg': return (await import('moment/dist/locale/tg')).default;
    case 'uk': return (await import('moment/dist/locale/uk')).default;
    case 'ur': return (await import('moment/dist/locale/ur')).default;
    case 'uz-UZ-Cyrl': return (await import('moment/dist/locale/uz')).default;
    case 'uz-UZ-Latn': return (await import('moment/dist/locale/uz-latn')).default;
    case 'vi': return (await import('moment/dist/locale/vi')).default;
    case 'zh': return (await import('moment/dist/locale/zh-cn')).default;
    case 'zh-CN': return (await import('moment/dist/locale/zh-cn')).default;
    default: return (await import('moment/dist/locale/en-gb')).default;
    }
};
