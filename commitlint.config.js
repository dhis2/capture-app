module.exports = {
    extends: ['@commitlint/config-conventional'],
    ignores: [message => /^bump \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
};
