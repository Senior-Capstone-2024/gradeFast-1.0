import {
	createRegExp,
	exactly,
	wordChar,
	oneOrMore,
	whitespace,
	letter,
	char,
} from "magic-regexp";
import * as vscode from 'vscode';

// const packageMatcher
// const spacingMatcher
const classMatcher = createRegExp(
	exactly("class")
	.and(oneOrMore(whitespace))
	.and(letter.lowercase, oneOrMore(char), "{")
);
// const interfaceMatcher
const methodMatcher = createRegExp(
	exactly("public", "private", "protected")
	.and(oneOrMore(char))
	.and(letter.uppercase, oneOrMore(wordChar), "(")
);

const variableMatcher = createRegExp(
	exactly("int", "float", "double", "String", "char", "boolean")
	.and(oneOrMore(whitespace))
	.and(letter.uppercase)
);

const masterExp = new RegExp(`(${classMatcher})|(${methodMatcher})|(${variableMatcher})`);

export function checkConventions(text:string) {
	const extOutput = vscode.window.createOutputChannel("Convention Errors");
	extOutput.appendLine("Output channel is active");
	const res = text.match(masterExp);
	res?.forEach((match) =>
	extOutput.appendLine(match));
	// while((res = text.match( classMatcher || methodMatcher || variableMatcher ))) != null {
	// 	console.log("first")
	// }
}




