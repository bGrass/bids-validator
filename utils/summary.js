var fs = require('fs');

/**
 * Summmary
 *
 * Takes a full file list and returns a object of summary data.
 */
module.exports = function bval (fileList) {
    var summary = {
        sessions: [],
        subjects: [],
        tasks:    [],
        modalities: [],
        totalFiles: Object.keys(fileList).length,
        size: 0
    };

    for (var fileKey in fileList) {
        var file = fileList[fileKey];
        if (typeof window !== 'undefined') {
            if (file.size) {summary.size += file.size;}
        } else {
            if (!file.stats) {file.stats = fs.lstatSync(file.path);}
            summary.size += file.stats.size;
        }
        var path = file.relativePath;

        var checks = {
            'ses':  'sessions',
            'sub':  'subjects',
            'task': 'tasks'
        };

        for (var checkKey in checks) {
            if (path && path.indexOf(checkKey + '-') > -1) {
                var task = path.slice(path.indexOf(checkKey + '-'));
                    task = task.slice(0, task.indexOf('/'));
                    if (task.indexOf('_') > -1) {task = task.slice(0, task.indexOf('_'));}
                    task = task.slice(checkKey.length + 1);
                if (summary[checks[checkKey]].indexOf(task) === -1) {summary[checks[checkKey]].push(task);}
            }
        }

        if (path && (path.endsWith('.nii') || path.endsWith('.nii.gz'))) {
            var pathParts = path.split('_');
            var suffix    = pathParts[pathParts.length -1];
                suffix    = suffix.slice(0, suffix.indexOf('.'));
            if (summary.modalities.indexOf(suffix) === -1) {summary.modalities.push(suffix);}
        }

    }
    return summary;
};
