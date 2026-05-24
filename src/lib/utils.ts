import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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