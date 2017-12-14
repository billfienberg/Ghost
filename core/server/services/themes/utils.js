'use strict';

const fs = require('fs-extra');

exports.zipFolder = function zipFolder(folderToZip, destination, callback) {
    var archiver = require('archiver'),
        output = fs.createWriteStream(destination),
        archive = archiver.create('zip', {});

    // If folder to zip is a symlink, we want to get the target
    // of the link and zip that instead of zipping the symlink
    if (fs.lstatSync(folderToZip).isSymbolicLink()) {
        folderToZip = fs.realpathSync(folderToZip);
    }

    output.on('close', function () {
        callback(null, archive.pointer());
    });

    archive.on('error', function (err) {
        callback(err, null);
    });

    archive.directory(folderToZip, '/');
    archive.pipe(output);
    archive.finalize();
};