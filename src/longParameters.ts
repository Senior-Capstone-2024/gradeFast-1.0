import * as vscode from 'vscode';

export function longParameters(myMap: Map<number, string[]>): Map<number, string[]> {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor.');
        return myMap; // Early return if no editor
    }

    let text = editor.document.getText();
    // Updated regex to match Java method declarations with 3 or more parameters and exclude main method and methods with 1 or 2 parameters
    let methodRegex = /(\b(?:public|private|protected|static|\s)+[\w<>]+\s+(\w+)\s*\(([^)]+)\)\s*{)/g;
    let match;
    while ((match = methodRegex.exec(text))) {
        let methodName = match[1];
        let parameters = match[3].split(',').map(param => param.trim());
        if (methodName !== 'main' && parameters.length >= 3) {
            let lineIndex = editor.document.positionAt(match.index).line;
            let errorMessage = `Code smell found: Long Parameters in method ${methodName}`;
            if (!myMap.has(lineIndex)) {
                myMap.set(lineIndex, [errorMessage]);
            } else {
                myMap.get(lineIndex)?.push(errorMessage);
            }
        }
    }

    return myMap;
}