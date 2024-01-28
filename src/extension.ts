'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';
import { JsonOutlineProvider } from './jsonOutline';
import { FtpExplorer } from './ftpExplorer';
import { FileExplorer } from './fileExplorer';
import { TestViewDragAndDrop } from './testViewDragAndDrop';
import { TestView } from './testView';


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
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

	const jsonOutlineProvider = new JsonOutlineProvider(context);
	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
	vscode.commands.registerCommand('jsonOutline.renameNode', args => {
		let offset = undefined;
		if (args.selectedTreeItems && args.selectedTreeItems.length) {
			offset = args.selectedTreeItems[0];
		} else if (typeof args === 'number') {
			offset = args;
		}
		if (offset) {
			jsonOutlineProvider.rename(offset);
		}
	});

	vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));

	// Samples of `window.createView`
	new FtpExplorer(context);
	new FileExplorer(context);

	// Test View
	new TestView(context);

	new TestViewDragAndDrop(context);
	
/*WILL EAND: THIS AREA BEGINS DEVELOPMENT ON COMMENT SYSTEM IMPLEMENTED INTO TREE SYSTEM */
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
			if (thread.contextValue === 'draft') {
				newComment.label = 'pending';
			}
	
			thread.comments = [...thread.comments, newComment];
		}

		//These two commands allow the user to create notes and delete them.

		context.subscriptions.push(vscode.commands.registerCommand('mywiki.createNote', (reply: vscode.CommentReply) => {
			replyNote(reply);
		}));

		context.subscriptions.push(vscode.commands.registerCommand('mywiki.deleteNote', (thread: vscode.CommentThread) => {
			thread.dispose();
		}));
/******************WILL_EAND_END OF COMMENT IMPLEMENTATIONS******************************/		
}