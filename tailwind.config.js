module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
    ],
    theme: {
        customForms: theme => ({
            default:{
                'input, textarea, multiselect, select': {
                    borderWidth: theme('borderWidth.2'),
                },
            },
            sm: {
                'input, textarea, multiselect, select': {
                    fontSize: theme('fontSize.sm'),
                    borderWidth: theme('borderWidth.2'),
                    padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
                },
                select: {
                    paddingRight: `${theme('spacing.4')}`,
                },
                'checkbox, radio': {
                    width: theme('spacing.3'),
                    height: theme('spacing.3'),
                },
            },
        }),
    },
    plugins: [
        require("@tailwindcss/ui"),
        require("@tailwindcss/custom-forms"),
    ],
};
