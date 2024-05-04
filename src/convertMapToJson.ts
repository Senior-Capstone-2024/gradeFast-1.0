import * as fs from 'fs';

export function convertMapToJson(myMap: Map<number, string[]>, filePath: string) {
    const mapAsObject: { [key: number]: string[] } = {};
    myMap.forEach((value, key) => { mapAsObject[key] = value; });
    const jsonString = JSON.stringify(mapAsObject);
    fs.writeFileSync(filePath, jsonString);
    console.log('JSON file created successfully:', filePath);
}
