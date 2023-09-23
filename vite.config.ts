import plainText from "vite-plugin-plain-text";

export default {
    base: "/light-playground/",
    plugins: [plainText([/\.glsl$/])],
    build: {
        minify: true,
        target: "es2022",
    },
};
