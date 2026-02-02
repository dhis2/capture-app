export function isLangRtl(): boolean {
    return typeof document !== 'undefined' && document.documentElement?.getAttribute('dir') === 'rtl';
}
