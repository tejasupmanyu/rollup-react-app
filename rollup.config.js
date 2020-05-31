import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import scss from "rollup-plugin-scss";

const isProd = process.env.NODE_ENV === "production";
const extensions = [".js", ".ts", ".tsx"];

export default {
  input: "src/index.tsx",
  output: {
    file: "public/bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      ),
    }),
    resolve({
      extensions,
    }),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      extensions,
      babelHelpers: "bundled",
      exclude: /node_modules/,
    }),
    html({
      fileName: "index.html",
      title: "React Rollup App",
      template: ({ title }) => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/bundle.css">
  <title>${title}</title>
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
</html>
`;
      },
    }),
    scss({
      output: "public/bundle.css",
    }),
    !isProd &&
      serve({
        host: "localhost",
        port: 3000,
        open: true,
        contentBase: ["public"],
      }),
    !isProd &&
      livereload({
        watch: "public",
      }),
  ],
};
