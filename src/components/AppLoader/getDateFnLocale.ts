/* eslint-disable complexity */

// Vite struggles with dynamic import paths, and in our case import(`date-fns/locale/${locale}/index.js`) throws an error.
// Vite’s recommended solution is import.meta.glob, but using it on node_modules would significantly bloat the bundle, so it’s best to avoid it.
// Therefore, I opt to use a switch/case with static imports to load only the locale we need.
export const getDateFnLocale = async (locale) => {
    switch (locale) {
    case 'ar': return (await import('date-fns/locale/ar/index.js')).default;
    case 'be': return (await import('date-fns/locale/be/index.js')).default;
    case 'bg': return (await import('date-fns/locale/bg/index.js')).default;
    case 'ca': return (await import('date-fns/locale/ca/index.js')).default;
    case 'cs': return (await import('date-fns/locale/cs/index.js')).default;
    case 'da': return (await import('date-fns/locale/da/index.js')).default;
    case 'de': return (await import('date-fns/locale/de/index.js')).default;
    case 'el': return (await import('date-fns/locale/el/index.js')).default;
    case 'en': return (await import('date-fns/locale/en/index.js')).default;
    case 'eo': return (await import('date-fns/locale/eo/index.js')).default;
    case 'es': return (await import('date-fns/locale/es/index.js')).default;
    case 'fi': return (await import('date-fns/locale/fi/index.js')).default;
    case 'fil': return (await import('date-fns/locale/fil/index.js')).default;
    case 'fr': return (await import('date-fns/locale/fr/index.js')).default;
    case 'hr': return (await import('date-fns/locale/hr/index.js')).default;
    case 'hu': return (await import('date-fns/locale/hu/index.js')).default;
    case 'id': return (await import('date-fns/locale/id/index.js')).default;
    case 'is': return (await import('date-fns/locale/is/index.js')).default;
    case 'it': return (await import('date-fns/locale/it/index.js')).default;
    case 'ja': return (await import('date-fns/locale/ja/index.js')).default;
    case 'ko': return (await import('date-fns/locale/ko/index.js')).default;
    case 'mk': return (await import('date-fns/locale/mk/index.js')).default;
    case 'nb': return (await import('date-fns/locale/nb/index.js')).default;
    case 'nl': return (await import('date-fns/locale/nl/index.js')).default;
    case 'pl': return (await import('date-fns/locale/pl/index.js')).default;
    case 'pt': return (await import('date-fns/locale/pt/index.js')).default;
    case 'ro': return (await import('date-fns/locale/ro/index.js')).default;
    case 'ru': return (await import('date-fns/locale/ru/index.js')).default;
    case 'sk': return (await import('date-fns/locale/sk/index.js')).default;
    case 'sl': return (await import('date-fns/locale/sl/index.js')).default;
    case 'sr': return (await import('date-fns/locale/sr/index.js')).default;
    case 'sv': return (await import('date-fns/locale/sv/index.js')).default;
    case 'th': return (await import('date-fns/locale/th/index.js')).default;
    case 'tr': return (await import('date-fns/locale/tr/index.js')).default;
    case 'zh_cn': return (await import('date-fns/locale/zh_cn/index.js')).default;
    case 'zh_tw': return (await import('date-fns/locale/zh_tw/index.js')).default;
    default: return (await import('date-fns/locale/en/index.js')).default;
    }
};
