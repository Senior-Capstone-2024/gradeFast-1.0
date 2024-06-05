'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
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
import { longMethod } from './longMethod';
import { longParameters } from './longParameters';
import { badSwitch } from './badSwitch';
import { lazyClass } from './lazyClass';
import { exec } from 'child_process';

const myMap: Map<number, string[]> = new Map();
const filePath = 'C:\\Users\\senla\\OneDrive\\Documents\\capstone\\gradeFast-1.0\\output\\data.json';


export function activate(context: vscode.ExtensionContext) {
    vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');

    const pdfMaker = new MakePdf(context);

    const generateReport = vscode.commands.registerCommand('extension.generateReport', () => {
        pdfMaker.runPython();
    });
    
    const disposable = vscode.commands.registerCommand('extension.findCapitalizedPrimitiveTypes', () => {
        findCapitalizedPrimitiveTypes(myMap);
    } );

    const create = vscode.commands.registerCommand('extension.createJSON', ()=> {
        convertMapToJson(myMap, filePath);
    } );

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

    const disposable7 = vscode.commands.registerCommand('extension.longMethod', () => {
        longMethod(myMap);
    } );

    const disposable8 = vscode.commands.registerCommand('extension.longParameters', () => {
        longParameters(myMap);
    } );

    const disposable9 = vscode.commands.registerCommand('extension.badSwitch', () => {
        badSwitch(myMap);
    } );

    const disposable10 = vscode.commands.registerCommand('extension.lazyClass', () => {
        lazyClass(myMap);
    } );

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

class MakePdf {
    // private _outputchannel: vscode.OutputChannel;
    // private _context: vscode.ExtensionContext;
    private _path: string;
    private _activeFileName: string | undefined;
    private _activeFilePath: string | undefined;
    private _activeDir: string | undefined;
    // private data: string = JSON.stringify()
    
    
    constructor(context: vscode.ExtensionContext) {
        // this._context = context;
        this._path = filePath;
        this._activeFileName = vscode.window.activeTextEditor?.document.fileName;
        if (this._activeFileName !== undefined) {
            this._activeFilePath = path.join(this._activeFileName);
        }
        if (vscode.workspace.workspaceFolders !== undefined) {
            this._activeDir = vscode.workspace.workspaceFolders[0].uri.path;
        }
        // this._outputchannel = vscode.window.createOutputChannel()
    }

    public runPython(): void { 
        console.log(this);
        if (this._activeFileName !== undefined && this._activeDir !== undefined) {
            const exp = /.*(?=\.)/;
            let pdfName = this._activeFileName.match(exp)?.[0];

            if (pdfName === undefined) { return; }

            pdfName = this._activeDir.concat(pdfName);
            console.log(pdfName);
            const pdfCommand = `python3 /Users/mihaisiia/GradeFast/gradeFast-1.0/report_generator/report_generator/main.py ${ this._path } ${ this._activeDir + this._activeFilePath } ${ pdfName }`;
            console.log(pdfCommand);
            const child = exec(pdfCommand);

            child.on('error', (e) => {
                console.error(e);
            });

            child.on('exit', (e) => {
                // this._runPython();
                console.log(e);
            });
        }
    }
}
