import * as vscode from 'vscode';
import * as fs from 'fs';

//     const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', findCapitalizedPrimitiveTypes);

const outputFile = '/Users/sealion/gradeFast-1.0/src/error_lines.txt';

export function findCapitalizedPrimitiveTypes() {
	// activeTextEditor allows access to text inside opened document.
	vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED');
	const editor = vscode.window.activeTextEditor;
	//If there is an editor inside.
	if (editor) {
		const document = editor.document;
		const text = document.getText();
		
		// 1. The expression starts and ends with `/`, marking the beginning and end of the pattern.
		// 2. `\b` ensures that the pattern matches only at word boundaries.
		// 3. `(?: ...)` groups together multiple options without capturing them separately.
		// 4. `int|double|Boolean|char|byte|long|String` are the types of variables we're looking for.
		// 5. `\s+` matches one or more spaces, tabs, or newlines after the variable type.
		// 6. `([A-Z]\w*)` captures the variable name, starting with an uppercase letter and followed by zero or more word characters.
		// 7. `\b` ensures that the variable name ends at a word boundary.
		// 8. The `/` marks the end of the pattern.
		// 9. `g` means the pattern should be applied globally to find all matches in the input text.
		
		const pattern = /\b(?:int|double|boolean|Boolean|char|byte|long|String)\s+([A-Z])(\w*)\b/g;

		const errorLines: string[] = [];
 // Array to store line numbers with errors
		// Find matches
		let match;
		while ((match = pattern.exec(text)) !== null) {
			// Get the matched variable name

			let lineNumber = document.positionAt(match.index).line;
			lineNumber = lineNumber+1;
			let myString: string = lineNumber.toString();
			myString = "Improper Capitalized Primitive Type on line: " + myString;
            errorLines.push(myString);
		
			const variableName = match[0]; // Entire matched variable name
			const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after the primitive data type
			const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(firstLetterIndex + 1));
			
			// Highlight the first letter after the primitive data type
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
		fs.writeFileSync(outputFile, errorLines.join('\n'));
	} else {
		vscode.window.showErrorMessage('No active text editor.');
	}
}