/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#FF6A00',
                },
            },
            fontFamily: {
                trocchi: ['Trocchi', 'serif'],
                worksans: ['Work Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
