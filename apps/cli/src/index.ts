import * as fs from 'fs';
import { glob } from 'glob';
import { createRequire } from 'module';
import * as path from 'path';
import { type SimpleGit, simpleGit } from 'simple-git';
import { promisify } from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const globPromise = promisify(glob);

type PackageJson = {
  name?: string;
  version?: string;
  workspaces?: string[];
  dependences?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type Package = {
  name: string;
  path: string;
  packageJson: PackageJson;
};

async function getPackages(
  rootDir: string,
  rootPackageJson: PackageJson
): Promise<Package[]> {
  if (!rootPackageJson.workspaces) {
    return [];
  }

  const workspaces = rootPackageJson.workspaces;
  const subPackages: Package[] = [];

  for (const pattern of workspaces) {
    // Resolve the glob pattern to actual paths
    const matches = (await globPromise(
      path.resolve(rootDir, pattern),
      {}
    )) as string[];

    for (const match of matches) {
      const packageJsonPath = path.join(match, 'package.json');
      // Check if the path contains a package.json file
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath) as PackageJson;
        subPackages.push({
          name: packageJson.name || 'unknown',
          path: match,
          packageJson
        });
      }
    }
  }

  return subPackages;
}

const git: SimpleGit = simpleGit();

async function getFolderGitHash(folderPath: string): Promise<string | null> {
  // Retrieves the latest commit hash that affected any file in the specified folder
  const log = await git.log({ 'max-count': 1, _: [folderPath] });
  if (log && log.latest) {
    return log.latest.hash;
  }
  return null;
}

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

  console.log(argv);

  const rootPackage = require(`${argv.root}/package.json`) as PackageJson;
  const packages = await getPackages(argv.root, rootPackage);
};
