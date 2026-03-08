import * as fs from 'node:fs';
import * as path from 'path';
	
async function readDir() {
const filesArray = fs.readdirSync(path.join('.'), {withFileTypes: true})
let items = filesArray
    const folders = items
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
    const files = items
    .filter((item) => item.isFile())
    .map((item) => item.name);
    return[...folders, ...files]
}   

export default readDir;