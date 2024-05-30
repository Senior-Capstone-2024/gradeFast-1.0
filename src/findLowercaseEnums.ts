import * as vscode from 'vscode';

export function findLowercaseEnums(myMap: Map<number, string[]>): Map<number, string[]> {
    // activeTextEditor allows access to text inside opened document.
    vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED=');
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const document = editor.document;
        const text = document.getText();

        const pattern = /\b(?:enum)\s+([a-z][a-zA-Z]*)\b/g;

        let match;
        while ((match = pattern.exec(text)) !== null) {
            // Get the matched variable name
            const variableName = match[0]; // Entire matched variable name
            const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after enum

            // Store the index where the error is found
            myMap.set(firstLetterIndex, [variableName]);

            // Update the map with the error message
            const lineNumber = document.positionAt(firstLetterIndex).line+1;
            const errorMessage = "Lowercase ENUM found!";
            if (!myMap.has(lineNumber)) {
                myMap.set(lineNumber, [errorMessage]);
            } else {
                const currentErrors = myMap.get(lineNumber) || [];
                currentErrors.push(errorMessage);
                myMap.set(lineNumber, currentErrors);
            }

            // Print out "Lowercase ENUM found!"
            console.log("Lowercase ENUM found!");

            const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(firstLetterIndex + 1));

            // Highlight the first letter after the enum name 
            editor.setDecorations(vscode.window.createTextEditorDecorationType({
                isWholeLine: false,
                borderWidth: '1px',
                borderStyle: 'solid',
                overviewRulerColor: 'red',
                overviewRulerLane: vscode.OverviewRulerLane.Right,
                light: {
                    borderColor: 'darkred',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                },
                dark: {
                    borderColor: 'lightred',
                    backgroundColor: 'rgba(255, 0, 0, 0.4)'
                }
            }), [firstLetterRange]);
        }
    } else {
        vscode.window.showErrorMessage('No active text editor.');
    }
    return myMap;
}
