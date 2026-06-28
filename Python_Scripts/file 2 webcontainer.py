import json
import os
from pathlib import Path


def path_to_webcontainer_json(root_path: Path) -> dict:
    """Recursively builds a WebContainer-compatible dictionary from a folder structure."""
    structure = {}

    try:
        for item in root_path.iterdir():

            if item.is_dir():
                # Recursively build the directory structure
                structure[item.name] = {
                    "directory": path_to_webcontainer_json(item)
                }
            elif item.is_file():
                try:
                    # Read file contents as text
                    contents = item.read_text(encoding="utf-8")
                    structure[item.name] = {"file": {"contents": contents}}
                except UnicodeDecodeError:
                    # Skip binary files (images, audio, etc.) as WebContainers
                    # handle them differently (usually via Uint8Array/Base64)
                    print(f"Skipping binary file: {item.relative_to(root_path)}")
    except PermissionError:
        print(f"Permission denied for directory: {root_path}")

    return structure


def generate_webcontainer_files(target_folder: str, output_json_path: str):
    """Generates a JSON file mapping the folder structure for WebContainers."""
    root = Path(target_folder)

    if not root.exists() or not root.is_dir():
        print(f"Error: The path '{target_folder}' is not a valid directory.")
        return

    print(f"Processing folder: {root.resolve()}")
    webcontainer_structure = path_to_webcontainer_json(root)

    # Write the dictionary out to a nicely formatted JSON file
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(webcontainer_structure, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated WebContainer JSON at: {output_json_path}")


# --- Example Usage ---
if __name__ == "__main__":
    # Replace with your actual project folder path
    folder_to_convert = "/home/tonmoy/Projects/open-clone-2.0/Python_Scripts/react"
    # The output JSON filename
    output_filename = "/home/tonmoy/Projects/open-clone-2.0/Python_Scripts/files.json"

    generate_webcontainer_files(folder_to_convert, output_filename)