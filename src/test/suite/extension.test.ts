import * as fs from 'fs';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as conventionHelpers from '../../helpers/conventionHelpers';
import * as Extension from '../../extension';

const testFolderLocation = '/../../../src/test/sampleWorkspace/';

suite('GradeFast Test Suite', () => {
	suiteTeardown(() => {
		vscode.window.showInformationMessage('All tests complete');
	});

	test('should find all convention errors', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'Main.java')
		);
		const document = await vscode.workspace.openTextDocument(uri);
		// const editor = await vscode.window.showTextDocument(document);
		const text = document.getText();
		// const res = conventionHelpers.findConvErrors(text);
		const [nameArray, indexArray] = conventionHelpers.findConvErrors(text);
		assert.strictEqual(indexArray[0], 122);
		assert.strictEqual(indexArray[1], 147);
		assert.strictEqual(indexArray[2], 198);
		assert.strictEqual(indexArray[3], 227);
		assert.strictEqual(nameArray[0], "int Abe");
		assert.strictEqual(nameArray[1], "String Mihai");
		assert.strictEqual(nameArray[2], "Boolean Fatma");
		assert.strictEqual(nameArray[3], "double Aravind");

		const logOut = JSON.stringify(nameArray, null, '\n') + JSON.stringify(indexArray, null, '\n');
		fs.writeFileSync('src/test/suite/logs/findConvErrors.txt', logOut);
		// assert.strictEqual(indexArray, "main");
		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});
});