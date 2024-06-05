import * as vscode from 'vscode';

export function cursorPosition() {
	const editor = vscode.window.activeTextEditor;
	if (editor === undefined) {
		return;
	}
	const doc = editor.document;
	const position = editor.selection.active;
	return doc.lineAt(position);
}