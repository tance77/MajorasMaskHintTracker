module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
    ],
    theme: {

    },
    variants: {
        cursor: ['responsive', 'disabled'],
        fontWeight: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
        opacity: ['responsive', 'hover', 'focus', 'disabled'],
        textColor: ['responsive', 'hover', 'focus', 'disabled', 'group-hover', 'focus-within'],
        borderColor: ['responsive', 'hover', 'focus', 'disabled', 'last', 'group-hover'],
        borderWidth: ['responsive', 'last'],
        backgroundColor: ['responsive', 'hover', 'disabled', 'focus', 'odd', 'even'],
        placeholderColor: ['responsive', 'focus', 'disabled'],
        margin: ['responsive', 'hover', 'focus', 'first'],
    },
    plugins: [
        require("@tailwindcss/ui"),
    ],
};
