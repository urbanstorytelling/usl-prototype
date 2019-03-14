// http://www.bilyachat.com/2017/01/angular-2-build-version.html
// https://gist.github.com/dciccale/5560837
// https://stackoverflow.com/a/10855054/3249027

var fs = require('fs');
/**
 * don't do this: var package = require("./package.json");
 * Doing this with browserify has security implications.
 * Be careful not to expose your package.json to the client, as it means that all your dependency version numbers,
 * build and test commands and more are sent to the client.
 * If you're building server and client in the same project, you expose your server-side version numbers too.
 * Such specific data can be used by an attacker to better fit the attack your server.
 */

var buildVersion = "version: '" + process.env.npm_package_version + "'"; // get $npm_package_version from package.json
var branch,
    commit,
    date = "date: '" + new Date() + "'";

var promBranch = new Promise(resolve => {
    require('child_process').exec('git branch', function (err, res) {
        res = res.toString().trim();
        console.log("Commit on branch: ", res);
        branch = "branch: '" + res + "'";
        resolve();
    });
});

var promCommit = new Promise(resolve => {
    require('child_process').exec('git rev-parse --short HEAD', function (err, res) {
        res = res.toString().trim();
        console.log('Last commit hash on this branch is:', res);
        commit = "commit: '" + res + "'";
        resolve();
    });
});

Promise.all([promBranch, promCommit]).then(() => {
    const newContent =
        "export const appVersion = {" + '\r\n' +
        "  " + buildVersion + "," + '\r\n' +
        "  " + branch + "," + '\r\n' +
        "  " + commit + "," + '\r\n' +
        "  " + date + '\r\n' +
        "};" + '\r\n';
    
    fs.writeFile("./src/app/app.wbc-version.ts", newContent, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("version log was saved!");
    });
});
