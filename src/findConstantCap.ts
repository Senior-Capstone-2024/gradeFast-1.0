import * as vscode from 'vscode';

export function findConstantCap() {
    // activeTextEditor allows access to text inside the opened document.
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const text = document.getText();
        const constantRegex = /(?<!\w)final\s+\w+\s+(\w+)\s*=/g;
        let match;
        const improperConstants = [];
        while ((match = constantRegex.exec(text))) {
            const constantName = match[1];
            if (!isValidConstantName(constantName)) {
                const constantStartPosition = document.positionAt(match.index);
                const constantEndPosition = document.positionAt(match.index + constantName.length);
                const range = new vscode.Range(constantStartPosition, constantEndPosition);
                improperConstants.push(range);
                vscode.window.showInformationMessage('Improper constant naming convention! Highlighted in RED');
            }
        }
        if (improperConstants.length > 0) {
            editor.setDecorations(improperConstantNameDecorationType, improperConstants);
        } else {
            vscode.window.showInformationMessage('All constants follow proper naming conventions!');
        }
    }
}

const improperConstantNameDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 0, 0, 0.3)'
});

function isValidConstantName(constantName: string): boolean {
    const pattern: RegExp = /^[A-Z][A-Z0-9_]*$/;
    return pattern.test(constantName);
}
