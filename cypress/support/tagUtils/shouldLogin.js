export const shouldLogin = () => {
    const { tags } = window.testState.currentScenario;
    if (!tags || !tags.length) {
        return true;
    }

    return tags
        .every(({ name }) => name !== '@skip-login');
};
