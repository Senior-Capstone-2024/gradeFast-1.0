'use strict';

import * as vscode from 'vscode';
import { NoteComment, NoteCommentController } from './noteComment';
import { findCapitalizedPrimitiveTypes } from './findCapitalizedPrimitiveTypes';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "Java convention commands" is now active!');

    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', findCapitalizedPrimitiveTypes);
	
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