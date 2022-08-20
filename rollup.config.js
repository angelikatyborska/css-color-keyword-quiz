import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import copy from "rollup-plugin-copy";

const production = !process.env.ROLLUP_WATCH;

function generateHtmlPlugin() {
  return {
    name: "generate-html",
    generateBundle(output, bundle) {
      const jsFile = Object.keys(bundle).find(x => x.endsWith(".js"));
      const cssFile = Object.keys(bundle).find(x => x.endsWith(".css"));
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1'>

  <title>CSS Color Quiz</title>
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@atyborska93" />
  <meta property="twitter:image" content="https://css-color-quiz.angelika.me/og-image.png" />
  <meta property="og:url" content="https://css-color-quiz.angelika.me/" />
  <meta property="og:title" content="CSS Color Quiz" />
  <meta property="og:description" content="CSS Color Quiz is a quiz game about guessing color names based on the CSS color keywords." />
  <meta property="og:image" content="https://css-color-quiz.angelika.me/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <link rel='icon' type='image/png' href='/favicon.png'>
  <link rel='stylesheet' href='/global.css'>
  <link rel='stylesheet' href='/${cssFile}'>

  <script defer src='/${jsFile}'></script>
</head>

<body>
</body>
</html>`
      });
    }
  };
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

function hashFixCSS(options) {
  const plugin = css(options);
  const originalGenerateBundle = plugin.generateBundle;
  const name = options.output;
  let source;
  options.output = s => (source = s);
  plugin.generateBundle = function(opts, bundle) {
    originalGenerateBundle.call(this, opts, bundle);
    this.emitFile({ type: "asset", name, source });
  };
  return plugin;
}

export default {
  input: {
    bundle: "src/main.ts",
  },
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    dir: "build/",
    entryFileNames: production ? "[name]-[hash].js" : "[name].js",
    assetFileNames: production ? "[name]-[hash][extname]" : "[name][extname]",
  },
  plugins: [
    svelteSVG({
      svgo: {}
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    hashFixCSS({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"]
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    json(),
    copy({
      targets: [
        { src: "public/**/*", dest: "build/" },
      ]
    }),
    generateHtmlPlugin(),
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("build"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
