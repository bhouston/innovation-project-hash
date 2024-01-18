// Example usage
const rootPackageJsonPath = 'path/to/your/root/package.json';
findSubPackages(rootPackageJsonPath)
  .then((subPackages) => console.log('Sub-packages:', subPackages))
  .catch((error) => console.error(error));
