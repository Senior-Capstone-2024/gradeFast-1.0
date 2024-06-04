'use strict';

import * as vscode from 'vscode';
import { NoteCommentController } from './noteComment';
import { findCapitalizedPrimitiveTypes } from './findCapitalizedPrimitiveTypes';
import { findLowercaseClassOrInterface } from './findLowercaseClassOrInterface';
import { findCapitalizedMethodName } from './findCapitalizedMethodName';
import { singleStatementPerLineChecker } from './singleStatementPerLineChecker';
import { findAllErrors } from './findAllErrors';
import { convertMapToJson } from './convertMapToJson';
import { findDuplicateCode } from './findDuplicateCode';
import { findLowercaseEnums } from './findLowercaseEnums';
import { findConstantCap} from './findConstantCap';

const myMap: Map<number, string[]> = new Map();
const filePath = '/Users/mihaisiia/GradeFast/gradeFast-1.0/output/data.json';


export function activate(context: vscode.ExtensionContext) {
    vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
    
    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', () => {
        findCapitalizedPrimitiveTypes(myMap);
        convertMapToJson(myMap, filePath);
    });

    const disposable2 = vscode.commands.registerCommand('extension.findCapitalizedMethodName', () => {
        findCapitalizedMethodName(myMap);
    } );

    const disposable1 = vscode.commands.registerCommand('extension.findLowercaseClassOrInterface', () => {
        findLowercaseClassOrInterface(myMap);
    } );
    
    const disposable3 = vscode.commands.registerCommand('extension.singleStatementPerLineChecker', () => {
        singleStatementPerLineChecker(myMap);
    } );

    const disposable4 = vscode.commands.registerCommand('extension.findDuplicateCode', findDuplicateCode);

    const disposable5 = vscode.commands.registerCommand('extension.findLowercaseEnums', () => {
        findLowercaseEnums(myMap);
    } );

    const disposable0 = vscode.commands.registerCommand('extension.findAllErrors', findAllErrors);

    const disposable6 = vscode.commands.registerCommand('extension.findConstantCap', findConstantCap);

    const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
    context.subscriptions.push(commentController);

    commentController.commentingRangeProvider = {
        provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
            const lineCount = document.lineCount;
            return [new vscode.Range(0, 0, lineCount - 1, 0)];
        }
    };

    NoteCommentController.registerCommands(context);
}
