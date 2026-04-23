const esbuild = require("esbuild");

const external = [
  "@minecraft/server",
  "@minecraft/server-ui"
];

esbuild
  .build({
    entryPoints: ["src/Main.ts"],
    outfile: "scripts/bundle.js",
    bundle: true,
    minify: true,
    format: "esm",
    external,
  })
  .then(() => {
    console.log("Bundling finished!");
  })
  .catch((error) => {
    console.error(error);
  });