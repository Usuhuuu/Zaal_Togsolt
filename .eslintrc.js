module.exports = {
    extends: [
        "expo",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    plugins: [
        "react-hooks",
        'eslint-plugin-react-compiler'
    ],
    rules: {
        "react-hooks/rules-of-hooks": "error", // Ensures hooks are used correctly
        "react-hooks/exhaustive-deps": "warn", // Warns about missing dependencies in useEffect
        'react-compiler/react-compiler': 'error',
    },
};