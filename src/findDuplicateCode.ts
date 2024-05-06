import * as vscode from 'vscode';

export function findDuplicateCode() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const text = document.getText();
        const lines = text.split('\n');
        const duplicates: Map<string, number[]> = new Map();

        // Iterate through each line of the document
        lines.forEach((line, index) => {
            // Match method signatures
            const methodNameMatch = line.match(/\b(public|private|protected)?\s+(\w+)\s+(\w+)\s*\(/);
            if (methodNameMatch && methodNameMatch[3]) {
                const methodNameLower = methodNameMatch[3].toLowerCase();
                // Store line number in the map of duplicates
                if (duplicates.has(methodNameLower)) {
                    duplicates.get(methodNameLower)!.push(index + 1);
                } else {
                    duplicates.set(methodNameLower, [index + 1]);
                }
            }

            // Match class/interface declarations
            const classInterfaceNameMatch = line.match(/\b(class|interface)\s+(\w+)/);
            if (classInterfaceNameMatch && classInterfaceNameMatch[2]) {
                const classNameLower = classInterfaceNameMatch[2].toLowerCase();
                // Store line number in the map of duplicates
                if (duplicates.has(classNameLower)) {
                    duplicates.get(classNameLower)!.push(index + 1);
                } else {
                    duplicates.set(classNameLower, [index + 1]);
                }
            }
        });

        // Show information message with duplicate lines
        if (duplicates.size > 0) {
            let message = 'Duplicate code found on lines: ';
            // Construct message with duplicate lines
            duplicates.forEach((lineNumbers, name) => {
                message += `${name}: `;
                message += lineNumbers.map(num => num.toString()).join(', ');
                message += '; ';
            });
            message = message.slice(0, -2); // Remove the trailing space and semicolon
            vscode.window.showInformationMessage(message);
            // Highlight duplicate lines in the editor
            highlightLines(editor, duplicates);
        } else {
            vscode.window.showInformationMessage('No duplicate code found.');
        }
    }
}

/**
 * Highlights duplicate lines in the editor.
 * @param editor The active text editor.
 * @param duplicates A map containing duplicate lines.
 */
function highlightLines(editor: vscode.TextEditor, duplicates: Map<string, number[]>) {
    const document = editor.document;
    const decorations: vscode.DecorationOptions[] = [];

    // Iterate through each entry in the map of duplicates
    duplicates.forEach(lineNumbers => {
        lineNumbers.forEach(lineNumber => {
            // Get the line and range corresponding to each duplicate line number
            const line = document.lineAt(lineNumber - 1);
            const range = line.range;
            // Create decoration options for each duplicate line
            decorations.push({
                range: range,
                renderOptions: {
                    // No decoration options needed
                }
            });
        });
    });

    // Set decorations in the editor to highlight the duplicate lines
    editor.setDecorations(vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 128, 0, 0.3)'
    }), decorations);
}
