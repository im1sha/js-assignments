'use strict';

/**
 * Возвращает номер банковского счета, распаршеный из предоставленной строки.
 *
 * Вы работаете в банке, который недавно приобрел аппарат, помогающий в чтении писем и факсов, отправленных филиалами.
 * Аппарат сканирует бумажный документ и генерирует строку с банковсчким счетом, который выглядит следующим образом:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Каждая строка содержит номер счета, записанный с помощью '|' и '_'.
 * Каждый счет должен иметь 9 цифр в диапазоне от 0 до 9.
 *
 * Ваша задача -- написать функцию, которая будет принимать номер счета строкой, как описано выше, и парсить ее в обычные числа.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let result = '';
    let source = bankAccount.split('\n');
    let pattern = RegExp(/(.{3})/);
    source = source.map(item => item.split(pattern));
    for (let i = 0; i < source[0].length; i++) {
        if (source[0][i] === '   ' && source[1][i] === '  |') result += 1;
        if (source[2][i] === '|_ ') result += 2;
        if (source[1][i] === ' _|' && source[2][i] === ' _|') result += 3;
        if (source[0][i] === '   ' && source[1][i] === '|_|') result += 4;
        if (source[1][i] === '|_ ' && source[2][i] === ' _|') result += 5;
        if (source[1][i] === '|_ ' && source[2][i] === '|_|') result += 6;
        if (source[0][i] === ' _ ' && source[2][i] === '  |') result += 7;
        if (source[1][i] === '|_|' && source[2][i] === '|_|') result += 8;
        if (source[1][i] === '|_|' && source[2][i] === ' _|') result += 9;
        if (source[1][i] === '| |' && source[2][i] === '|_|') result += 0;
    }
    return result;
}


/**
 * Возвращает строку, в которой будут вставлены переносы строки в правильных местах. Каждая часть до переноса строки должна быть не больше, чем переданное в функцию число.
 * Строка может быть перенесена только по границе слов.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let result = '';
    if (text.length <= columns) {
        return yield text;
    }

    while (text) {
        let edge = text.slice(0, columns + 1).lastIndexOf(' ');
        if (edge > 0) {
            result = text.slice(0, edge);
            yield result.trim();
            text = text.slice(edge).trim();
        } else {
            return yield text;
        }
    }
}


/**
 * Возвращает ранг заданной покерной комбинации.
 * Ранги смотрите тут: https://en.wikipedia.org/wiki/List_of_poker_hands
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BA%D0%B5%D1%80
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let suits = '♥♠♦♣';
    let digits = 'A234567891JQK';


    let suits_arr = Array.from(suits, () => 0),
        digit_arr = Array.from(digits, () => 0);

    for (let card of hand) {
        suits_arr[suits.indexOf(card.slice(-1))]++;
        digit_arr[digits.indexOf(card[0])]++;
    }

    digit_arr.push(digit_arr[0]);

    let suits_string = suits_arr.join(''),
        digit_string = digit_arr.join('');

    return (digit_string.indexOf('11111') !== -1) && (suits_string.indexOf('5') !== -1) ? PokerRank.StraightFlush
        : (digit_string.indexOf('4') !== -1) ? PokerRank.FourOfKind
        : (digit_string.indexOf('2') !== -1) && (digit_string.indexOf('3') !== -1) ? PokerRank.FullHouse
        : (suits_string.indexOf('5') !== -1) ? PokerRank.Flush
        : (digit_string.indexOf('11111') !== -1) ? PokerRank.Straight
        : (digit_string.indexOf('3') !== -1) ? PokerRank.ThreeOfKind
        : (digit_string.match(/2.*2.+/)) ? PokerRank.TwoPairs
        : (digit_string.indexOf('2') !== -1) ? PokerRank.OnePair
        : PokerRank.HighCard;
}


/**
 * Возвращает набор прямоугольников из заданной фигуры.
 * Фигура -- это многострочный набор ASCII символов из '-', '+', '|' и пробелов.
 * Ваша задача -- разбить фигуру на прямоугольники, из которых она составлена.
 *
 * К СВЕДЕНИЮ: Порядок прямоугольников не имеет значения.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {

    function get_top_left_corner(i, j) {
        return matrix[i][j] === '+'
            && matrix[i + 1][j] !== ' '
            && matrix[i][j + 1] !== undefined
            && matrix[i + 1][j] !== undefined
            && matrix[i][j + 1] !== ' ';
    }

    let str = 0;
    let col = 0;
    let x = 0;
    let y = 0;
    let points = [];
    let matrix = figure.split('\n');

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === '+'
                && matrix[i + 1][j] === ' '
                && matrix[i][j + 1] === undefined
                || matrix[i][j] === '+'
                && matrix[i + 1][j] === undefined
                && matrix[i][j + 1] === ' ') {

                points.push(i);
                points.push(j);
            }
        }
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (get_top_left_corner(i, j) === true) {
                x = j + 1;
                y = i + 1;
                str = 0;
                col = 0;
                if (i === points[0]
                    && j === points[2]
                    && matrix[points[3]][points[1]] === ' ') {
                    continue;
                }
                while (matrix[i + 1][x] === ' ') {
                    x++;
                    str++;
                }
                while (matrix[y][j] !== '+') {
                    y++;
                    col++;
                }
                yield `+${'-'.repeat(str)}+${`\n|${' '.repeat(str)}|`.repeat(col)}\n+${'-'.repeat(str)}+\n`;
            }
        }
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
