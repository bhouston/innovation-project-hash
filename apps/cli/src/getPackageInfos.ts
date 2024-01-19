import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';

import type { PackageInfo } from './PackageInfo.js';
import type { PackageJson } from './PackageJson.js';

export async function getPackageInfos(
  rootDir: string,
  rootPackageJson: PackageJson
): Promise<PackageInfo[]> {
  if (!rootPackageJson.workspaces) {
    return [];
  }

  const workspaces = rootPackageJson.workspaces;
  const subPackages: PackageInfo[] = [];

  for (const pattern of workspaces) {
    const matches = (await glob(
      path.resolve(rootDir, pattern),
      {}
    )) as string[];

    for (const match of matches) {
      const packageJsonPath = path.join(match, 'package.json');
      // Check if the path contains a package.json file
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf-8')
        ) as PackageJson;
        subPackages.push({
          name: packageJson.name || 'unknown',
          absolutePath: match,
          relativePath: path.relative(rootDir, match),
          packageJson,
          localDependencyNames: []
        });
      }
    }
  }

  return subPackages;
}
