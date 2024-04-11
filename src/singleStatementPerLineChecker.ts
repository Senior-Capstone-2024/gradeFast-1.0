import * as vscode from 'vscode';

export function singleStatementPerLineChecker(): number[] {
    const problematicLines: number[] = []; // Array to store line numbers with multiple semicolons

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

			if (!isForLoop){
            const semicolonCount = (lineText.match(/;/g) || []).length;
            if (semicolonCount > 1) {
                // Add the line number to the array
                problematicLines.push(lineNumber + 1); // Add 1 because line numbers start from 1
            }
        }});
    }
	vscode.window.showInformationMessage(`Problematic lines: ${problematicLines.join(', ')}`);
	return problematicLines;
    
}
