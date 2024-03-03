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
	console.log('Congratulations, your extension "Java convention commands" is now active!');

    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', () => {
        // activeTextEditor allows access to text inside opened document.
        vscode.window.showInformationMessage('Naming Convention Mistake!! Highlighted in RED');
        const editor = vscode.window.activeTextEditor;
        //If there is an editor inside.
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            
            // 1. The expression starts and ends with `/`, marking the beginning and end of the pattern.
            // 2. `\b` ensures that the pattern matches only at word boundaries.
            // 3. `(?: ...)` groups together multiple options without capturing them separately.
            // 4. `int|double|Boolean|char|byte|long|String` are the types of variables we're looking for.
            // 5. `\s+` matches one or more spaces, tabs, or newlines after the variable type.
            // 6. `([A-Z]\w*)` captures the variable name, starting with an uppercase letter and followed by zero or more word characters.
            // 7. `\b` ensures that the variable name ends at a word boundary.
            // 8. The `/` marks the end of the pattern.
            // 9. `g` means the pattern should be applied globally to find all matches in the input text.
            
            const pattern = /\b(?:int|double|Boolean|char|byte|long|String)\s+([A-Z])(\w*)\b/g;
            // Find matches
            let match;
            while ((match = pattern.exec(text)) !== null) {
                // Get the matched variable name
            
                const variableName = match[0]; // Entire matched variable name
                const firstLetterIndex = match.index + match[0].indexOf(match[1]); // Index of the first letter after the primitive data type
                const firstLetterRange = new vscode.Range(document.positionAt(firstLetterIndex), document.positionAt(firstLetterIndex + 1));
                
                // Highlight the first letter after the primitive data type
                editor.setDecorations(vscode.window.createTextEditorDecorationType({
                    isWholeLine: false,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    overviewRulerColor: 'red',
                    overviewRulerLane: vscode.OverviewRulerLane.Right,
                    light: {
                        borderColor: 'darkred',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)'
                    },
                    dark: {
                        borderColor: 'lightred',
                        backgroundColor: 'rgba(255, 0, 0, 0.4)'
                    }
                }), [firstLetterRange]);
                
            }
            
        } else {
            vscode.window.showErrorMessage('No active text editor.');
        }
    });


	
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