module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
    ],
    theme: {
        extend: {
            gridTemplateRows: {
                '7': 'repeat(7, minmax(0, 1fr))',
                '8': 'repeat(8, minmax(0, 1fr))',
                '9': 'repeat(9, minmax(0, 1fr))',
                '10': 'repeat(10, minmax(0, 1fr))',
                '20': 'repeat(20, minmax(0, 1fr))'
            }
        }
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
