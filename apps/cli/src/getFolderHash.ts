// Example usage
const folder = 'path/to/your/sub-package';
getLatestCommitHashForFolder(folder)
  .then((hash) => console.log('Latest commit hash:', hash))
  .catch((error) => console.error(error));
