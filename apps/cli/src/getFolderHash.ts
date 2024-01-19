import { type SimpleGit, simpleGit } from 'simple-git';
const git: SimpleGit = simpleGit();

export async function getFolderGitHash(folderPath: string): Promise<string> {
  // Retrieves the latest commit hash that affected any file in the specified folder
  const log = await git.log({
    file: folderPath,
    maxCount: 1
  });
  if (log && log.latest) {
    return log.latest.hash;
  }
  return '';
}
