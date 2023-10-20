export const shouldLogin = () => {
    const { tags } = window.testState.pickle;

    if (!tags || !tags.length) {
        return true;
    }

    return tags
        .every(({ name }) => name !== '@skip-login');
};
