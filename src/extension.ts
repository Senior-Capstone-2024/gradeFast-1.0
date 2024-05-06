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


const myMap: Map<number, string[]> = new Map();
const filePath = "/Users/willscomputer/Desktop/abc/gradeFast-1.0/output/data.json";

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', () => {
        findCapitalizedPrimitiveTypes(myMap);
        convertMapToJson(myMap, filePath);
    });

    const disposable1 = vscode.commands.registerCommand('extension.findLowercaseClassOrInterface', findLowercaseClassOrInterface);
    const disposable2 = vscode.commands.registerCommand('extension.findCapitalizedMethodName', findCapitalizedMethodName);
    const disposable3 = vscode.commands.registerCommand('extension.singleStatementPerLineChecker', singleStatementPerLineChecker);
    const disposable0 = vscode.commands.registerCommand('extension.findAllErrors', findAllErrors);
    const disposable4 = vscode.commands.registerCommand('extension.findDuplicateCode', findDuplicateCode);

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
