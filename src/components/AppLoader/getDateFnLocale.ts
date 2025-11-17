/* eslint-disable complexity */

// Vite struggles with dynamic import paths, and import(`date-fns/locale/${locale}/index.js`) throws an error.
// Additionally, behavior differs between dev and production builds.
// For now, until dynamic imports become more reliable, I’m using a simple switch/case with static imports.
// These imports map the locales fetched from https://{instance-url}/api/{api-version}/locales/ui
// to their corresponding date-fns equivalents.
export const getDateFnLocale = async (locale) => {
    switch (locale) {
    case 'ar': return (await import('date-fns/locale/ar/index.js')).default;
    case 'ar-EG': return (await import('date-fns/locale/ar/index.js')).default;
    case 'ar-IQ': return (await import('date-fns/locale/ar/index.js')).default;
    case 'ar-SD': return (await import('date-fns/locale/ar/index.js')).default;
    case 'cs': return (await import('date-fns/locale/cs/index.js')).default;
    case 'da': return (await import('date-fns/locale/da/index.js')).default;
    case 'en': return (await import('date-fns/locale/en/index.js')).default;
    case 'es': return (await import('date-fns/locale/es/index.js')).default;
    case 'fr': return (await import('date-fns/locale/fr/index.js')).default;
    case 'id': return (await import('date-fns/locale/id/index.js')).default;
    case 'id-ID': return (await import('date-fns/locale/id/index.js')).default;
    case 'nb': return (await import('date-fns/locale/nb/index.js')).default;
    case 'nl': return (await import('date-fns/locale/nl/index.js')).default;
    case 'pt': return (await import('date-fns/locale/pt/index.js')).default;
    case 'pt-BR': return (await import('date-fns/locale/pt/index.js')).default;
    case 'ro': return (await import('date-fns/locale/ro/index.js')).default;
    case 'ru': return (await import('date-fns/locale/ru/index.js')).default;
    case 'sv': return (await import('date-fns/locale/sv/index.js')).default;
    case 'zh': return (await import('date-fns/locale/zh_cn/index.js')).default;
    case 'zh-CN': return (await import('date-fns/locale/zh_cn/index.js')).default;
    default: return (await import('date-fns/locale/en/index.js')).default;
    }
};
