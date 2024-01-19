import type { PackageJson } from './PackageJson.js';

export type PackageInfo = {
  name: string;
  absolutePath: string;
  relativePath: string;
  packageJson: PackageJson;
  localHash?: string;
  merkleHash?: string;
  localDependencyNames: string[];
};
