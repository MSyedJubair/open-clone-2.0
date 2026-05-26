export interface FileData {
  contents: string
}

export interface TreeNode {
  directory?: { [nodeName: string]: TreeNode }
  file?: FileData
}

export interface FileSystemTree {
  [nodeName: string]: TreeNode;
}