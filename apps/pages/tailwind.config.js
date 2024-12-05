/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                card: '0px 0px 0px 1px rgba(3, 7, 18, 0.08), 0px 1px 2px -1px rgba(3, 7, 18, 0.08), 0px 2px 4px 0px rgba(3, 7, 18, 0.04)',
                'button-primary':
                    '0px 2px 0px 0px rgba(255, 255, 255, 0.2) inset, 2px 0px 0px 0px rgba(255, 255, 255, 0.2) inset, -2px 0px 0px 0px rgba(255, 255, 255, 0.2) inset, 0px -1px 0px 1px #000 inset, 0px 1px 0px 0px #000 inset',
            },
        },
    },
    plugins: [],
}
