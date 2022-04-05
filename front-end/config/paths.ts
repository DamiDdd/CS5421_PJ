import fs from "fs";
import path from "path";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = process.env.PUBLIC_URL || "/";

export default {
  dotenv: resolveApp(".env"),
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appSrc: resolveApp("src"),
  appIndexJs: resolveApp("src/index"),
  appNodeModules: resolveApp("node_modules"),
  publicUrlOrPath,
};
