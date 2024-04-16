'use strict';

import * as vscode from 'vscode';
import { NoteComment, NoteCommentController } from './noteComment';
import { findCapitalizedPrimitiveTypes } from './findCapitalizedPrimitiveTypes';
import { findLowercaseClassOrInterface } from './findLowercaseClassOrInterface';
import { findCapitalizedMethodName } from './findCapitalizedMethodName';
import { singleStatementPerLineChecker } from './singleStatementPerLineChecker';
import { findAllErrors } from './findAllErrors';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "Java convention commands" is now active!');

    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', findCapitalizedPrimitiveTypes);
    const disposable1 = vscode.commands.registerCommand('extension.findLowercaseClassOrInterface', findLowercaseClassOrInterface);
    const disposable2 = vscode.commands.registerCommand('extension.findCapitalizedMethodName', findCapitalizedMethodName);
    const disposable3 = vscode.commands.registerCommand('extension.singleStatementPerLineChecker', singleStatementPerLineChecker);
    const disposable0 = vscode.commands.registerCommand('extension.findAllErrors', findAllErrors);

    
    const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
    context.subscriptions.push(commentController);
        // A `CommentingRangeProvider` controls where gutter decorations that allow adding comments are shown
        commentController.commentingRangeProvider = {
            provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
                const lineCount = document.lineCount;
                return [new vscode.Range(0, 0, lineCount - 1, 0)];
            }
        };
        
    NoteCommentController.registerCommands(context);  // Registers functions from NoteCommentController
        
    
}