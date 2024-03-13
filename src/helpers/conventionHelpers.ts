
export function findConvErrors(text : string) {
	const varNameList : string[] = [];
	const varIndexList : number[] = [];
	const pattern = /\b(?:int|double|Boolean|char|byte|long|String)\s+([A-Z])(\w*)\b/g;

	let match;
	while ((match = pattern.exec(text)) !== null) {
		const varName = match[0];
		const firstLetterIndex = match.index + varName.indexOf(match[1]);
		varNameList.push(varName);
		varIndexList.push(firstLetterIndex);
	}

	return [varNameList, varIndexList];
}