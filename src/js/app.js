import $ from 'jquery';
import {parseCode} from './code-analyzer';

const createHeader = (keys) => {
    let headerTxt = '<tr>';
    for (let x = 0 ; x < keys.length ; x++){
        headerTxt += '<th>';
        headerTxt += keys[x].toString();
        headerTxt += '</th>';
    }
    return headerTxt + '</tr>';
};

const createLine = (line, keys) => {
    let lineTxt = '';
    for (let x = 0 ; x < keys.length ; x++){
        lineTxt += '<td>';
        lineTxt += (line[keys[x]] === null ? 'null' : line[keys[x]].toString());
        lineTxt += '</td>';
    }
    return lineTxt;
};

const createTable = (parsedCode) => {
    if (parsedCode.length === 0) return '';

    let tableBodyAns = '', keys = Object.keys(parsedCode[0]);
    tableBodyAns += createHeader(keys);
    for(let x = 0 ; x < parsedCode.length ; x++){
        tableBodyAns += '<tr>';

        tableBodyAns += createLine(parsedCode[x], keys);

        tableBodyAns += '</tr>';
    }

    return tableBodyAns;
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let tableTxt = createTable(parsedCode);
        document.getElementById('parsedCodeTable').innerHTML = tableTxt;
    });
});
