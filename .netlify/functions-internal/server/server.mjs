export { default } from "./main.mjs";
export const config = {
  name: "server handler",
  generator: "nitro@3.0.260610-beta",
  path: "/*",
  nodeBundler: "none",
  includedFiles: ["**"],
  excludedPath: ["/.netlify/*"],
  preferStatic: true,
};