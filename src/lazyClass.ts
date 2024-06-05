import * as vscode from 'vscode';

export function lazyClass(myMap: Map<number, string[]>): Map<number, string[]> {
	// activeTextEditor allows access to text inside opened document.
	vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED=');
	const editor = vscode.window.activeTextEditor;
	
	if (editor) {
		const document = editor.document;
		const text = document.getText();
		const pattern = /\b(?:class|interface)\s+([a-z][a-zA-Z]*)\b/g;
		let match;

		while ((match = pattern.exec(text)) !== null) {
			// Get the matched variable name
			const lineNumber = document.positionAt(match.index).line + 1; // Get the line number
			const variableName = match[0]; // Entire matched variable name
			const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after class
			const lastLetterIndex = match.index + match[0].indexOf(match[-1]); // Index of the last letter after class
			const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(lastLetterIndex));
			
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

			if(match.length == 1) {
				if (!myMap.has(lineNumber)) {
					myMap.set(lineNumber, []);
				}
				const errorMessage = "Lazy Class";
				const currentErrors = myMap.get(lineNumber) || [];
				currentErrors.push(errorMessage);
				myMap.set(lineNumber, currentErrors);
			}
		}
		
	} else {
		vscode.window.showErrorMessage('No active text editor.');
	}
	return myMap;
}