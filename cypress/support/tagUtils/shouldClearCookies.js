export const shouldClearCookies = () => {
    const { tags } = window.testState.pickle;

    if (!tags || !tags.length) {
        return false;
    }

    return tags
        .some(({ name }) => name === '@skip-login');
};
