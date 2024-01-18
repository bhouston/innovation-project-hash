# Code Flow

Scan for all projects:

Iterate through all of the subproject folders:

- For each folder, read the package.json and create a map of all projects names and map them to their package.json files.
- Calculate the localHash of the subproject folder via getting it from git.

Link together the projects:

For each project

- go through their dependences and devDependencies and peerDependencies
- If the dependency is a project in the map, then link the dependency to the project as a "localDependencies".

Calculate the hash of the root project:

- Compute the file hashes of all files in the root folder via git and combine them into a single localHash.

Calculate the merkle hash of each project:

For each project

- Calculate its merkle hash as store it as its merkleHash.

To calculate a merkle hash:

- Go through each local dependencies and get their merkle hash (which may be recursive).
- Combine those hashes with the local hash and local root hash to get the merkle has.
