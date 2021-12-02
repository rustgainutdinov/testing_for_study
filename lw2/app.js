const axios = require('axios');
const fs = require('fs');


let succeededLinks = new Map();
let erroredLinks = new Map();

async function main() {
    setTimeout(function () {
        saveArrayToFile('lw2/succeeded-links.txt', Array.from(succeededLinks.keys()));
        let erroredLinksList = Array.from(erroredLinks.keys()).filter(link => !succeededLinks.has(link))
        saveArrayToFile('lw2/errored-links.txt', erroredLinksList);
    }, 15000);
    await findBrokenLinks("http://91.210.252.240/broken-links/about.html");
}

function saveArrayToFile(filePath, arr) {
    let file = fs.createWriteStream(filePath);
    arr.forEach(function (v) {
        file.write(v + '\n');
    });
    file.write("Count of links: " + arr.length +", date: " + new Date().toLocaleDateString())
    file.end();
}

async function findBrokenLinks(path) {
    try {
        const checkResponse = await axios({method: 'HEAD', url: path, timeout: 5000});
        if (checkResponse.status > 400) {
            console.log('error ' + path);
            erroredLinks.set(path, true);
            return;
        }
        console.log('success ' + path);
        succeededLinks.set(path, true);
    } catch (error) {
        console.log('exception ' + path + " " + error.message);
        erroredLinks.set(path, true);
    }
    try {
        const response = await axios({method: 'GET', url: path, timeout: 2000});
        // let regex = /(https?|ftp):\/\/?([a-z0-9+!*(),;?&=$_.-]+(:[a-z0-9+!*(),;?&=$_.-]+)?@)?([a-z0-9-.]*)\.([a-z]{2,4})(:[0-9]{2,5})?(\/([a-z0-9+$_-]\.?)+)*\/?(\?[a-z+&$_.-][a-z0-9;:@&%=+\/$_.-]*)?(#[a-z_.-][a-z0-9+$_.-]*)?/gi;
        let regex = /(href="(.+?)")|(src="(.+?)")/gi;
        let links = response.data.toString().match(regex);
        if (path.indexOf("91.210.252.240") !== -1) {
            links.forEach(link => {
                let matches = /(href="(.+?)")|(src="(.+?)")/gi.exec(link);
                link = matches[2] ? matches[2] : matches[4];
                link = (link.indexOf("http") !== -1 ? "" : "http://91.210.252.240/broken-links/") + link;
                if (succeededLinks.has(link) || erroredLinks.has(link)) {
                    return;
                }
                findBrokenLinks(link);
            })
        }
    } catch (error) {
    }
}

main();