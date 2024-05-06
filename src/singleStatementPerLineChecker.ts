import * as vscode from 'vscode';

export function singleStatementPerLineChecker(myMap: Map<number, string[]>): Map<number, string[]> {
    

    // Get the currently active text editor
    const editor = vscode.window.activeTextEditor;

    // If there is an active text editor
    if (editor) {
        const document = editor.document;
        const text = document.getText();

        // Split the text into an array of lines
        const lines = text.split('\n');

        lines.forEach((lineText, lineNumber) => {

            const isForLoop = /^\s*for\s*\([^;]*;[^;]*;[^;]*\)\s*{/i.test(lineText);

            if (!isForLoop) {
                const semicolonCount = (lineText.match(/;/g) || []).length;
                if (semicolonCount > 1) {     

                    // Error handling logic
                    if (!myMap.has(lineNumber + 1)) {
                        myMap.set(lineNumber + 1, []);
                    }
                    const errorMessage = "Too many statements on this line, revise";
                    const currentErrors = myMap.get(lineNumber + 1) || [];
                    currentErrors.push(errorMessage);
                    myMap.set(lineNumber + 1, currentErrors);
                }
            }
        });
    }
    return myMap;
}
