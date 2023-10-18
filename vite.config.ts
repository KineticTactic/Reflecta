import { defineConfig } from "vite";
import plainText from "vite-plugin-plain-text";

export default defineConfig({
    base: "/light-playground/",
    plugins: [plainText([/\.glsl$/])],
    build: {
        minify: true,
        target: "esnext",
    },
    optimizeDeps: {
        // force: true,

        // THIS OPTION TOOK ME SO FREAKING LONG TO FIND, AND WITHOUT IT POLYLY DOESNT GET OPTIMISED
        // AND RUNS SLOWLY. But i finally found it.
        esbuildOptions: {
            target: "esnext",
        },
    },
});
