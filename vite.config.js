import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,

        rollupOptions: {
            input: {
                content: "src/init.js",
            },

            output: {
                entryFileNames: "[name].js",

                assetFileNames: (assetInfo) => {
                    const nome = assetInfo.names?.[0] || "";

                    if (nome.endsWith(".css")) {
                        return "assets/[name].css";
                    }

                    return "assets/[name].[ext]";
                },
            },
        },
    },
});