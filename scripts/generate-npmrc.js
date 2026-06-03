const fs = require("fs");
const path = require("path");

const token = process.env.NPM_TOKEN;
if (!token) {
  console.error("NPM_TOKEN env var not set. Skipping .npmrc generation.");
  process.exit(0);
}

const content = [
  "@emonnemo:registry=https://npm.pkg.github.com",
  `//npm.pkg.github.com/:_authToken=${token}`,
  "",
].join("\n");

fs.writeFileSync(path.resolve(__dirname, "..", ".npmrc"), content);
console.log(".npmrc generated from NPM_TOKEN");
