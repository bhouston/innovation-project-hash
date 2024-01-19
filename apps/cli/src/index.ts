import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getFolderGitHash } from './getFolderHash.js';
import { getPackageInfos } from './getPackageInfos.js';
import type { PackageJson } from './PackageJson.js';

const require = createRequire(import.meta.url);
const packageInfo = require('../package.json');

type CommandLineArgs = {
  root: string;
  package: string;
};

export const main = async () => {
  const argv = (await yargs(hideBin(process.argv))
    .version(packageInfo.version)
    .options({
      root: {
        type: 'string',
        default: '.',
        description: 'Path to the root of the monorepository'
      },
      package: {
        type: 'string',
        default: '.',
        description: 'Path to the package within the monorepository'
      }
    }).argv) as CommandLineArgs;

  console.log({ argv });

  console.log({ cwd: process.cwd() });

  const rootPath = path.isAbsolute(argv.root)
    ? argv.root
    : path.join(process.cwd(), argv.root);
  const rootPackageJsonPath = path.join(rootPath, 'package.json');

  const rootPackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf-8')
  ) as PackageJson;

  const packageInfos = await getPackageInfos(rootPath, rootPackageJson);
  const packageNames = packageInfos.map((p) => p.name);

  for (const packageInfo of packageInfos) {
    const { absolutePath, packageJson } = packageInfo;
    packageInfo.localHash = await getFolderGitHash(absolutePath);
    const dependencyNames = Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    });
    for (const dependency of dependencyNames) {
      if (packageNames.includes(dependency)) {
        packageInfo.localDependencyNames.push(dependency);
      }
    }
  }

  console.log(packageInfos);
};
