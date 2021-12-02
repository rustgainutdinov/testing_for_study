const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');

function executeCommand(command, callback) {
    exec(command, function (error, stdout, stderr) {
        callback(stdout);
    });
}

async function getFileLines(fileName) {
    const fileStream = fs.createReadStream(fileName);
    const rl = readline.createInterface({
        input: fileStream, crlfDelay: Infinity
    });

    const arr = [];
    for await (const line of rl) {
        arr.push(line);
    }
    return arr;
}

async function main(fileName) {
    const lines = await getFileLines(fileName);
    for (let i = 0; i < lines.length; i = i + 2) {
        executeCommand(`node ./lw1/app.js ${lines[i]}`, function (out) {
            if (out.replace(/(?:\r\n|\r|\n)/g, '') === lines[i + 1]) {
                console.log(`${i / 2} success`);
                return;
            }
            console.log(`${i / 2} error`);
        })
    }
}

main(process.argv.slice(2)[0]);