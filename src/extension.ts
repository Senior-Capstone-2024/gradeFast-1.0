'use strict';

import * as vscode from 'vscode';


//This class is a NoteComment object that is used inside the commentController API.
let commentId = 1;

class NoteComment implements vscode.Comment {
	id: number;
	label: string | undefined;
	savedBody: string | vscode.MarkdownString; // for the Cancel button
	constructor(
		public body: string | vscode.MarkdownString,
		public mode: vscode.CommentMode,
		public author: vscode.CommentAuthorInformation,
		public parent?: vscode.CommentThread,
		public contextValue?: string
	) {
		this.id = ++commentId;
		this.savedBody = this.body;
	}
}

export function activate(context: vscode.ExtensionContext) {

	
	const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
	context.subscriptions.push(commentController);
		// A `CommentingRangeProvider` controls where gutter decorations that allow adding comments are shown
		commentController.commentingRangeProvider = {
			provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
				const lineCount = document.lineCount;
				return [new vscode.Range(0, 0, lineCount - 1, 0)];
			}
		};

		function replyNote(reply: vscode.CommentReply) {
            const thread = reply.thread;
            const newComment = new NoteComment(reply.text, vscode.CommentMode.Preview, { name: 'vscode' }, thread, thread.comments.length ? 'canDelete' : undefined);
            thread.canReply = false;
            thread.comments = [...thread.comments, newComment];
        }

		//These two commands allow the user to create notes and delete them.

		context.subscriptions.push(vscode.commands.registerCommand('mywiki.createNote', (reply: vscode.CommentReply) => {
			replyNote(reply);
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mywiki.deleteNote', (thread: vscode.CommentThread) => {
			thread.dispose();
		}));
	
}