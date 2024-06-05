import { userInfo } from 'os';
import * as vscode from 'vscode';
import { cursorPosition } from './cursorPosition';

//This class is a NoteComment object that is used inside the commentController API.
// let commentId = 1;

class NoteComment implements vscode.Comment {
	id: number;
	label: string | undefined;
	savedBody: string | vscode.MarkdownString; // for the Cancel button
	constructor(
		public commentId: number,
		public body: string | vscode.MarkdownString,
		public mode: vscode.CommentMode,
		public author: vscode.CommentAuthorInformation,
		public parent?: vscode.CommentThread,
		public contextValue?: string
	) {
		this.id = commentId;
		this.savedBody = this.body;
	}
}

class NoteCommentController {
	private static replyNote(reply: vscode.CommentReply) {
        const thread = reply.thread;
        const newComment = new NoteComment(reply.thread.range.end.line, reply.text, vscode.CommentMode.Preview, { name: userInfo().username }, thread, thread.comments.length ? 'canDelete' : undefined);
        thread.canReply = false;
        thread.comments = [...thread.comments, newComment];
				console.log(newComment.id);
				// console.log(cursorPosition());
    }
	
	//These two commands allow the user to create notes and delete them.
	static registerCommands(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('mywiki.createNote', (reply: vscode.CommentReply) => {
						// eslint-disable-next-line no-unsafe-optional-chaining
						const lineNumber = vscode.window.activeTextEditor?.selection.active.line;
						if (lineNumber !== undefined) {
							console.log(lineNumber);
						}
						NoteCommentController.replyNote(reply);
						console.log(vscode.workspace.onDidChangeTextDocument);
						
        }));

				context.subscriptions.push(vscode.commands.registerCommand('mywiki.cancelsaveNote', (comment: NoteComment) => {
					if (!comment.parent) {
						return;
					}

					comment.parent.comments = comment.parent.comments.map(cmt => {
						if ((cmt as NoteComment).id === comment.id) {
							cmt.body = (cmt as NoteComment).savedBody;
							cmt.mode = vscode.CommentMode.Preview;
						}

						return cmt;
					});
				}));

				context.subscriptions.push(vscode.commands.registerCommand('mywiki.saveNote', (comment: NoteComment) => {
					if (!comment.parent) {
						return;
					}
					const lineNumber = vscode.window.activeTextEditor?.selection.active.line;
					if (lineNumber !== undefined) {
						console.log(lineNumber);
					}

					comment.parent.comments = comment.parent.comments.map(cmt => {
						if ((cmt as NoteComment).id === comment.id) {
							(cmt as NoteComment).savedBody = cmt.body;
							cmt.mode = vscode.CommentMode.Preview;
						}

						return cmt;
					});
				}));

				context.subscriptions.push(vscode.commands.registerCommand('mywiki.editNote', (comment: NoteComment) => {
					if (!comment.parent) {
						return;
					}
					const lineNumber = vscode.window.activeTextEditor?.selection.active.line;
					if (lineNumber !== undefined) {
						console.log(lineNumber);
					}

					comment.parent.comments = comment.parent.comments.map(cmt => {
						if ((cmt as NoteComment).id === comment.id) {
							cmt.mode = vscode.CommentMode.Editing;
						}

						return cmt;
					});
				}));

        context.subscriptions.push(vscode.commands.registerCommand('mywiki.deleteNote', (thread: vscode.CommentThread) => {
            thread.dispose();
        }));
    }
}

export { NoteComment, NoteCommentController };