"use client";

import DirectoryContext from "@/context/DirectoryContext";
import Editor from "@monaco-editor/react";
import { useContext } from "react";
import { FileCode2, FileText } from "lucide-react";
import { getLanguageFromFileName } from "@/lib/utils";

export default function MonacoEditor() {
  const context = useContext(DirectoryContext);

  const currentCode = context?.fileCode || "";
  const currentFile = context?.filePath || "";

  const fileName = currentFile.split("/").pop();

  const language = getLanguageFromFileName(fileName || "");

  return (
    <div className="h-full w-full rounded-xl border bg-background overflow-hidden flex flex-col">
      
      <div className="h-12 border-b bg-muted/40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-medium text-foreground">
            {fileName || "No file selected"}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          Monaco Editor
        </div>
      </div>

      <div className="flex-1 bg-[#1e1e1e]">
        {currentCode === "" ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="p-4 rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="mb-20 flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold">
                  No File Selected
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Select a file from the explorer to start editing
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            language={language}
            value={currentCode}
            theme="vs-dark"
            onChange={(value) =>
              context?.setFileCode?.(value || "")
            }
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: {
                top: 16,
              },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  );
}