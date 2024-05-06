import * as vscode from 'vscode';

export function findCapitalizedMethodName(myMap: Map<number, string[]>): Map<number, string[]> {
	// activeTextEditor allows access to text inside the opened document.
    const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const javaMethodRegex = /(?:public|private|protected)\s+\w+\s+(\w+)\s*\(/g;
            let match;
            const improperMethodNames = [];
            while ((match = javaMethodRegex.exec(text))) {
                const methodName = match[1];
                const lineNumber = document.positionAt(match.index).line + 1; // Get the line number
                if (!isValidMethodName(methodName)) {
                    const methodStartPosition = document.positionAt(match.index);
                    const methodEndPosition = document.positionAt(match.index + methodName.length);
                    const range = new vscode.Range(methodStartPosition, methodEndPosition);
                    improperMethodNames.push(range);
                    vscode.window.showInformationMessage('Java Method Name Convention Mistake!! Highlighted in RED');
                }
                if (!myMap.has(lineNumber)) {
                    myMap.set(lineNumber, []);
                }
                const errorMessage = "Improper Method Name";
                const currentErrors = myMap.get(lineNumber) || [];
                currentErrors.push(errorMessage);
                myMap.set(lineNumber, currentErrors);
            }
        }
        return myMap;
    }

    const improperMethodNameDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.3)'
    });



function isValidMethodName(methodName: string): boolean {
    // Define a regular expression pattern to match the method naming convention
    const pattern = /^[a-z][a-zA-Z0-9]*$/;
    // Check if the method name matches the pattern
    return pattern.test(methodName);
}
