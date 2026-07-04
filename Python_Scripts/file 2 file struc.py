import json
from pathlib import Path


def folder_to_flat_dict(root_path: Path) -> dict:
    """Builds a flat dictionary mapping relative file paths to their contents."""
    structure = {}

    # rglob('*') recursively iterates through all files and folders
    for item in root_path.rglob('*'):
        if item.is_file():
            try:
                # Get the path relative to the root folder
                relative_path = str(item.relative_to(root_path))
                
                # Ensure forward slashes for paths, even on Windows
                relative_path = relative_path.replace('\\', '/')
                
                # Read file contents as text
                contents = item.read_text(encoding="utf-8")
                structure[relative_path] = contents
                
            except UnicodeDecodeError:
                # Skip binary files (images, audio, etc.)
                print(f"Skipping binary file: {relative_path}")
            except PermissionError:
                print(f"Permission denied for file: {relative_path}")

    return structure


def generate_flat_json(target_folder: str, output_json_path: str):
    """Generates a JSON file mapping flat paths to contents."""
    root = Path(target_folder)

    if not root.exists() or not root.is_dir():
        print(f"Error: The path '{target_folder}' is not a valid directory.")
        return

    print(f"Processing folder: {root.resolve()}")
    flat_structure = folder_to_flat_dict(root)

    # Write the dictionary out to a nicely formatted JSON file
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(flat_structure, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated flat JSON at: {output_json_path}")


# --- Example Usage ---
if __name__ == "__main__":
    # Replace with your actual project folder path
    folder_to_convert = "/home/tonmoy/Projects/open-clone-2.0/Python_Scripts/react"
    # The output JSON filename
    output_filename = "/home/tonmoy/Projects/open-clone-2.0/Python_Scripts/files.json"

    generate_flat_json(folder_to_convert, output_filename)