import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';



describe('little and specific tests', () => {
    it('sequenced commands in main program', () => {
        assert.deepEqual(
            parseCode('let y, b;\n' +
                    'b = 3;\n' +
                    'y = b+3;' ),
            [{'line': 1, 'type': 'variable declaration', 'name': 'y', 'condition': '', 'value': null},
                {'line': 1, 'type': 'variable declaration', 'name': 'b', 'condition': '', 'value': null},
                {'line': 2, 'type': 'assignment expression', 'name': 'b', 'condition': '', 'value': '3'},
                {'line': 3, 'type': 'assignment expression', 'name': 'y', 'condition': '', 'value': 'b+3'}]
        );
    });

    it('multiple lines expr.', () => {
        assert.deepEqual(
            parseCode('let x = 1\n' +
                '+\n' +
                '1+\n' +
                '3;' ),
            [{'line': 1, 'type': 'variable declaration', 'name': 'x', 'condition': '', 'value': '1+1+3'}]
        );
    });

    it('simple if statement with alternate = null', () => {
        assert.deepEqual(
            parseCode('if(x <= 1) {\n' +
                'x = x + 1;}' ),
            [{'line': 1, 'type': 'if statement', 'name': '', 'condition': 'x <= 1', 'value': ''},
                {'line': 2, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x + 1'}]
        );
    });

    it('simple if else statement (with alternate != null)', () => {
        assert.deepEqual(
            parseCode('if(x <= 1) {\n' +
                'x = x + 1;}\n' +
                'else{\n' +
                'x = x-1;}' ),
            [{'line': 1, 'type': 'if statement', 'name': '', 'condition': 'x <= 1', 'value': ''},
                {'line': 2, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x + 1'},
                {'line': 4, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x-1'}]
        );
    });

    it('simple if - else if - else statement (with alternate != null)', () => {
        assert.deepEqual(
            parseCode('if(x <= 1) {\n' +
                'x = x + 1;}\n' +
                'else if(x > 1){\n' +
                'x = x-2;}\n' +
                'else{\n' +
                'x = x-1;}' ),
            [{'line': 1, 'type': 'if statement', 'name': '', 'condition': 'x <= 1', 'value': ''},
                {'line': 2, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x + 1'},
                {'line': 3, 'type': 'else if statement', 'name': '', 'condition': 'x > 1', 'value': ''},
                {'line': 4, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x-2'},
                {'line': 6, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x-1'}]
        );
    });



    it('parsing empty correctly', () => {
        assert.deepEqual(
            parseCode(''),
            []
        );
    });



    it('simple function declaration correctly', () => {
        assert.deepEqual(
            parseCode('function simple(very, veryVery){}'),
            [{'line': 1, 'type': 'function declaration', 'name': 'simple', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'very', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'veryVery', 'condition': '', 'value': ''}]
        );
    });

    it('simple multi variable declaration correctly', () => {
        assert.deepEqual(
            parseCode('let a = 1, \n' +
                'b, c=2;'),
            [{'line': 1, 'type': 'variable declaration', 'name': 'a', 'condition': '', 'value': '1'},
                {'line': 2, 'type': 'variable declaration', 'name': 'b', 'condition': '', 'value': null},
                {'line': 2, 'type': 'variable declaration', 'name': 'c', 'condition': '', 'value': '2'}]
        );
    });

    it('simple variable declaration correctly', () => {
        assert.deepEqual(
            parseCode('let a = 1;'),
            [{'line': 1, 'type': 'variable declaration', 'name': 'a', 'condition': '', 'value': '1'}]
        );
    });

    it('simple while statement', () => {
        assert.deepEqual(
            parseCode('while (x > 4){\n' +
                'x = x - 1;}'),
            [{'line': 1, 'type': 'while statement', 'name': '', 'condition': 'x > 4', 'value': ''},
                {'line': 2, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x - 1'}]
        );
    });

    it('simple for statement', () => {
        assert.deepEqual(
            parseCode('for (let x = 1; x < 5 ; x = x+2){\n' +
                'x = x-1;\n' +
                '}'),
            [{'line': 1, 'type': 'for statement', 'name': '', 'condition': 'let x = 1;x < 5;x = x+2', 'value': ''},
                {'line': 2, 'type': 'assignment expression', 'name': 'x', 'condition': '', 'value': 'x-1'}]
        );
    });

    it('simple function with simple return statement', () => {
        assert.deepEqual(
            parseCode('function a(b,c){\n' +
                'return b+c;\n' +
                '}'),
            [{'line': 1, 'type': 'function declaration', 'name': 'a', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'b', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'c', 'condition': '', 'value': ''},
                {'line': 2, 'type': 'return statement', 'name': '', 'condition': '', 'value': 'b+c'}]
        );
    });

    it('simple empty for statement', () => {
        assert.deepEqual(
            parseCode('for (let x = 0 ; x < rounds ; x++){}'),
            [{'line': 1, 'type': 'for statement', 'name': '', 'condition': 'let x = 0 ;x < rounds;x++', 'value': ''}]
        );
    });

    it('simple empty while statement', () => {
        assert.deepEqual(
            parseCode('while (true){}'),
            [{'line': 1, 'type': 'while statement', 'name': '', 'condition': 'true', 'value': ''}]
        );
    });




});

describe('Complex tests', () => {
    it('parsing classic binarySearch example', () => {
        assert.deepEqual(
            parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}'),
            [{'line': 1, 'type': 'function declaration', 'name': 'binarySearch', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'X', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'V', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'n', 'condition': '', 'value': ''},
                {'line': 2, 'type': 'variable declaration', 'name': 'low', 'condition': '', 'value': null},
                {'line': 2, 'type': 'variable declaration', 'name': 'high', 'condition': '', 'value': null},
                {'line': 2, 'type': 'variable declaration', 'name': 'mid', 'condition': '', 'value': null},
                {'line': 3, 'type': 'assignment expression', 'name': 'low', 'condition': '', 'value': '0'},
                {'line': 4, 'type': 'assignment expression', 'name': 'high', 'condition': '', 'value': 'n - 1'},
                {'line': 5, 'type': 'while statement', 'name': '', 'condition': 'low <= high', 'value': ''},
                {'line': 6, 'type': 'assignment expression', 'name': 'mid', 'condition': '', 'value': '(low + high)/2'},
                {'line': 7, 'type': 'if statement', 'name': '', 'condition': 'X < V[mid]', 'value': ''},
                {'line': 8, 'type': 'assignment expression', 'name': 'high', 'condition': '', 'value': 'mid - 1'},
                {'line': 9, 'type': 'else if statement', 'name': '', 'condition': 'X > V[mid]', 'value': ''},
                {'line': 10, 'type': 'assignment expression', 'name': 'low', 'condition': '', 'value': 'mid + 1'},
                {'line': 12, 'type': 'return statement', 'name': '', 'condition': '', 'value': 'mid'},
                {'line': 14, 'type': 'return statement', 'name': '', 'condition': '', 'value': '-1'}]
        );
    });

    it('parsing fibonachi function example', () => {
        assert.deepEqual(
            parseCode('function fibonachi(rounds){\n' +
                'let y = 1, z;\n' +
                'y = 1;\n' +
                'z = 1;\n' +
                'for (let x = 0 ; x < rounds ; x++){\n' +
                'let tmp = y+z;\n' +
                'y = z;\n' +
                'z = tmp;\n' +
                '}\n' +
                'return z;\n' +
                '}'),
            [{'line': 1, 'type': 'function declaration', 'name': 'fibonachi', 'condition': '', 'value': ''},
                {'line': 1, 'type': 'variable declaration', 'name': 'rounds', 'condition': '', 'value': ''},
                {'line': 2, 'type': 'variable declaration', 'name': 'y', 'condition': '', 'value': '1'},
                {'line': 2, 'type': 'variable declaration', 'name': 'z', 'condition': '', 'value': null},
                {'line': 3, 'type': 'assignment expression', 'name': 'y', 'condition': '', 'value': '1'},
                {'line': 4, 'type': 'assignment expression', 'name': 'z', 'condition': '', 'value': '1'},
                {'line': 5, 'type': 'for statement', 'name': '', 'condition': 'let x = 0 ;x < rounds;x++', 'value': ''},
                {'line': 6, 'type': 'variable declaration', 'name': 'tmp', 'condition': '', 'value': 'y+z'},
                {'line': 7, 'type': 'assignment expression', 'name': 'y', 'condition': '', 'value': 'z'},
                {'line': 8, 'type': 'assignment expression', 'name': 'z', 'condition': '', 'value': 'tmp'},
                {'line': 10, 'type': 'return statement', 'name': '', 'condition': '', 'value': 'z'}]
        );
    });
});
