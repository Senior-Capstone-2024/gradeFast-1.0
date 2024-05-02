import * as vscode from 'vscode';

export function findLowercaseEnums() {
	// activeTextEditor allows access to text inside opened document.
	vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED=');
	const editor = vscode.window.activeTextEditor;
	
	if (editor) {
		const document = editor.document;
		const text = document.getText();
		
		// 1. The expression starts and ends with `/`, marking the beginning and end of the pattern.
		// 2. `\b` ensures that the pattern matches only at word boundaries.
		// 3. `(?:class|interface)` matches the word 'class' or 'interface'.
		// 4. `\s+` matches one or more spaces, tabs, or newlines after the variable type.
		// 5. `([a-z][a-zA-Z]*)` captures the class name where `[a-z]` is for first lowercase and `[[a-zA-Z]*` is for all letters following. 
		// 6. `\b` ensures that the variable name ends at a word boundary.
		// 7. The `/` marks the end of the pattern.
		// 8. `g` means the pattern should be applied globally to find all matches in the input text.
		// const pattern = /\bclass\s+([a-z][a-zA-Z]*)\b/g;
		const pattern = /\b(?:enum)\s+([a-z][a-zA-Z]*)\b/g;
		
		let match;
		while ((match = pattern.exec(text)) !== null) {
			// Get the matched variable name
		
			const variableName = match[0]; // Entire matched variable name
			const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after class
			const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(firstLetterIndex + 1));
			
			// Highlight the first letter after the class name 
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
}