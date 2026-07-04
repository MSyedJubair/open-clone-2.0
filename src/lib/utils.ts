import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileSystemTree } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(timestamp: string | number | Date) {
  const seconds = Math.floor((+new Date() - +new Date(timestamp)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function convertToWebContainerFormat(flatFiles: Record<string, string>): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [filePath, contents] of Object.entries(flatFiles)) {
    // Split the path and remove any empty strings (e.g., from leading slashes)
    const parts = filePath.split('/').filter(Boolean);
    let currentLevel = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;

      if (isLastPart) {
        // It's a file
        currentLevel[part] = {
          file: {
            contents: contents
          }
        };
      } else {
        // It's a directory
        if (!currentLevel[part]) {
          currentLevel[part] = {
            directory: {}
          };
        }
        // Move down a level into the directory
        currentLevel = currentLevel[part].directory ?? {};
      }
    }
  }

  return tree;
}

export const getLanguageFromFileName = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "js":
      return "javascript";

    case "ts":
      return "typescript";

    case "jsx":
      return "javascript";

    case "tsx":
      return "typescript";

    case "html":
      return "html";

    case "css":
      return "css";

    case "scss":
      return "scss";

    case "json":
      return "json";

    case "md":
      return "markdown";

    case "py":
      return "python";

    case "java":
      return "java";

    case "c":
      return "c";

    case "cpp":
      return "cpp";

    case "cs":
      return "csharp";

    case "php":
      return "php";

    case "rb":
      return "ruby";

    case "go":
      return "go";

    case "rs":
      return "rust";

    case "sql":
      return "sql";

    case "xml":
      return "xml";

    case "yml":
    case "yaml":
      return "yaml";

    case "sh":
      return "shell";

    default:
      return "plaintext";
  }
};

export const getStatusStyles = (status?: string) => {
  if (!status) return { text: "text-zinc-500", dot: "bg-zinc-500" }

  switch (status) {
    case "COMPLETED":
      return { text: "text-[var(--color-status-live)]", dot: "bg-[var(--color-status-live)]" }
    case "LIVE":
      return { text: "text-[var(--color-status-live)]", dot: "bg-[var(--color-status-live)]" }
    case "DRAFT":
      return { text: "text-[var(--color-status-draft)]", dot: "bg-[var(--color-status-draft)]" }
    default:
      return { text: "text-[var(--color-status-token)]", dot: "bg-[var(--color-status-token)]" }
  }
}