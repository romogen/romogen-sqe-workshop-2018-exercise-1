import * as esprima from 'esprima';

const createLine = (Line, Type, Name='', Condition='', Value='') => {
    return {'line': Line, 'type': Type, 'name': Name, 'condition': Condition, 'value': Value};
};

const multipleLineOriginalText = (originalText, parsedCodeJSON) => {
    let startLine = parsedCodeJSON['loc']['start']['line'], startCol = parsedCodeJSON['loc']['start']['column'],
        endLine = parsedCodeJSON['loc']['end']['line'], endCol = parsedCodeJSON['loc']['end']['column'];
    let splitText = originalText.split('\n'), fullTextAns = '';

    for (let x = startLine-1; x < endLine ; x++){
        if (x == startLine-1)
            fullTextAns += splitText[x].substring(startCol, splitText[x].length);
        else if (x == endLine-1)
            fullTextAns += splitText[x].substring(0, endCol);
        else
            fullTextAns += splitText[x];
    }
    return fullTextAns;
};

const getOriginalText = (originalText, parsedCodeJSON) => {
    if(parsedCodeJSON == null) return null;

    let startLine = parsedCodeJSON['loc']['start']['line'], startCol = parsedCodeJSON['loc']['start']['column'],
        endLine = parsedCodeJSON['loc']['end']['line'], endCol = parsedCodeJSON['loc']['end']['column'];
    let splitText = originalText.split('\n');
    if (startLine == endLine)
        return splitText[startLine-1].substring(startCol, endCol);

    return multipleLineOriginalText(originalText, parsedCodeJSON);
};

const handleIfStatement = (parsedCodeJSON, originalText, is_else=false) => {
    let ansArr = [];
    ansArr.push(createLine(parsedCodeJSON['loc']['start']['line'], ((!is_else)?'if statement':'else if statement'),
        '', getOriginalText(originalText, parsedCodeJSON['test'])));
    ansArr = ansArr.concat(produceTable(parsedCodeJSON['consequent'], originalText));
    if (parsedCodeJSON['alternate'] == null)
        return ansArr;
    else if (parsedCodeJSON['alternate']['type'] == 'IfStatement')
        ansArr = ansArr.concat(handleIfStatement(parsedCodeJSON['alternate'], originalText, true));
    else {
        //ansArr.push(createLine(parsedCodeJSON['alternate']['loc']['start']['line'], 'else statement'));
        ansArr = ansArr.concat(produceTable(parsedCodeJSON['alternate'], originalText));
    }
    return ansArr;
};

const handleProgram = (parsedCodeJSON, originalText) => {
    let ansArr = [];
    for (let x = 0; x < parsedCodeJSON['body'].length ; x++)
        ansArr = ansArr.concat(produceTable(parsedCodeJSON['body'][x], originalText));
    return ansArr;
};

const handleFunctionDeclaration = (parsedCodeJSON, originalText) => {
    let ansArr = [];

    // push function declaration
    ansArr.push(createLine(parsedCodeJSON['loc']['start']['line'], 'function declaration',
        parsedCodeJSON['id']['name']));

    // push variable declarations
    for (let x = 0 ; x < parsedCodeJSON['params'].length ; x++)
        ansArr.push(createLine(parsedCodeJSON['params'][x]['loc']['start']['line'], 'variable declaration',
            parsedCodeJSON['params'][x]['name']));

    // parse function body recursively
    ansArr = ansArr.concat(produceTable(parsedCodeJSON['body'], originalText));

    return ansArr;
};

const handleBlockStatement = (parsedCodeJSON, originalText) => {
    let ansArr = [];
    // if an object and not a series of commands ------------ turns out it's not even possible
    //if (!Array.isArray(parsedCodeJSON['body']))
    //    return ansArr.concat(produceTable(parsedCodeJSON['body'], originalText));

    // if is series of command (eg: is array).
    for (let x = 0; x < parsedCodeJSON['body'].length ; x++)
        ansArr = ansArr.concat(produceTable(parsedCodeJSON['body'][x], originalText));

    return ansArr;
};

const handleVariableDeclaration = (parsedCodeJSON, originalText) => {
    let ansArr = [];

    for (let x = 0; x < parsedCodeJSON['declarations'].length ; x++)
        ansArr.push(createLine(parsedCodeJSON['declarations'][x]['id']['loc']['start']['line'],
            'variable declaration', parsedCodeJSON['declarations'][x]['id']['name'], '',
            getOriginalText(originalText, parsedCodeJSON['declarations'][x]['init'])));

    return ansArr;
};

const handleExpressionStatement = (parsedCodeJSON, originalText) => {
    return createLine(parsedCodeJSON['loc']['start']['line'], 'assignment expression',
        parsedCodeJSON['expression']['left']['name'], '',
        getOriginalText(originalText, parsedCodeJSON['expression']['right']));
};

const handleWhileStatement = (parsedCodeJSON, originalText) => {
    let ansArr = [];

    ansArr.push(createLine(parsedCodeJSON['loc']['start']['line'], 'while statement',
        '', getOriginalText(originalText, parsedCodeJSON['test'])));
    ansArr = ansArr.concat(produceTable(parsedCodeJSON['body'], originalText));

    return ansArr;
};

const handleForStatement = (parsedCodeJSON, originalText) => {
    let ansArr = [];

    ansArr.push(createLine(parsedCodeJSON['loc']['start']['line'], 'for statement', '',
        getOriginalText(originalText, parsedCodeJSON['init']) +
        getOriginalText(originalText, parsedCodeJSON['test']) + ';' +
        getOriginalText(originalText, parsedCodeJSON['update'])));
    ansArr = ansArr.concat(produceTable(parsedCodeJSON['body'], originalText));

    return ansArr;
};

const handleReturnStatement = (parsedCodeJSON, originalText) => {
    return createLine(parsedCodeJSON['loc']['start']['line'], 'return statement', '', '',
        getOriginalText(originalText, parsedCodeJSON['argument']));
};

const functionsDict = {
    'Program': handleProgram,
    'FunctionDeclaration': handleFunctionDeclaration,
    'BlockStatement': handleBlockStatement,
    'VariableDeclaration': handleVariableDeclaration,
    'ExpressionStatement': handleExpressionStatement,
    'WhileStatement': handleWhileStatement,
    'ForStatement': handleForStatement,
    'IfStatement': handleIfStatement,
    'ReturnStatement': handleReturnStatement
};

const produceTable = (parsedCodeJSON, originalText) => {
    let relevantFunction = functionsDict[parsedCodeJSON['type']];
    return relevantFunction(parsedCodeJSON, originalText);
};

const parseCode = (codeToParse) => {
    return produceTable(esprima.parseScript(codeToParse, {loc: true}), codeToParse);
};

export {parseCode};
