import * as vscode from 'vscode';
import * as fs from 'fs';

const outputFile = '/Users/mihaisiia/GradeFast/gradeFast-1.0/src/errorTxt';

export function findCapitalizedPrimitiveTypes(myMap: Map<number, string[]>): Map<number, string[]> {
    vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED');
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const document = editor.document;
        const text = document.getText();
        
        const pattern = /\b(?:int|double|boolean|Boolean|char|byte|long|String)\s+([A-Z])(\w*)\b/g;

        let match;
        while ((match = pattern.exec(text)) !== null) {
            const lineNumber = document.positionAt(match.index).line + 1; // Get the line number
            const myString: string = "Improper Capitalized Primitive Type on line: " + lineNumber;

            const variableName = match[0]; // Entire matched variable name
            const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after the primitive data type
            const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(firstLetterIndex + 1));
            
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

            // Update the map with the error message
            if (!myMap.has(lineNumber)) {
                myMap.set(lineNumber, []);
            }
            const errorMessage = "Improper Capitalized Primitive Type";
            const currentErrors = myMap.get(lineNumber) || [];
            currentErrors.push(errorMessage);
            myMap.set(lineNumber, currentErrors);
        }
    } else {
        vscode.window.showErrorMessage('No active text editor.');
    }

    return myMap;
}
