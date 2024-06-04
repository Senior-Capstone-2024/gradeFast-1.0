import * as vscode from 'vscode';

export function longMethod(myMap: Map<number, string[]>): Map<number, string[]> {
    // Check for active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor.');
        return myMap; // Early return if no editor
    }

    // Get the document text
    const document = editor.document;
    const text = document.getText();

    // Pattern to identify method definitions
    const methodPattern = /(\b(?:public|protected|private|static|\s)+[^\s]+\s+[^\s]+\s*\([^)]*\)\s*{)/g;

    let match;
    while ((match = methodPattern.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const startLine = startPos.line;

        // Count the number of lines in the method
        const methodLines = countMethodLines(document, startLine);

        if (methodLines > 10) {
            const errorMessage = "Code Smell: Consider refactoring to reduce method length";
            if (!myMap.has(startLine)) {
                myMap.set(startLine, []);
            }
            const currentErrors = myMap.get(startLine) || [];
            currentErrors.push(errorMessage);
            myMap.set(startLine, currentErrors);
        }
    }

    return myMap;
}

// Helper function to count method lines
function countMethodLines(document: vscode.TextDocument, startLine: number): number {
    let lineNumber = startLine;
    let methodOpen = true;
    let openBraces = 0;
    let closeBraces = 0;

    while (lineNumber < document.lineCount && methodOpen) {
        const lineText = document.lineAt(lineNumber).text.trim();
        openBraces += (lineText.match(/{/g) || []).length;
        closeBraces += (lineText.match(/}/g) || []).length;

        if (closeBraces > 0 && openBraces === closeBraces) {
            methodOpen = false;
        }

        lineNumber++;
    }

    return lineNumber - startLine;
}
