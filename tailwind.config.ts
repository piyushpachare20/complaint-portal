import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#EA580C',
                    50: '#FEF3F2',
                    100: '#FEE7E5',
                    200: '#FDD4CE',
                    300: '#FCB1A7',
                    400: '#F87E70',
                    500: '#EA580C',
                    600: '#DB4A09',
                    700: '#B73D08',
                    800: '#943106',
                    900: '#792905',
                },
            },
        },
    },
    plugins: [],
};

export default config;
