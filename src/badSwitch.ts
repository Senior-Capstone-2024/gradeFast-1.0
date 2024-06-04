import * as vscode from 'vscode';

export function badSwitch(myMap: Map<number, string[]>) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor.');
        return myMap; // Early return if no editor
    }

    let text = editor.document.getText();
    // Regex to match Java switch statements
    let switchRegex = /switch\s*\(([^)]+)\)\s*{([^}]*)}/g;
    let match;
    while ((match = switchRegex.exec(text))) {
        let switchCases = match[2].split('case').slice(1);
        if (switchCases.length >= 3) {
            let lineIndex = editor.document.positionAt(match.index).line;
            let errorMessage = `Code smell found: Switch statement with ${switchCases.length} cases`;
            if (!myMap.has(lineIndex)) {
                myMap.set(lineIndex, [errorMessage]);
            } else {
                myMap.get(lineIndex)?.push(errorMessage);
            }

            // Initialize character array for each case
            let charArrays: number[][] = [];
            for (let i = 0; i < switchCases.length; i++) {
                let caseCharArray = new Array(26).fill(0);
                let caseLines = switchCases[i].split('\n').map(line => line.trim().toLowerCase());
                for (let line of caseLines) {
                    for (let char of line) {
                        if (char >= 'a' && char <= 'z') {
                            let index = char.charCodeAt(0) - 'a'.charCodeAt(0);
                            caseCharArray[index]++;
                        }
                    }
                }
                charArrays.push(caseCharArray);
            }

            // Compare each case to every other case at least once
            for (let i = 0; i < charArrays.length; i++) {
                for (let j = i + 1; j < charArrays.length; j++) {
                    let similarity = calculateSimilarity(charArrays[i], charArrays[j]);
                    if (similarity >= 0.8) { // Adjust similarity threshold as needed
                        let similarLogicMessage = `Similar logic found in switch cases based on character usage`;
                        if (!myMap.get(lineIndex)?.includes(similarLogicMessage)) {
                            myMap.get(lineIndex)?.push(similarLogicMessage);
                        }
                        break; // Exit inner loop if similar logic found
                    }
                }
            }
        }
    }

    return myMap;
}

function calculateSimilarity(arr1: number[], arr2: number[]): number {
    let similarity = 0;
    for (let i = 0; i < 26; i++) {
        similarity += Math.min(arr1[i], arr2[i]);
    }
    return similarity / arr1.reduce((a, b) => a + b, 0); // Normalize by total characters in the first case
}