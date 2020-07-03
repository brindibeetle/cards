(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Signup = F2(
	function (a, b) {
		return {$: 'Signup', a: a, b: b};
	});
var $author$project$Main$SignupMsg = function (a) {
	return {$: 'SignupMsg', a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Domain$InitFlags$emptyInitFlags = {backend_base_url: '', frontend_url: ''};
var $author$project$Domain$InitFlags$InitFlags = F2(
	function (backend_base_url, frontend_url) {
		return {backend_base_url: backend_base_url, frontend_url: frontend_url};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Domain$InitFlags$initFlagsBookDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'frontend_url',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'backend_base_url',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Domain$InitFlags$InitFlags)));
var $author$project$Domain$InitFlags$getInitFlags = function (dvalue) {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Domain$InitFlags$initFlagsBookDecoder, dvalue);
	if (_v0.$ === 'Ok') {
		var initFlags = _v0.a;
		return initFlags;
	} else {
		var a = _v0.a;
		return $author$project$Domain$InitFlags$emptyInitFlags;
	}
};
var $author$project$Signup$PhaseInit = {$: 'PhaseInit'};
var $author$project$Domain$SignupRequest$GamesAndPlayersRequest = {$: 'GamesAndPlayersRequest'};
var $author$project$Domain$SignupRequest$makeGamesRequest = {gameName: '', gameUuid: '', playerName: '', typeRequest: $author$project$Domain$SignupRequest$GamesAndPlayersRequest};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Domain$SignupRequest$typeRequestEncoder = function (typeRequest) {
	switch (typeRequest.$) {
		case 'CreateRequest':
			return $elm$json$Json$Encode$string('CREATE');
		case 'DestroyRequest':
			return $elm$json$Json$Encode$string('DESTROY');
		case 'JoinRequest':
			return $elm$json$Json$Encode$string('JOIN');
		case 'DetachRequest':
			return $elm$json$Json$Encode$string('DETACH');
		case 'GamesAndPlayersRequest':
			return $elm$json$Json$Encode$string('GAMES_AND_PLAYERS');
		default:
			return $elm$json$Json$Encode$string('START');
	}
};
var $author$project$Domain$SignupRequest$signupRequestEncoder = function (_v0) {
	var typeRequest = _v0.typeRequest;
	var gameName = _v0.gameName;
	var playerName = _v0.playerName;
	var gameUuid = _v0.gameUuid;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'typeRequest',
				$author$project$Domain$SignupRequest$typeRequestEncoder(typeRequest)),
				_Utils_Tuple2(
				'gameName',
				$elm$json$Json$Encode$string(gameName)),
				_Utils_Tuple2(
				'playerName',
				$elm$json$Json$Encode$string(playerName)),
				_Utils_Tuple2(
				'gameUuid',
				$elm$json$Json$Encode$string(gameUuid))
			]));
};
var $author$project$Signup$signupSend = _Platform_outgoingPort('signupSend', $elm$core$Basics$identity);
var $author$project$Signup$init = function (session) {
	return _Utils_Tuple2(
		{games: _List_Nil, joinGame: '', pending: false, phase: $author$project$Signup$PhaseInit},
		$author$project$Signup$signupSend(
			$author$project$Domain$SignupRequest$signupRequestEncoder($author$project$Domain$SignupRequest$makeGamesRequest)));
};
var $author$project$Session$Empty = {$: 'Empty'};
var $author$project$Session$initialSession = function (initFlags) {
	return {gameName: '', gameUuid: '', initFlags: initFlags, message: $author$project$Session$Empty, playerName: '', playerUuid: ''};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$init = F3(
	function (flags, url, navKey) {
		var session = $author$project$Session$initialSession(
			$author$project$Domain$InitFlags$getInitFlags(flags));
		var _v0 = $author$project$Signup$init(session);
		var model = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			A2($author$project$Main$Signup, model, session),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$SignupMsg, cmd));
	});
var $author$project$Main$PlayMsg = function (a) {
	return {$: 'PlayMsg', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Play$GameReceiver = function (a) {
	return {$: 'GameReceiver', a: a};
};
var $author$project$Play$HandReceiver = function (a) {
	return {$: 'HandReceiver', a: a};
};
var $author$project$Play$PlayReceiver = function (a) {
	return {$: 'PlayReceiver', a: a};
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Play$gameReceiver = _Platform_incomingPort('gameReceiver', $elm$json$Json$Decode$value);
var $author$project$Play$handReceiver = _Platform_incomingPort('handReceiver', $elm$json$Json$Decode$value);
var $author$project$Play$playReceiver = _Platform_incomingPort('playReceiver', $elm$json$Json$Decode$value);
var $author$project$Play$subscriptions = $elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			$author$project$Play$playReceiver($author$project$Play$PlayReceiver),
			$author$project$Play$handReceiver($author$project$Play$HandReceiver),
			$author$project$Play$gameReceiver($author$project$Play$GameReceiver)
		]));
var $author$project$Signup$SignUpAll = function (a) {
	return {$: 'SignUpAll', a: a};
};
var $author$project$Signup$SignUpPersonal = function (a) {
	return {$: 'SignUpPersonal', a: a};
};
var $author$project$Signup$signupAllReceiver = _Platform_incomingPort('signupAllReceiver', $elm$json$Json$Decode$value);
var $author$project$Signup$signupPersonalReceiver = _Platform_incomingPort('signupPersonalReceiver', $elm$json$Json$Decode$value);
var $author$project$Signup$subscriptions = $elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			$author$project$Signup$signupPersonalReceiver($author$project$Signup$SignUpPersonal),
			$author$project$Signup$signupAllReceiver($author$project$Signup$SignUpAll)
		]));
var $author$project$Main$subscriptions = function (model) {
	if (model.$ === 'Signup') {
		var signupModel = model.a;
		var session = model.b;
		return $elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					A2($elm$core$Platform$Sub$map, $author$project$Main$SignupMsg, $author$project$Signup$subscriptions),
					A2($elm$core$Platform$Sub$map, $author$project$Main$PlayMsg, $author$project$Play$subscriptions)
				]));
	} else {
		var playModel = model.a;
		var session = model.b;
		return A2($elm$core$Platform$Sub$map, $author$project$Main$PlayMsg, $author$project$Play$subscriptions);
	}
};
var $author$project$Main$Play = F2(
	function (a, b) {
		return {$: 'Play', a: a, b: b};
	});
var $author$project$Domain$DTOcard$DARK = {$: 'DARK'};
var $author$project$Domain$Phase$WAITING = {$: 'WAITING'};
var $author$project$Domain$DTOcard$JOKER = {$: 'JOKER'};
var $author$project$Domain$DTOcard$Special = function (a) {
	return {$: 'Special', a: a};
};
var $author$project$Domain$DTOcard$defaultDTOcard = $author$project$Domain$DTOcard$Special(
	{back: $author$project$Domain$DTOcard$DARK, specialType: $author$project$Domain$DTOcard$JOKER, uuid: ''});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging = {$: 'NotDragging'};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$init = $norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging;
var $author$project$Play$init = function (session) {
	return {bottomCard: $author$project$Domain$DTOcard$defaultDTOcard, currentPlayerUuid: '', dragDrop: $norpan$elm_html5_drag_drop$Html5$DragDrop$init, gameName: '', hand: _List_Nil, pending: false, phase: $author$project$Domain$Phase$WAITING, players: _List_Nil, table: _List_Nil, topCardBack: $author$project$Domain$DTOcard$DARK};
};
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$toModel = F3(
	function (model, cmd, session) {
		if (model.$ === 'Signup') {
			var signupModel = model.a;
			var session1 = model.b;
			return _Utils_Tuple2(
				A2($author$project$Main$Signup, signupModel, session1),
				cmd);
		} else {
			var playModel = model.a;
			var session1 = model.b;
			return _Utils_Tuple2(
				A2($author$project$Main$Play, playModel, session1),
				cmd);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Play$dragstart = _Platform_outgoingPort('dragstart', $elm$core$Basics$identity);
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Domain$GameResponse$GAME = {$: 'GAME'};
var $author$project$Domain$GameResponse$emptyGameResponse = {currentPlayerUuid: '', phase: $author$project$Domain$Phase$WAITING, players: _List_Nil, typeResponse: $author$project$Domain$GameResponse$GAME};
var $author$project$Domain$GameResponse$GameResponse = F4(
	function (typeResponse, phase, players, currentPlayerUuid) {
		return {currentPlayerUuid: currentPlayerUuid, phase: phase, players: players, typeResponse: typeResponse};
	});
var $author$project$Domain$DTOplayer$DTOplayer = F3(
	function (playerName, playerUuid, playerStatus) {
		return {playerName: playerName, playerStatus: playerStatus, playerUuid: playerUuid};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Domain$DTOplayer$DISCONNECTED = {$: 'DISCONNECTED'};
var $author$project$Domain$DTOplayer$FINISHED = {$: 'FINISHED'};
var $author$project$Domain$DTOplayer$PLAYING = {$: 'PLAYING'};
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Domain$DTOplayer$playerStatusFromString = function (string) {
	switch (string) {
		case 'PLAYING':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOplayer$PLAYING);
		case 'FINISHED':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOplayer$FINISHED);
		case 'DISCONNECTED':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOplayer$DISCONNECTED);
		default:
			return $elm$json$Json$Decode$fail('Invalid PlayerStatus: ' + string);
	}
};
var $author$project$Domain$DTOplayer$playerStatusDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$DTOplayer$playerStatusFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$DTOplayer$dtoPlayerDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'playerStatus',
	$author$project$Domain$DTOplayer$playerStatusDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'playerUuid',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'playerName',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$DTOplayer$DTOplayer))));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Domain$Phase$DRAW = {$: 'DRAW'};
var $author$project$Domain$Phase$PUT = {$: 'PUT'};
var $author$project$Domain$Phase$phaseFromString = function (string) {
	var _v0 = A2($elm$core$Debug$log, 'phaseFromString string = ', string);
	switch (_v0) {
		case 'DRAW':
			return $elm$json$Json$Decode$succeed($author$project$Domain$Phase$DRAW);
		case 'PUT':
			return $elm$json$Json$Decode$succeed($author$project$Domain$Phase$PUT);
		case 'WAITING':
			return $elm$json$Json$Decode$succeed($author$project$Domain$Phase$WAITING);
		default:
			return $elm$json$Json$Decode$fail('Invalid PhaseResponse: ' + string);
	}
};
var $author$project$Domain$Phase$phaseDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$Phase$phaseFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$GameResponse$PLAYERS = {$: 'PLAYERS'};
var $author$project$Domain$GameResponse$typeResponseFromString = function (string) {
	var _v0 = A2($elm$core$Debug$log, 'typeResponseFromString string = ', string);
	switch (_v0) {
		case 'GAME':
			return $elm$json$Json$Decode$succeed($author$project$Domain$GameResponse$GAME);
		case 'PLAYERS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$GameResponse$PLAYERS);
		default:
			return $elm$json$Json$Decode$fail('Invalid typeResponseFromString: ' + string);
	}
};
var $author$project$Domain$GameResponse$typeResponseDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$GameResponse$typeResponseFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$GameResponse$gameResponseDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'currentPlayerUuid',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'players',
		$elm$json$Json$Decode$list($author$project$Domain$DTOplayer$dtoPlayerDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'phase',
			$author$project$Domain$Phase$phaseDecoder,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'typeResponse',
				$author$project$Domain$GameResponse$typeResponseDecoder,
				$elm$json$Json$Decode$succeed($author$project$Domain$GameResponse$GameResponse)))));
var $author$project$Domain$GameResponse$gameResponseDecodeValue = function (encoded) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Domain$GameResponse$gameResponseDecoder, encoded);
	if (_v0.$ === 'Ok') {
		var gameResponse = _v0.a;
		return gameResponse;
	} else {
		var message = _v0.a;
		return $author$project$Domain$GameResponse$emptyGameResponse;
	}
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$getDragstartEvent = function (msg) {
	if (msg.$ === 'DragStart') {
		var dragId = msg.a;
		var event = msg.b;
		return $elm$core$Maybe$Just(
			{dragId: dragId, event: event});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Play$getHandCard = F2(
	function (model, index) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			A2(
				$elm$core$Array$get,
				index,
				$elm$core$Array$fromList(model.hand)));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Play$handCardsMergedWithResponse = F2(
	function (handCards, responseCards) {
		var handCardsInResponse = A2(
			$elm$core$List$filterMap,
			function (_v0) {
				var dtoCard = _v0.a;
				return A2($elm$core$List$member, dtoCard, responseCards) ? $elm$core$Maybe$Just(dtoCard) : $elm$core$Maybe$Nothing;
			},
			handCards);
		var responseNotInHand = A2(
			$elm$core$List$filter,
			function (dtoCard) {
				return !A2($elm$core$List$member, dtoCard, handCardsInResponse);
			},
			responseCards);
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (dtoCard) {
					return _Utils_Tuple2(dtoCard, false);
				},
				handCardsInResponse),
			A2(
				$elm$core$List$map,
				function (dtoCard) {
					return _Utils_Tuple2(dtoCard, true);
				},
				responseNotInHand));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Play$handMove = F3(
	function (hand, from, to) {
		return _Utils_eq(from, to) ? hand : ((_Utils_cmp(from, to) < 0) ? $elm$core$List$concat(
			_List_fromArray(
				[
					A2($elm$core$List$take, from, hand),
					A2(
					$elm$core$List$take,
					to - from,
					A2($elm$core$List$drop, from + 1, hand)),
					A2(
					$elm$core$List$take,
					1,
					A2($elm$core$List$drop, from, hand)),
					A2($elm$core$List$drop, to + 1, hand)
				])) : $elm$core$List$concat(
			_List_fromArray(
				[
					A2($elm$core$List$take, to + 1, hand),
					A2(
					$elm$core$List$take,
					1,
					A2($elm$core$List$drop, from, hand)),
					A2(
					$elm$core$List$take,
					(from - to) - 1,
					A2($elm$core$List$drop, to + 1, hand)),
					A2($elm$core$List$drop, from + 1, hand)
				])));
	});
var $author$project$Domain$TypeResponse$GetResponse = {$: 'GetResponse'};
var $author$project$Domain$HandResponse$emptyHandResponse = {cards: _List_Nil, handPosition: 0, typeResponse: $author$project$Domain$TypeResponse$GetResponse};
var $author$project$Domain$HandResponse$HandResponse = F3(
	function (typeResponse, cards, handPosition) {
		return {cards: cards, handPosition: handPosition, typeResponse: typeResponse};
	});
var $author$project$Domain$DTOcard$Regular = function (a) {
	return {$: 'Regular', a: a};
};
var $author$project$Domain$DTOcard$RegularCard = F4(
	function (uuid, suit, rank, back) {
		return {back: back, rank: rank, suit: suit, uuid: uuid};
	});
var $author$project$Domain$DTOcard$LIGHT = {$: 'LIGHT'};
var $author$project$Domain$DTOcard$backFromString = function (string) {
	switch (string) {
		case 'DARK':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$DARK);
		case 'LIGHT':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$LIGHT);
		default:
			return $elm$json$Json$Decode$fail('Invalid back: ' + string);
	}
};
var $author$project$Domain$DTOcard$backDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$DTOcard$backFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$DTOcard$ACE = {$: 'ACE'};
var $author$project$Domain$DTOcard$JACK = {$: 'JACK'};
var $author$project$Domain$DTOcard$KING = {$: 'KING'};
var $author$project$Domain$DTOcard$N10 = {$: 'N10'};
var $author$project$Domain$DTOcard$N2 = {$: 'N2'};
var $author$project$Domain$DTOcard$N3 = {$: 'N3'};
var $author$project$Domain$DTOcard$N4 = {$: 'N4'};
var $author$project$Domain$DTOcard$N5 = {$: 'N5'};
var $author$project$Domain$DTOcard$N6 = {$: 'N6'};
var $author$project$Domain$DTOcard$N7 = {$: 'N7'};
var $author$project$Domain$DTOcard$N8 = {$: 'N8'};
var $author$project$Domain$DTOcard$N9 = {$: 'N9'};
var $author$project$Domain$DTOcard$QUEEN = {$: 'QUEEN'};
var $author$project$Domain$DTOcard$rankFromString = function (string) {
	switch (string) {
		case 'ACE':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$ACE);
		case 'KING':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$KING);
		case 'QUEEN':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$QUEEN);
		case 'JACK':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$JACK);
		case 'N10':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N10);
		case 'N9':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N9);
		case 'N8':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N8);
		case 'N7':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N7);
		case 'N6':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N6);
		case 'N5':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N5);
		case 'N4':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N4);
		case 'N3':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N3);
		case 'N2':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$N2);
		default:
			return $elm$json$Json$Decode$fail('Invalid rank: ' + string);
	}
};
var $author$project$Domain$DTOcard$rankDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$DTOcard$rankFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$DTOcard$CLUBS = {$: 'CLUBS'};
var $author$project$Domain$DTOcard$DIAMONDS = {$: 'DIAMONDS'};
var $author$project$Domain$DTOcard$HEARTS = {$: 'HEARTS'};
var $author$project$Domain$DTOcard$SPADES = {$: 'SPADES'};
var $author$project$Domain$DTOcard$suitFromString = function (string) {
	switch (string) {
		case 'CLUBS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$CLUBS);
		case 'DIAMONDS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$DIAMONDS);
		case 'HEARTS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$HEARTS);
		case 'SPADES':
			return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$SPADES);
		default:
			return $elm$json$Json$Decode$fail('Invalid suit: ' + string);
	}
};
var $author$project$Domain$DTOcard$suitDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$DTOcard$suitFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$DTOcard$dtoCardRegularDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'back',
	$author$project$Domain$DTOcard$backDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'rank',
		$author$project$Domain$DTOcard$rankDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'suit',
			$author$project$Domain$DTOcard$suitDecoder,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'uuid',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$RegularCard)))));
var $author$project$Domain$DTOcard$SpecialCard = F3(
	function (uuid, specialType, back) {
		return {back: back, specialType: specialType, uuid: uuid};
	});
var $author$project$Domain$DTOcard$specialTypeFromString = function (string) {
	if (string === 'JOKER') {
		return $elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$JOKER);
	} else {
		return $elm$json$Json$Decode$fail('Invalid specialType: ' + string);
	}
};
var $author$project$Domain$DTOcard$specialTypeDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$DTOcard$specialTypeFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$DTOcard$dtoCardSpecialDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'back',
	$author$project$Domain$DTOcard$backDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'specialType',
		$author$project$Domain$DTOcard$specialTypeDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'uuid',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$DTOcard$SpecialCard))));
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Domain$DTOcard$dtoCardDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $author$project$Domain$DTOcard$Regular, $author$project$Domain$DTOcard$dtoCardRegularDecoder),
			A2($elm$json$Json$Decode$map, $author$project$Domain$DTOcard$Special, $author$project$Domain$DTOcard$dtoCardSpecialDecoder)
		]));
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (_v0.$ === 'Ok') {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_v1.$ === 'Ok') {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Domain$TypeResponse$DealResponse = {$: 'DealResponse'};
var $author$project$Domain$TypeResponse$PutOnStackBottomResponse = {$: 'PutOnStackBottomResponse'};
var $author$project$Domain$TypeResponse$PutOnTableResponse = {$: 'PutOnTableResponse'};
var $author$project$Domain$TypeResponse$SlideOnTableReponse = {$: 'SlideOnTableReponse'};
var $author$project$Domain$TypeResponse$StartResponse = {$: 'StartResponse'};
var $author$project$Domain$TypeResponse$typeResponseFromString = function (string) {
	var _v0 = A2($elm$core$Debug$log, 'typeResponseFromString string = ', string);
	switch (_v0) {
		case 'PUT_ON_TABLE':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$PutOnTableResponse);
		case 'SLIDE_ON_TABLE':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$SlideOnTableReponse);
		case 'PUT_ON_STACK_BOTTOM':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$PutOnStackBottomResponse);
		case 'GET':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$GetResponse);
		case 'DEAL':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$DealResponse);
		case 'START':
			return $elm$json$Json$Decode$succeed($author$project$Domain$TypeResponse$StartResponse);
		default:
			return $elm$json$Json$Decode$fail('Invalid TypeResponse: ' + string);
	}
};
var $author$project$Domain$TypeResponse$typeResponseDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$TypeResponse$typeResponseFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$HandResponse$handResponseDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'handPosition',
	$elm$json$Json$Decode$int,
	0,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'cards',
		$elm$json$Json$Decode$list($author$project$Domain$DTOcard$dtoCardDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'typeResponse',
			$author$project$Domain$TypeResponse$typeResponseDecoder,
			$elm$json$Json$Decode$succeed($author$project$Domain$HandResponse$HandResponse))));
var $author$project$Domain$HandResponse$handResponseDecodeValue = function (encoded) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Domain$HandResponse$handResponseDecoder, encoded);
	if (_v0.$ === 'Ok') {
		var handResponse = _v0.a;
		return handResponse;
	} else {
		var message = _v0.a;
		return $author$project$Domain$HandResponse$emptyHandResponse;
	}
};
var $author$project$Play$handSelected = F2(
	function (dtoCardSelected, selectFilter) {
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var dtoCard = _v0.a;
					var selected = _v0.b;
					return _Utils_eq(selectFilter, selected);
				},
				dtoCardSelected));
	});
var $author$project$Domain$PlayRequest$DealRequest = {$: 'DealRequest'};
var $author$project$Domain$PlayRequest$makeDealRequest = function (session) {
	return {cardUUIDs: _List_Nil, gameUuid: session.gameUuid, handPosition: 0, playerUuid: session.playerUuid, tablePosition: 0, typeRequest: $author$project$Domain$PlayRequest$DealRequest};
};
var $author$project$Domain$PlayRequest$GetFromStackBottomRequest = {$: 'GetFromStackBottomRequest'};
var $author$project$Domain$PlayRequest$makeGetFromStackBottomRequest = F2(
	function (session, handPosition) {
		return {cardUUIDs: _List_Nil, gameUuid: session.gameUuid, handPosition: handPosition, playerUuid: session.playerUuid, tablePosition: 0, typeRequest: $author$project$Domain$PlayRequest$GetFromStackBottomRequest};
	});
var $author$project$Domain$PlayRequest$GetFromStackTopRequest = {$: 'GetFromStackTopRequest'};
var $author$project$Domain$PlayRequest$makeGetFromStackTopRequest = F2(
	function (session, handPosition) {
		return {cardUUIDs: _List_Nil, gameUuid: session.gameUuid, handPosition: handPosition, playerUuid: session.playerUuid, tablePosition: 0, typeRequest: $author$project$Domain$PlayRequest$GetFromStackTopRequest};
	});
var $author$project$Domain$PlayRequest$PutOnStackBottomRequest = {$: 'PutOnStackBottomRequest'};
var $author$project$Domain$DTOcard$getUUID = function (card) {
	if (card.$ === 'Regular') {
		var uuid = card.a.uuid;
		return uuid;
	} else {
		var uuid = card.a.uuid;
		return uuid;
	}
};
var $author$project$Domain$DTOcard$getUUIDs = function (cards) {
	return A2($elm$core$List$map, $author$project$Domain$DTOcard$getUUID, cards);
};
var $author$project$Domain$PlayRequest$makePutOnStackBottomRequest = F3(
	function (session, cards, handPosition) {
		return {
			cardUUIDs: $author$project$Domain$DTOcard$getUUIDs(cards),
			gameUuid: session.gameUuid,
			handPosition: handPosition,
			playerUuid: session.playerUuid,
			tablePosition: 0,
			typeRequest: $author$project$Domain$PlayRequest$PutOnStackBottomRequest
		};
	});
var $author$project$Domain$PlayRequest$PutOnTableRequest = {$: 'PutOnTableRequest'};
var $author$project$Domain$PlayRequest$makePutOnTableRequest = F2(
	function (session, cards) {
		return {
			cardUUIDs: $author$project$Domain$DTOcard$getUUIDs(cards),
			gameUuid: session.gameUuid,
			handPosition: 0,
			playerUuid: session.playerUuid,
			tablePosition: 0,
			typeRequest: $author$project$Domain$PlayRequest$PutOnTableRequest
		};
	});
var $author$project$Domain$PlayRequest$SlideOnTableRequest = {$: 'SlideOnTableRequest'};
var $author$project$Domain$PlayRequest$makeSlideOnTableRequest = F4(
	function (session, cards, handPosition, tablePosition) {
		return {
			cardUUIDs: $author$project$Domain$DTOcard$getUUIDs(cards),
			gameUuid: session.gameUuid,
			handPosition: handPosition,
			playerUuid: session.playerUuid,
			tablePosition: tablePosition,
			typeRequest: $author$project$Domain$PlayRequest$SlideOnTableRequest
		};
	});
var $author$project$Domain$DTOcard$allOfOneKindHelper = F2(
	function (aa, _v0) {
		var bool = _v0.a;
		var maybeA = _v0.b;
		if (maybeA.$ === 'Nothing') {
			return _Utils_Tuple2(
				bool,
				$elm$core$Maybe$Just(aa));
		} else {
			var aa1 = maybeA.a;
			return _Utils_Tuple2(
				bool && _Utils_eq(aa1, aa),
				$elm$core$Maybe$Just(aa));
		}
	});
var $author$project$Domain$DTOcard$allOfOneKind = function (lista) {
	return A3(
		$elm$core$List$foldl,
		$author$project$Domain$DTOcard$allOfOneKindHelper,
		_Utils_Tuple2(true, $elm$core$Maybe$Nothing),
		lista).a;
};
var $author$project$Domain$DTOcard$cardRegular = function (card) {
	if (card.$ === 'Special') {
		return $elm$core$Maybe$Nothing;
	} else {
		var rcard = card.a;
		return $elm$core$Maybe$Just(rcard);
	}
};
var $author$project$Domain$DTOcard$cardsRegulars = function (cards) {
	return A2($elm$core$List$filterMap, $author$project$Domain$DTOcard$cardRegular, cards);
};
var $author$project$Domain$DTOcard$numerizeRank = function (rank) {
	switch (rank.$) {
		case 'ACE':
			return 1;
		case 'KING':
			return 13;
		case 'QUEEN':
			return 12;
		case 'JACK':
			return 11;
		case 'N10':
			return 10;
		case 'N9':
			return 9;
		case 'N8':
			return 8;
		case 'N7':
			return 7;
		case 'N6':
			return 6;
		case 'N5':
			return 5;
		case 'N4':
			return 4;
		case 'N3':
			return 3;
		default:
			return 2;
	}
};
var $author$project$Domain$DTOcard$numerizeRankHighest = function (rank) {
	if (rank.$ === 'ACE') {
		return 14;
	} else {
		return $author$project$Domain$DTOcard$numerizeRank(rank);
	}
};
var $author$project$Domain$DTOcard$meldRunSorted = F3(
	function (numberOfWildCards, lastRank, cards) {
		meldRunSorted:
		while (true) {
			if (!cards.b) {
				return true;
			} else {
				var card = cards.a;
				var rest = cards.b;
				var _v1 = _Utils_Tuple2(card, lastRank);
				if (_v1.a.$ === 'Special') {
					if (_v1.b.$ === 'Nothing') {
						var _v3 = _v1.b;
						var $temp$numberOfWildCards = numberOfWildCards + 1,
							$temp$lastRank = $elm$core$Maybe$Nothing,
							$temp$cards = rest;
						numberOfWildCards = $temp$numberOfWildCards;
						lastRank = $temp$lastRank;
						cards = $temp$cards;
						continue meldRunSorted;
					} else {
						var lastRank1 = _v1.b.a;
						if (((lastRank1 + numberOfWildCards) + 1) > 14) {
							return false;
						} else {
							var $temp$numberOfWildCards = numberOfWildCards + 1,
								$temp$lastRank = $elm$core$Maybe$Just(lastRank1),
								$temp$cards = rest;
							numberOfWildCards = $temp$numberOfWildCards;
							lastRank = $temp$lastRank;
							cards = $temp$cards;
							continue meldRunSorted;
						}
					}
				} else {
					if (_v1.b.$ === 'Nothing') {
						var rank = _v1.a.a.rank;
						var _v2 = _v1.b;
						if (_Utils_cmp(
							$author$project$Domain$DTOcard$numerizeRank(rank),
							numberOfWildCards) < 1) {
							return false;
						} else {
							var $temp$numberOfWildCards = 0,
								$temp$lastRank = $elm$core$Maybe$Just(
								$author$project$Domain$DTOcard$numerizeRank(rank)),
								$temp$cards = rest;
							numberOfWildCards = $temp$numberOfWildCards;
							lastRank = $temp$lastRank;
							cards = $temp$cards;
							continue meldRunSorted;
						}
					} else {
						var rank = _v1.a.a.rank;
						var lastRank1 = _v1.b.a;
						if (_Utils_eq(
							(lastRank1 + numberOfWildCards) + 1,
							$author$project$Domain$DTOcard$numerizeRankHighest(rank))) {
							var $temp$numberOfWildCards = 0,
								$temp$lastRank = $elm$core$Maybe$Just(
								$author$project$Domain$DTOcard$numerizeRankHighest(rank)),
								$temp$cards = rest;
							numberOfWildCards = $temp$numberOfWildCards;
							lastRank = $temp$lastRank;
							cards = $temp$cards;
							continue meldRunSorted;
						} else {
							return false;
						}
					}
				}
			}
		}
	});
var $author$project$Domain$DTOcard$meldSorted = function (cards) {
	return $author$project$Domain$DTOcard$allOfOneKind(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.rank;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards))) ? true : A3($author$project$Domain$DTOcard$meldRunSorted, 0, $elm$core$Maybe$Nothing, cards);
};
var $author$project$Domain$DTOcard$cardSpecial = function (card) {
	if (card.$ === 'Special') {
		var scard = card.a;
		return $elm$core$Maybe$Just(scard);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Domain$DTOcard$cardsSpecials = function (cards) {
	return A2($elm$core$List$filterMap, $author$project$Domain$DTOcard$cardSpecial, cards);
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Domain$DTOcard$numerizeRankLowest = function (rank) {
	if (rank.$ === 'ACE') {
		return 1;
	} else {
		return $author$project$Domain$DTOcard$numerizeRank(rank);
	}
};
var $author$project$Domain$DTOcard$regularToCard = function (rcard) {
	return $author$project$Domain$DTOcard$Regular(rcard);
};
var $author$project$Domain$DTOcard$specialToCard = function (scard) {
	return $author$project$Domain$DTOcard$Special(scard);
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Domain$DTOcard$distributeJokersInSortedMeldRun = F3(
	function (cards, rCards, sCards) {
		distributeJokersInSortedMeldRun:
		while (true) {
			var _v0 = _Utils_Tuple2(rCards, sCards);
			if (!_v0.a.b) {
				return A2(
					$elm$core$List$append,
					cards,
					A2($elm$core$List$map, $author$project$Domain$DTOcard$specialToCard, sCards));
			} else {
				if (!_v0.b.b) {
					return A2(
						$elm$core$List$append,
						cards,
						A2($elm$core$List$map, $author$project$Domain$DTOcard$regularToCard, rCards));
				} else {
					if (!_v0.a.b.b) {
						var _v1 = _v0.a;
						var rCard = _v1.a;
						var _v2 = _v0.b;
						var sCard = _v2.a;
						var sCardsRest = _v2.b;
						var numberOfPlacesLeft = 1;
						var highestCardsRank = $author$project$Domain$DTOcard$numerizeRankHighest(rCard.rank);
						var lowestCardsRank = highestCardsRank;
						var cardsToDistribute = $elm$core$List$length(rCards) + $elm$core$List$length(sCards);
						if ((_Utils_cmp(cardsToDistribute, numberOfPlacesLeft) > 0) && (_Utils_cmp(
							lowestCardsRank,
							$elm$core$List$length(cards) + 1) > 0)) {
							var $temp$cards = A2(
								$elm$core$List$append,
								cards,
								_List_fromArray(
									[
										$author$project$Domain$DTOcard$specialToCard(sCard)
									])),
								$temp$rCards = rCards,
								$temp$sCards = sCardsRest;
							cards = $temp$cards;
							rCards = $temp$rCards;
							sCards = $temp$sCards;
							continue distributeJokersInSortedMeldRun;
						} else {
							var $temp$cards = A2(
								$elm$core$List$append,
								cards,
								_List_fromArray(
									[
										$author$project$Domain$DTOcard$regularToCard(rCard)
									])),
								$temp$rCards = _List_Nil,
								$temp$sCards = sCards;
							cards = $temp$cards;
							rCards = $temp$rCards;
							sCards = $temp$sCards;
							continue distributeJokersInSortedMeldRun;
						}
					} else {
						var _v3 = _v0.a;
						var rCard = _v3.a;
						var rCardsRest = _v3.b;
						var _v4 = _v0.b;
						var sCard = _v4.a;
						var sCardsRest = _v4.b;
						var lowestCardsRank = $author$project$Domain$DTOcard$numerizeRankLowest(rCard.rank);
						var highestCardsRank = A2(
							$elm$core$Maybe$withDefault,
							14,
							A2(
								$elm$core$Maybe$map,
								$author$project$Domain$DTOcard$numerizeRankHighest,
								A2(
									$elm$core$Maybe$map,
									function ($) {
										return $.rank;
									},
									$elm$core$List$head(
										A2(
											$elm$core$List$drop,
											$elm$core$List$length(rCards) - 1,
											rCards)))));
						var numberOfPlacesLeft = A2(
							$elm$core$Basics$max,
							0,
							(highestCardsRank - $author$project$Domain$DTOcard$numerizeRank(rCard.rank)) + 1);
						var cardsToDistribute = $elm$core$List$length(rCards) + $elm$core$List$length(sCards);
						if ((_Utils_cmp(cardsToDistribute, numberOfPlacesLeft) > 0) && (_Utils_cmp(
							lowestCardsRank,
							$elm$core$List$length(cards) + 1) > 0)) {
							var $temp$cards = A2(
								$elm$core$List$append,
								cards,
								_List_fromArray(
									[
										$author$project$Domain$DTOcard$specialToCard(sCard)
									])),
								$temp$rCards = rCards,
								$temp$sCards = sCardsRest;
							cards = $temp$cards;
							rCards = $temp$rCards;
							sCards = $temp$sCards;
							continue distributeJokersInSortedMeldRun;
						} else {
							var $temp$cards = A2(
								$elm$core$List$append,
								cards,
								_List_fromArray(
									[
										$author$project$Domain$DTOcard$regularToCard(rCard)
									])),
								$temp$rCards = rCardsRest,
								$temp$sCards = sCards;
							cards = $temp$cards;
							rCards = $temp$rCards;
							sCards = $temp$sCards;
							continue distributeJokersInSortedMeldRun;
						}
					}
				}
			}
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Domain$DTOcard$meldRunSorter = function (cards) {
	var withoutAcesSorted = A2(
		$elm$core$List$sortBy,
		function (rcard) {
			return $author$project$Domain$DTOcard$numerizeRank(
				function ($) {
					return $.rank;
				}(rcard));
		},
		A2(
			$elm$core$List$filter,
			function (_v5) {
				var rank = _v5.rank;
				return !_Utils_eq(rank, $author$project$Domain$DTOcard$ACE);
			},
			cards));
	var onlyAces = A2(
		$elm$core$List$filter,
		function (_v4) {
			var rank = _v4.rank;
			return _Utils_eq(rank, $author$project$Domain$DTOcard$ACE);
		},
		cards);
	var lowestRank = $elm$core$List$head(withoutAcesSorted);
	var highestRank = $elm$core$List$head(
		A2(
			$elm$core$List$drop,
			$elm$core$List$length(withoutAcesSorted) - 1,
			withoutAcesSorted));
	var _v0 = _Utils_Tuple3(onlyAces, lowestRank, highestRank);
	if (!_v0.a.b) {
		return withoutAcesSorted;
	} else {
		if (_v0.b.$ === 'Nothing') {
			var _v1 = _v0.b;
			return withoutAcesSorted;
		} else {
			if (_v0.c.$ === 'Nothing') {
				var _v2 = _v0.c;
				return withoutAcesSorted;
			} else {
				var _v3 = _v0.a;
				var ace = _v3.a;
				var rest = _v3.b;
				var lowest = _v0.b.a;
				var highest = _v0.c.a;
				return (_Utils_cmp(
					(-2) + $author$project$Domain$DTOcard$numerizeRank(lowest.rank),
					13 - $author$project$Domain$DTOcard$numerizeRank(highest.rank)) > 0) ? A2($elm$core$List$append, withoutAcesSorted, onlyAces) : A2($elm$core$List$append, onlyAces, withoutAcesSorted);
			}
		}
	}
};
var $author$project$Domain$DTOcard$meldSorter = function (cards) {
	if ($author$project$Domain$DTOcard$allOfOneKind(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.rank;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards)))) {
		return cards;
	} else {
		var scards = $author$project$Domain$DTOcard$cardsSpecials(cards);
		var rcards = $author$project$Domain$DTOcard$meldRunSorter(
			$author$project$Domain$DTOcard$cardsRegulars(cards));
		return A3($author$project$Domain$DTOcard$distributeJokersInSortedMeldRun, _List_Nil, rcards, scards);
	}
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Domain$PlayRequest$typeRequestEncoder = function (typeRequest) {
	switch (typeRequest.$) {
		case 'GetFromStackBottomRequest':
			return $elm$json$Json$Encode$string('GET_FROM_STACK_BOTTOM');
		case 'GetFromStackTopRequest':
			return $elm$json$Json$Encode$string('GET_FROM_STACK_TOP');
		case 'PutOnStackBottomRequest':
			return $elm$json$Json$Encode$string('PUT_ON_STACK_BOTTOM');
		case 'DealRequest':
			return $elm$json$Json$Encode$string('DEAL');
		case 'PutOnTableRequest':
			return $elm$json$Json$Encode$string('PUT_ON_TABLE');
		default:
			return $elm$json$Json$Encode$string('SLIDE_ON_TABLE');
	}
};
var $author$project$Domain$PlayRequest$playRequestEncoder = function (_v0) {
	var typeRequest = _v0.typeRequest;
	var gameUuid = _v0.gameUuid;
	var playerUuid = _v0.playerUuid;
	var cardUUIDs = _v0.cardUUIDs;
	var handPosition = _v0.handPosition;
	var tablePosition = _v0.tablePosition;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'typeRequest',
				$author$project$Domain$PlayRequest$typeRequestEncoder(typeRequest)),
				_Utils_Tuple2(
				'gameUuid',
				$elm$json$Json$Encode$string(gameUuid)),
				_Utils_Tuple2(
				'playerUuid',
				$elm$json$Json$Encode$string(playerUuid)),
				_Utils_Tuple2(
				'cardUUIDs',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, cardUUIDs)),
				_Utils_Tuple2(
				'handPosition',
				$elm$json$Json$Encode$int(handPosition)),
				_Utils_Tuple2(
				'tablePosition',
				$elm$json$Json$Encode$int(tablePosition))
			]));
};
var $author$project$Domain$PlayResponse$emptyPlayResponse = {bottomCard: $author$project$Domain$DTOcard$defaultDTOcard, cards: _List_Nil, handPosition: 0, tablePosition: 0, topCardBack: $author$project$Domain$DTOcard$DARK, typeResponse: $author$project$Domain$TypeResponse$GetResponse};
var $author$project$Domain$PlayResponse$PlayResponse = F6(
	function (bottomCard, topCardBack, typeResponse, cards, handPosition, tablePosition) {
		return {bottomCard: bottomCard, cards: cards, handPosition: handPosition, tablePosition: tablePosition, topCardBack: topCardBack, typeResponse: typeResponse};
	});
var $author$project$Domain$PlayResponse$playResponseDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'tablePosition',
	$elm$json$Json$Decode$int,
	0,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'handPosition',
		$elm$json$Json$Decode$int,
		0,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'cards',
			$elm$json$Json$Decode$list($author$project$Domain$DTOcard$dtoCardDecoder),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'typeResponse',
				$author$project$Domain$TypeResponse$typeResponseDecoder,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'topCardBack',
					$author$project$Domain$DTOcard$backDecoder,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'bottomCard',
						$author$project$Domain$DTOcard$dtoCardDecoder,
						$elm$json$Json$Decode$succeed($author$project$Domain$PlayResponse$PlayResponse)))))));
var $author$project$Domain$PlayResponse$playResponseDecodeValue = function (encoded) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Domain$PlayResponse$playResponseDecoder, encoded);
	if (_v0.$ === 'Ok') {
		var playResponse = _v0.a;
		return playResponse;
	} else {
		var message = _v0.a;
		return $author$project$Domain$PlayResponse$emptyPlayResponse;
	}
};
var $author$project$Play$playSend = _Platform_outgoingPort('playSend', $elm$core$Basics$identity);
var $author$project$Play$tableAdd = F3(
	function (table, cards, index) {
		return $elm$core$List$concat(
			_List_fromArray(
				[
					A2($elm$core$List$take, index + 1, table),
					_List_fromArray(
					[cards]),
					A2($elm$core$List$drop, index + 1, table)
				]));
	});
var $author$project$Play$tableMod = F3(
	function (table, cards, index) {
		return $elm$core$List$concat(
			_List_fromArray(
				[
					A2($elm$core$List$take, index, table),
					_List_fromArray(
					[cards]),
					A2($elm$core$List$drop, index + 1, table)
				]));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver = F4(
	function (a, b, c, d) {
		return {$: 'DraggedOver', a: a, b: b, c: c, d: d};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging = function (a) {
	return {$: 'Dragging', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$updateCommon = F3(
	function (sticky, msg, model) {
		var _v0 = _Utils_Tuple3(msg, model, sticky);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 'DragStart':
					var _v1 = _v0.a;
					var dragId = _v1.a;
					return _Utils_Tuple2(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging(dragId),
						$elm$core$Maybe$Nothing);
				case 'DragEnd':
					var _v2 = _v0.a;
					return _Utils_Tuple2($norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging, $elm$core$Maybe$Nothing);
				case 'DragEnter':
					switch (_v0.b.$) {
						case 'Dragging':
							var dropId = _v0.a.a;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								A4($norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver, dragId, dropId, 0, $elm$core$Maybe$Nothing),
								$elm$core$Maybe$Nothing);
						case 'DraggedOver':
							var dropId = _v0.a.a;
							var _v3 = _v0.b;
							var dragId = _v3.a;
							var pos = _v3.d;
							return _Utils_Tuple2(
								A4($norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver, dragId, dropId, 0, pos),
								$elm$core$Maybe$Nothing);
						default:
							break _v0$9;
					}
				case 'DragLeave':
					if ((_v0.b.$ === 'DraggedOver') && (!_v0.c)) {
						var dropId_ = _v0.a.a;
						var _v4 = _v0.b;
						var dragId = _v4.a;
						var dropId = _v4.b;
						return _Utils_eq(dropId_, dropId) ? _Utils_Tuple2(
							$norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging(dragId),
							$elm$core$Maybe$Nothing) : _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
					} else {
						break _v0$9;
					}
				case 'DragOver':
					switch (_v0.b.$) {
						case 'Dragging':
							var _v5 = _v0.a;
							var dropId = _v5.a;
							var timeStamp = _v5.b;
							var pos = _v5.c;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								A4(
									$norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver,
									dragId,
									dropId,
									timeStamp,
									$elm$core$Maybe$Just(pos)),
								$elm$core$Maybe$Nothing);
						case 'DraggedOver':
							var _v6 = _v0.a;
							var dropId = _v6.a;
							var timeStamp = _v6.b;
							var pos = _v6.c;
							var _v7 = _v0.b;
							var dragId = _v7.a;
							var currentDropId = _v7.b;
							var currentTimeStamp = _v7.c;
							var currentPos = _v7.d;
							return _Utils_eq(timeStamp, currentTimeStamp) ? _Utils_Tuple2(model, $elm$core$Maybe$Nothing) : _Utils_Tuple2(
								A4(
									$norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver,
									dragId,
									dropId,
									timeStamp,
									$elm$core$Maybe$Just(pos)),
								$elm$core$Maybe$Nothing);
						default:
							break _v0$9;
					}
				default:
					switch (_v0.b.$) {
						case 'Dragging':
							var _v8 = _v0.a;
							var dropId = _v8.a;
							var pos = _v8.b;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								$norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging,
								$elm$core$Maybe$Just(
									_Utils_Tuple3(dragId, dropId, pos)));
						case 'DraggedOver':
							var _v9 = _v0.a;
							var dropId = _v9.a;
							var pos = _v9.b;
							var _v10 = _v0.b;
							var dragId = _v10.a;
							return _Utils_Tuple2(
								$norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging,
								$elm$core$Maybe$Just(
									_Utils_Tuple3(dragId, dropId, pos)));
						default:
							break _v0$9;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$update = $norpan$elm_html5_drag_drop$Html5$DragDrop$updateCommon(false);
var $author$project$Play$update = F3(
	function (msg, model, session) {
		switch (msg.$) {
			case 'GameReceiver':
				var encoded = msg.a;
				var _v1 = A2(
					$elm$core$Debug$log,
					'Game ',
					$author$project$Domain$GameResponse$gameResponseDecodeValue(encoded));
				var typeResponse = _v1.typeResponse;
				var phase = _v1.phase;
				var players = _v1.players;
				var currentPlayerUuid = _v1.currentPlayerUuid;
				if (typeResponse.$ === 'GAME') {
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: _Utils_update(
							model,
							{currentPlayerUuid: currentPlayerUuid, phase: phase, players: players}),
						session: session
					};
				} else {
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: _Utils_update(
							model,
							{players: players}),
						session: session
					};
				}
			case 'PlayReceiver':
				var encoded = msg.a;
				var _v3 = A2(
					$elm$core$Debug$log,
					'Play ',
					$author$project$Domain$PlayResponse$playResponseDecodeValue(encoded));
				var bottomCard = _v3.bottomCard;
				var topCardBack = _v3.topCardBack;
				var typeResponse = _v3.typeResponse;
				var cards = _v3.cards;
				var tablePosition = _v3.tablePosition;
				switch (typeResponse.$) {
					case 'DealResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{bottomCard: bottomCard, topCardBack: topCardBack}),
							session: session
						};
					case 'PutOnTableResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									bottomCard: bottomCard,
									table: function () {
										if (!cards.b) {
											return model.table;
										} else {
											return A3(
												$author$project$Play$tableAdd,
												model.table,
												cards,
												A2($elm$core$Debug$log, 'update TABLE numberofcards', tablePosition));
										}
									}(),
									topCardBack: topCardBack
								}),
							session: session
						};
					case 'SlideOnTableReponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									bottomCard: bottomCard,
									table: function () {
										if (!cards.b) {
											return model.table;
										} else {
											return A3(
												$author$project$Play$tableMod,
												model.table,
												cards,
												A2($elm$core$Debug$log, 'update TABLE tablePosition', tablePosition));
										}
									}(),
									topCardBack: topCardBack
								}),
							session: session
						};
					case 'PutOnStackBottomResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{bottomCard: bottomCard, topCardBack: topCardBack}),
							session: session
						};
					case 'GetResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{bottomCard: bottomCard, topCardBack: topCardBack}),
							session: session
						};
					default:
						return {
							cmd: $author$project$Play$playSend(
								$author$project$Domain$PlayRequest$playRequestEncoder(
									$author$project$Domain$PlayRequest$makeDealRequest(session))),
							model: model,
							session: session
						};
				}
			case 'HandReceiver':
				var encoded = msg.a;
				var _v7 = $author$project$Domain$HandResponse$handResponseDecodeValue(encoded);
				var typeResponse = _v7.typeResponse;
				var cards = _v7.cards;
				var handPosition = _v7.handPosition;
				switch (typeResponse.$) {
					case 'DealResponse':
						var a = A2($elm$core$Debug$log, 'DealResponse cards=', cards);
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									hand: A2(
										$elm$core$List$map,
										function (card) {
											return _Utils_Tuple2(card, false);
										},
										cards),
									pending: false
								}),
							session: session
						};
					case 'PutOnTableResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									hand: A2($author$project$Play$handCardsMergedWithResponse, model.hand, cards),
									pending: false
								}),
							session: session
						};
					case 'SlideOnTableReponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									hand: A2($author$project$Play$handCardsMergedWithResponse, model.hand, cards),
									pending: false
								}),
							session: session
						};
					case 'PutOnStackBottomResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									hand: A2($author$project$Play$handCardsMergedWithResponse, model.hand, cards),
									pending: false
								}),
							session: session
						};
					case 'GetResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									hand: A2($author$project$Play$handCardsMergedWithResponse, model.hand, cards),
									pending: false
								}),
							session: session
						};
					default:
						return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			case 'DragDropMsg':
				var msg_ = msg.a;
				var _v9 = A2($norpan$elm_html5_drag_drop$Html5$DragDrop$update, msg_, model.dragDrop);
				var dragDropModel = _v9.a;
				var dragDropResult = _v9.b;
				var _v10 = function () {
					_v11$7:
					while (true) {
						if (dragDropResult.$ === 'Nothing') {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{dragDrop: dragDropModel}),
								$elm$core$Platform$Cmd$none);
						} else {
							switch (dragDropResult.a.b.$) {
								case 'DropBottomCard':
									if (dragDropResult.a.a.$ === 'DragHand') {
										var _v16 = dragDropResult.a;
										var index = _v16.a.a;
										var _v17 = _v16.b;
										var _v18 = A2($author$project$Play$getHandCard, model, index);
										if (_v18.$ === 'Just') {
											var card = _v18.a;
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel, pending: true}),
												$author$project$Play$playSend(
													$author$project$Domain$PlayRequest$playRequestEncoder(
														A3(
															$author$project$Domain$PlayRequest$makePutOnStackBottomRequest,
															session,
															_List_fromArray(
																[card]),
															index))));
										} else {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel}),
												$elm$core$Platform$Cmd$none);
										}
									} else {
										break _v11$7;
									}
								case 'DropHand':
									switch (dragDropResult.a.a.$) {
										case 'DragBottomCard':
											var _v12 = dragDropResult.a;
											var _v13 = _v12.a;
											var index = _v12.b.a;
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel, pending: true}),
												$author$project$Play$playSend(
													$author$project$Domain$PlayRequest$playRequestEncoder(
														A2($author$project$Domain$PlayRequest$makeGetFromStackBottomRequest, session, index))));
										case 'DragTopCard':
											var _v14 = dragDropResult.a;
											var _v15 = _v14.a;
											var index = _v14.b.a;
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel, pending: true}),
												$author$project$Play$playSend(
													$author$project$Domain$PlayRequest$playRequestEncoder(
														A2($author$project$Domain$PlayRequest$makeGetFromStackTopRequest, session, index))));
										case 'DragHand':
											var _v19 = dragDropResult.a;
											var from = _v19.a.a;
											var to = _v19.b.a;
											var _v20 = A2($author$project$Play$getHandCard, model, from);
											if (_v20.$ === 'Just') {
												var card = _v20.a;
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{
															dragDrop: dragDropModel,
															hand: A3($author$project$Play$handMove, model.hand, from, to)
														}),
													$elm$core$Platform$Cmd$none);
											} else {
												return _Utils_Tuple2(
													_Utils_update(
														model,
														{dragDrop: dragDropModel}),
													$elm$core$Platform$Cmd$none);
											}
										default:
											break _v11$7;
									}
								case 'DropTable':
									if (dragDropResult.a.a.$ === 'DragHandSelected') {
										var _v21 = dragDropResult.a;
										var _v22 = _v21.a;
										var _v23 = _v21.b;
										var cards = function (cards1) {
											return $author$project$Domain$DTOcard$meldSorted(cards1) ? cards1 : $author$project$Domain$DTOcard$meldSorter(cards1);
										}(
											A2(
												$elm$core$Debug$log,
												'DragHandSelected, DropTable ',
												A2($author$project$Play$handSelected, model.hand, true)));
										return _Utils_Tuple2(
											_Utils_update(
												model,
												{dragDrop: dragDropModel, pending: true}),
											$author$project$Play$playSend(
												$author$project$Domain$PlayRequest$playRequestEncoder(
													A2($author$project$Domain$PlayRequest$makePutOnTableRequest, session, cards))));
									} else {
										break _v11$7;
									}
								default:
									if (dragDropResult.a.a.$ === 'DragHand') {
										var _v24 = dragDropResult.a;
										var from = _v24.a.a;
										var _v25 = _v24.b;
										var toTable = _v25.a;
										var toIndex = _v25.b;
										var _v26 = _Utils_Tuple2(
											A2(
												$elm$core$Maybe$map,
												$elm$core$Tuple$first,
												A2(
													$elm$core$Array$get,
													from,
													$elm$core$Array$fromList(model.hand))),
											A2(
												$elm$core$Array$get,
												toTable,
												$elm$core$Array$fromList(model.table)));
										if ((_v26.a.$ === 'Just') && (_v26.b.$ === 'Just')) {
											var draggedCard = _v26.a.a;
											var tableCards = _v26.b.a;
											var cardsAfterDrop = $elm$core$List$concat(
												_List_fromArray(
													[
														A2($elm$core$List$take, toIndex, tableCards),
														_List_fromArray(
														[draggedCard]),
														A2($elm$core$List$drop, toIndex + 1, tableCards)
													]));
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel, pending: true}),
												$author$project$Play$playSend(
													$author$project$Domain$PlayRequest$playRequestEncoder(
														A4($author$project$Domain$PlayRequest$makeSlideOnTableRequest, session, cardsAfterDrop, from, toTable))));
										} else {
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{dragDrop: dragDropModel}),
												$elm$core$Platform$Cmd$none);
										}
									} else {
										break _v11$7;
									}
							}
						}
					}
					var _v27 = dragDropResult.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dragDrop: dragDropModel}),
						$elm$core$Platform$Cmd$none);
				}();
				var model1 = _v10.a;
				var cmd = _v10.b;
				return {
					cmd: $elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								cmd,
								A2(
								$elm$core$Maybe$withDefault,
								$elm$core$Platform$Cmd$none,
								A2(
									$elm$core$Maybe$map,
									A2(
										$elm$core$Basics$composeR,
										function ($) {
											return $.event;
										},
										$author$project$Play$dragstart),
									$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragstartEvent(msg_)))
							])),
					model: model1,
					session: session
				};
			default:
				var _int = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							hand: A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, _v28) {
										var card = _v28.a;
										var selected = _v28.b;
										return _Utils_eq(i, _int) ? _Utils_Tuple2(card, !selected) : _Utils_Tuple2(card, selected);
									}),
								model.hand)
						}),
					session: session
				};
		}
	});
var $author$project$Signup$PhaseCreated = function (a) {
	return {$: 'PhaseCreated', a: a};
};
var $author$project$Signup$PhaseJoined = function (a) {
	return {$: 'PhaseJoined', a: a};
};
var $author$project$Signup$PhaseStart = {$: 'PhaseStart'};
var $author$project$Domain$SignupRequest$CreateRequest = {$: 'CreateRequest'};
var $author$project$Domain$SignupRequest$makeCreateRequest = F2(
	function (gameName, playerName) {
		return {gameName: gameName, gameUuid: '', playerName: playerName, typeRequest: $author$project$Domain$SignupRequest$CreateRequest};
	});
var $author$project$Domain$SignupRequest$DestroyRequest = {$: 'DestroyRequest'};
var $author$project$Domain$SignupRequest$makeDestroyRequest = function (gameUuid) {
	return {gameName: '', gameUuid: gameUuid, playerName: '', typeRequest: $author$project$Domain$SignupRequest$DestroyRequest};
};
var $author$project$Domain$SignupRequest$DetachRequest = {$: 'DetachRequest'};
var $author$project$Domain$SignupRequest$makeDetachRequest = F2(
	function (gameUuid, playerName) {
		return {gameName: '', gameUuid: gameUuid, playerName: playerName, typeRequest: $author$project$Domain$SignupRequest$DetachRequest};
	});
var $author$project$Domain$SignupRequest$JoinRequest = {$: 'JoinRequest'};
var $author$project$Domain$SignupRequest$makeJoinRequest = F2(
	function (gameUuid, playerName) {
		return {gameName: '', gameUuid: gameUuid, playerName: playerName, typeRequest: $author$project$Domain$SignupRequest$JoinRequest};
	});
var $author$project$Domain$SignupRequest$StartRequest = {$: 'StartRequest'};
var $author$project$Domain$SignupRequest$makeStartRequest = function (session) {
	return {gameName: '', gameUuid: session.gameUuid, playerName: session.playerName, typeRequest: $author$project$Domain$SignupRequest$StartRequest};
};
var $author$project$Domain$SignupAllResponse$GamesAndPlayersResponse = {$: 'GamesAndPlayersResponse'};
var $author$project$Domain$SignupAllResponse$emptySignupResponse = {gameUuid: '', games: _List_Nil, typeResponse: $author$project$Domain$SignupAllResponse$GamesAndPlayersResponse};
var $author$project$Domain$SignupAllResponse$SignupAllResponse = F3(
	function (gameUuid, typeResponse, games) {
		return {gameUuid: gameUuid, games: games, typeResponse: typeResponse};
	});
var $author$project$Domain$DTOgame$DTOgame = F5(
	function (gameName, started, gameUuid, players, creator) {
		return {creator: creator, gameName: gameName, gameUuid: gameUuid, players: players, started: started};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Domain$DTOgame$dtoGameDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'creator',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'players',
		$elm$json$Json$Decode$list($author$project$Domain$DTOplayer$dtoPlayerDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'gameUuid',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'started',
				$elm$json$Json$Decode$bool,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'gameName',
					$elm$json$Json$Decode$string,
					$elm$json$Json$Decode$succeed($author$project$Domain$DTOgame$DTOgame))))));
var $author$project$Domain$SignupAllResponse$StartResponse = {$: 'StartResponse'};
var $author$project$Domain$SignupAllResponse$typeResponseFromString = function (string) {
	var _v0 = A2($elm$core$Debug$log, 'typeResponseFromString string = ', string);
	switch (_v0) {
		case 'GAMES_AND_PLAYERS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$SignupAllResponse$GamesAndPlayersResponse);
		case 'START':
			return $elm$json$Json$Decode$succeed($author$project$Domain$SignupAllResponse$StartResponse);
		default:
			return $elm$json$Json$Decode$fail('Invalid TypeResponse: ' + string);
	}
};
var $author$project$Domain$SignupAllResponse$typeResponseDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$SignupAllResponse$typeResponseFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$SignupAllResponse$signupResponseDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'games',
	$elm$json$Json$Decode$list($author$project$Domain$DTOgame$dtoGameDecoder),
	_List_Nil,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'typeResponse',
		$author$project$Domain$SignupAllResponse$typeResponseDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'gameUuid',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$SignupAllResponse$SignupAllResponse))));
var $author$project$Domain$SignupAllResponse$signupAllResponseDecodeValue = function (encoded) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Domain$SignupAllResponse$signupResponseDecoder, encoded);
	if (_v0.$ === 'Ok') {
		var signupResponse = _v0.a;
		return signupResponse;
	} else {
		var message = _v0.a;
		var a = A2($elm$core$Debug$log, 'signupAllResponseDecodeValue Err ', message);
		return $author$project$Domain$SignupAllResponse$emptySignupResponse;
	}
};
var $author$project$Domain$SignupPersonalResponse$CreateResponse = {$: 'CreateResponse'};
var $author$project$Domain$SignupPersonalResponse$emptySignupResponse = {gameUuid: '', games: _List_Nil, playerUuid: '', typeResponse: $author$project$Domain$SignupPersonalResponse$CreateResponse};
var $author$project$Domain$SignupPersonalResponse$SignupPersonalResponse = F4(
	function (gameUuid, playerUuid, typeResponse, games) {
		return {gameUuid: gameUuid, games: games, playerUuid: playerUuid, typeResponse: typeResponse};
	});
var $author$project$Domain$SignupPersonalResponse$GamesAndPlayersResponse = {$: 'GamesAndPlayersResponse'};
var $author$project$Domain$SignupPersonalResponse$JoinResponse = {$: 'JoinResponse'};
var $author$project$Domain$SignupPersonalResponse$typeResponseFromString = function (string) {
	var _v0 = A2($elm$core$Debug$log, 'typeResponseFromString string = ', string);
	switch (_v0) {
		case 'CREATE':
			return $elm$json$Json$Decode$succeed($author$project$Domain$SignupPersonalResponse$CreateResponse);
		case 'JOIN':
			return $elm$json$Json$Decode$succeed($author$project$Domain$SignupPersonalResponse$JoinResponse);
		case 'GAMES_AND_PLAYERS':
			return $elm$json$Json$Decode$succeed($author$project$Domain$SignupPersonalResponse$GamesAndPlayersResponse);
		default:
			return $elm$json$Json$Decode$fail('Invalid TypeResponse: ' + string);
	}
};
var $author$project$Domain$SignupPersonalResponse$typeResponseDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Domain$SignupPersonalResponse$typeResponseFromString, $elm$json$Json$Decode$string);
var $author$project$Domain$SignupPersonalResponse$signupResponseDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'games',
	$elm$json$Json$Decode$list($author$project$Domain$DTOgame$dtoGameDecoder),
	_List_Nil,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'typeResponse',
		$author$project$Domain$SignupPersonalResponse$typeResponseDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'playerUuid',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'gameUuid',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Domain$SignupPersonalResponse$SignupPersonalResponse)))));
var $author$project$Domain$SignupPersonalResponse$signupPersonalResponseDecodeValue = function (encoded) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Domain$SignupPersonalResponse$signupResponseDecoder, encoded);
	if (_v0.$ === 'Ok') {
		var signupResponse = _v0.a;
		return signupResponse;
	} else {
		var message = _v0.a;
		var a = A2($elm$core$Debug$log, 'signupPersonalResponseDecodeValue Err ', message);
		return $author$project$Domain$SignupPersonalResponse$emptySignupResponse;
	}
};
var $author$project$Signup$update = F3(
	function (msg, model, session) {
		switch (msg.$) {
			case 'UpdateGameName':
				var newName = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: model,
					session: _Utils_update(
						session,
						{gameName: newName})
				};
			case 'UpdatePlayerName':
				var newName = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: model,
					session: _Utils_update(
						session,
						{playerName: newName})
				};
			case 'UpdateJoinGame':
				var gameUuid = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{joinGame: gameUuid}),
					session: _Utils_update(
						session,
						{gameUuid: gameUuid})
				};
			case 'DoCancel':
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
			case 'DoCreateGame':
				var gameName = msg.a;
				var playerName = msg.b;
				return {
					cmd: $author$project$Signup$signupSend(
						$author$project$Domain$SignupRequest$signupRequestEncoder(
							A2($author$project$Domain$SignupRequest$makeCreateRequest, gameName, playerName))),
					model: _Utils_update(
						model,
						{pending: true}),
					session: session
				};
			case 'DoCancelCreateGame':
				var gameUuid = msg.a;
				return {
					cmd: $author$project$Signup$signupSend(
						$author$project$Domain$SignupRequest$signupRequestEncoder(
							$author$project$Domain$SignupRequest$makeDestroyRequest(gameUuid))),
					model: _Utils_update(
						model,
						{joinGame: '', phase: $author$project$Signup$PhaseInit}),
					session: session
				};
			case 'DoJoinGame':
				var gameUuid = msg.a;
				return {
					cmd: $author$project$Signup$signupSend(
						$author$project$Domain$SignupRequest$signupRequestEncoder(
							A2($author$project$Domain$SignupRequest$makeJoinRequest, gameUuid, session.playerName))),
					model: _Utils_update(
						model,
						{
							pending: true,
							phase: $author$project$Signup$PhaseJoined(gameUuid)
						}),
					session: session
				};
			case 'DoCancelJoinGame':
				var gameUuid = msg.a;
				return {
					cmd: $author$project$Signup$signupSend(
						$author$project$Domain$SignupRequest$signupRequestEncoder(
							A2($author$project$Domain$SignupRequest$makeDetachRequest, gameUuid, session.playerName))),
					model: _Utils_update(
						model,
						{joinGame: '', phase: $author$project$Signup$PhaseInit}),
					session: session
				};
			case 'DoStartGame':
				return {
					cmd: $author$project$Signup$signupSend(
						$author$project$Domain$SignupRequest$signupRequestEncoder(
							$author$project$Domain$SignupRequest$makeStartRequest(session))),
					model: _Utils_update(
						model,
						{pending: true, phase: $author$project$Signup$PhaseStart}),
					session: session
				};
			case 'SignUpPersonal':
				var encoded = msg.a;
				var _v1 = A2(
					$elm$core$Debug$log,
					'signupResponseDecodeValue',
					$author$project$Domain$SignupPersonalResponse$signupPersonalResponseDecodeValue(encoded));
				var playerUuid = _v1.playerUuid;
				var gameUuid = _v1.gameUuid;
				var typeResponse = _v1.typeResponse;
				var games = _v1.games;
				switch (typeResponse.$) {
					case 'CreateResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									pending: false,
									phase: $author$project$Signup$PhaseCreated(gameUuid)
								}),
							session: _Utils_update(
								session,
								{gameUuid: gameUuid, playerUuid: playerUuid})
						};
					case 'JoinResponse':
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{pending: false}),
							session: _Utils_update(
								session,
								{gameUuid: gameUuid, playerUuid: playerUuid})
						};
					default:
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{games: games, pending: false}),
							session: _Utils_update(
								session,
								{gameUuid: gameUuid, playerUuid: playerUuid})
						};
				}
			default:
				var encoded = msg.a;
				var _v3 = A2(
					$elm$core$Debug$log,
					'signupResponseDecodeValue',
					$author$project$Domain$SignupAllResponse$signupAllResponseDecodeValue(encoded));
				var gameUuid = _v3.gameUuid;
				var typeResponse = _v3.typeResponse;
				var games = _v3.games;
				var _v4 = _Utils_Tuple2(model.phase, typeResponse);
				if (_v4.b.$ === 'GamesAndPlayersResponse') {
					if (_v4.a.$ === 'PhaseJoined') {
						var gameUuid1 = _v4.a.a;
						var _v5 = _v4.b;
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{
									games: games,
									phase: A2(
										$elm$core$List$any,
										function (game) {
											return _Utils_eq(game.gameUuid, gameUuid1) ? true : false;
										},
										games) ? model.phase : $author$project$Signup$PhaseInit
								}),
							session: session
						};
					} else {
						var _v6 = _v4.b;
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model,
								{games: games}),
							session: session
						};
					}
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var b = A2($elm$core$Debug$log, 'Main.update model = ', model);
		var a = A2($elm$core$Debug$log, 'Main.update msg = ', msg);
		var _v0 = _Utils_Tuple2(msg, model);
		switch (_v0.a.$) {
			case 'SignupMsg':
				if (_v0.b.$ === 'Signup') {
					var subMsg = _v0.a.a;
					var _v1 = _v0.b;
					var signupModel = _v1.a;
					var session = _v1.b;
					var updated = A3($author$project$Signup$update, subMsg, signupModel, session);
					return A3(
						$author$project$Main$toModel,
						A2($author$project$Main$Signup, updated.model, updated.session),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$SignupMsg, updated.cmd),
						updated.session);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'PlayMsg':
				if (_v0.b.$ === 'Signup') {
					var subMsg = _v0.a.a;
					var _v2 = _v0.b;
					var signupModel = _v2.a;
					var session = _v2.b;
					var playModel = $author$project$Play$init(session);
					var updated = A3($author$project$Play$update, subMsg, playModel, session);
					return A3(
						$author$project$Main$toModel,
						A2($author$project$Main$Play, updated.model, updated.session),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$PlayMsg, updated.cmd),
						updated.session);
				} else {
					var subMsg = _v0.a.a;
					var _v3 = _v0.b;
					var playModel = _v3.a;
					var session = _v3.b;
					var updated = A3($author$project$Play$update, subMsg, playModel, session);
					return A3(
						$author$project$Main$toModel,
						A2($author$project$Main$Play, updated.model, updated.session),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$PlayMsg, updated.cmd),
						updated.session);
				}
			case 'LinkClicked':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $rundis$elm_bootstrap$Bootstrap$CDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
		]),
	_List_Nil);
var $author$project$CardsCDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('src/resources/cards.css')
		]),
	_List_Nil);
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Play$isItMyTurn = F2(
	function (model, session) {
		return _Utils_eq(model.currentPlayerUuid, session.playerUuid);
	});
var $author$project$Play$viewGamePhase = F2(
	function (model, session) {
		var currentPlayer = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (player) {
					return _Utils_eq(player.playerUuid, model.currentPlayerUuid);
				},
				model.players));
		var activePlayers = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (player) {
					return _Utils_eq(player.playerStatus, $author$project$Domain$DTOplayer$PLAYING);
				},
				model.players));
		var a = A2($elm$core$Debug$log, 'viewGamePhase players = ', model.players);
		if (!activePlayers) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-phase')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('The game is finished.')
					]));
		} else {
			var _v0 = _Utils_Tuple3(
				model.phase,
				A2($author$project$Play$isItMyTurn, model, session),
				currentPlayer);
			_v0$6:
			while (true) {
				if (!_v0.b) {
					if (_v0.c.$ === 'Just') {
						switch (_v0.a.$) {
							case 'DRAW':
								var _v1 = _v0.a;
								var player = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('game-phase')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(player.playerName + ' draws a card from the stock...')
										]));
							case 'PUT':
								var _v2 = _v0.a;
								var player = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('game-phase')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(player.playerName + ' is playing...')
										]));
							default:
								var _v5 = _v0.a;
								var player = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('game-phase')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(player.playerName + ' is waiting for the game...')
										]));
						}
					} else {
						break _v0$6;
					}
				} else {
					switch (_v0.a.$) {
						case 'DRAW':
							if (_v0.c.$ === 'Just') {
								var _v3 = _v0.a;
								var player = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('game-phase-you')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('It is your turn! Draw a card from the stock.')
										]));
							} else {
								break _v0$6;
							}
						case 'PUT':
							if (_v0.c.$ === 'Just') {
								var _v4 = _v0.a;
								var player = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('game-phase-you')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('You are playing, with putting a card to the stock your turn ends.')
										]));
							} else {
								break _v0$6;
							}
						default:
							var _v6 = _v0.a;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('game-phase')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Looks like it is your turn, need to wait a little..')
									]));
					}
				}
			}
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-phase')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Looks ??')
					]));
		}
	});
var $author$project$Play$viewGamePlayer = F2(
	function (model, player) {
		if (_Utils_eq(model.currentPlayerUuid, player.playerUuid)) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-player game-player-current')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(player.playerName)
					]));
		} else {
			var _v0 = player.playerStatus;
			switch (_v0.$) {
				case 'PLAYING':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('game-player')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(player.playerName)
							]));
				case 'DISCONNECTED':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('game-player-disconnected')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(player.playerName)
							]));
				default:
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('game-player-finished')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(player.playerName)
							]));
			}
		}
	});
var $author$project$Play$viewGame = F2(
	function (model, session) {
		var a = A2($elm$core$Debug$log, 'viewGame players', model.players);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('game-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('game-header')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Playing ' + (session.gameName + (' as ' + session.playerName)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('game-players')
						]),
					A2(
						$elm$core$List$map,
						$author$project$Play$viewGamePlayer(model),
						model.players)),
					A2($author$project$Play$viewGamePhase, model, session)
				]));
	});
var $author$project$Play$DragDropMsg = function (a) {
	return {$: 'DragDropMsg', a: a};
};
var $author$project$Play$DragHandSelected = {$: 'DragHandSelected'};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnd = {$: 'DragEnd'};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragStart = F2(
	function (a, b) {
		return {$: 'DragStart', a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions = F3(
	function (name, _v0, decoder) {
		var stopPropagation = _v0.stopPropagation;
		var preventDefault = _v0.preventDefault;
		return A2(
			$elm$html$Html$Events$custom,
			name,
			A2(
				$elm$json$Json$Decode$map,
				function (msg) {
					return {message: msg, preventDefault: preventDefault, stopPropagation: stopPropagation};
				},
				decoder));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$draggable = F2(
	function (wrap, drag) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'draggable', 'true'),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragstart',
				{preventDefault: false, stopPropagation: true},
				A2(
					$elm$json$Json$Decode$map,
					A2(
						$elm$core$Basics$composeL,
						wrap,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragStart(drag)),
					$elm$json$Json$Decode$value)),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragend',
				{preventDefault: false, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap($norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnd)))
			]);
	});
var $author$project$Play$draggableFromHandSelected = function (model) {
	return model.pending ? _List_Nil : A2($norpan$elm_html5_drag_drop$Html5$DragDrop$draggable, $author$project$Play$DragDropMsg, $author$project$Play$DragHandSelected);
};
var $author$project$Domain$DTOcard$allDifferentHelper = F2(
	function (a1, _v0) {
		var bool = _v0.a;
		var lista = _v0.b;
		return _Utils_Tuple2(
			bool && (!A2($elm$core$List$member, a1, lista)),
			A2($elm$core$List$cons, a1, lista));
	});
var $author$project$Domain$DTOcard$allDifferent = function (lista) {
	return A3(
		$elm$core$List$foldl,
		$author$project$Domain$DTOcard$allDifferentHelper,
		_Utils_Tuple2(true, _List_Nil),
		lista).a;
};
var $author$project$Domain$DTOcard$ranksSuccessive = F2(
	function (ranks, jokers) {
		var withoutAcesSorted = A2(
			$elm$core$List$sortBy,
			$author$project$Domain$DTOcard$numerizeRank,
			A2(
				$elm$core$List$filter,
				function (rank) {
					return !_Utils_eq(rank, $author$project$Domain$DTOcard$ACE);
				},
				ranks));
		var onlyAces = A2(
			$elm$core$List$filter,
			function (rank) {
				return _Utils_eq(rank, $author$project$Domain$DTOcard$ACE);
			},
			ranks);
		var lowestRank = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$author$project$Domain$DTOcard$numerizeRank,
				$elm$core$List$head(withoutAcesSorted)));
		var highestRank = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$author$project$Domain$DTOcard$numerizeRank,
				$elm$core$List$head(
					A2(
						$elm$core$List$drop,
						$elm$core$List$length(withoutAcesSorted) - 1,
						withoutAcesSorted))));
		var _v0 = function () {
			if (!onlyAces.b) {
				return _Utils_Tuple2(lowestRank, highestRank);
			} else {
				return (_Utils_cmp(lowestRank - 2, 13 - highestRank) > 0) ? _Utils_Tuple2(lowestRank, 14) : _Utils_Tuple2(1, highestRank);
			}
		}();
		var lRank = _v0.a;
		var hRank = _v0.b;
		return _Utils_cmp(
			(hRank - lRank) + 1,
			$elm$core$List$length(ranks) + jokers) < 1;
	});
var $author$project$Domain$DTOcard$isMeld = function (cards) {
	return ($elm$core$List$length(cards) >= 3) && (($author$project$Domain$DTOcard$allOfOneKind(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.rank;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards))) && ($author$project$Domain$DTOcard$allDifferent(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.suit;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards))) && ($elm$core$List$length(cards) <= 4))) || ($author$project$Domain$DTOcard$allOfOneKind(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.suit;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards))) && (A2(
		$author$project$Domain$DTOcard$ranksSuccessive,
		A2(
			$elm$core$List$map,
			function ($) {
				return $.rank;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards)),
		$elm$core$List$length(
			$author$project$Domain$DTOcard$cardsSpecials(cards))) && ($author$project$Domain$DTOcard$allDifferent(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.rank;
			},
			$author$project$Domain$DTOcard$cardsRegulars(cards))) && ($elm$core$List$length(cards) <= 13)))));
};
var $author$project$Play$Select = function (a) {
	return {$: 'Select', a: a};
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Play$clickHand = F2(
	function (model, index) {
		var _v0 = _Utils_Tuple2(model.pending, model.phase);
		if ((!_v0.a) && (_v0.b.$ === 'PUT')) {
			var _v1 = _v0.b;
			return _List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					$author$project$Play$Select(index))
				]);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Play$DragHand = function (a) {
	return {$: 'DragHand', a: a};
};
var $author$project$Play$draggableFromHand = F2(
	function (model, index) {
		return model.pending ? _List_Nil : A2(
			$norpan$elm_html5_drag_drop$Html5$DragDrop$draggable,
			$author$project$Play$DragDropMsg,
			$author$project$Play$DragHand(index));
	});
var $author$project$Play$DropHand = function (a) {
	return {$: 'DropHand', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnter = function (a) {
	return {$: 'DragEnter', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragLeave = function (a) {
	return {$: 'DragLeave', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragOver = F3(
	function (a, b, c) {
		return {$: 'DragOver', a: a, b: b, c: c};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Drop = F2(
	function (a, b) {
		return {$: 'Drop', a: a, b: b};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Position = F4(
	function (width, height, x, y) {
		return {height: height, width: width, x: x, y: y};
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$core$Basics$round = _Basics_round;
var $norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder = A5(
	$elm$json$Json$Decode$map4,
	$norpan$elm_html5_drag_drop$Html5$DragDrop$Position,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientWidth']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientHeight']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$round,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetX']),
			$elm$json$Json$Decode$float)),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$round,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetY']),
			$elm$json$Json$Decode$float)));
var $norpan$elm_html5_drag_drop$Html5$DragDrop$timeStampDecoder = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$round,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['timeStamp']),
		$elm$json$Json$Decode$float));
var $norpan$elm_html5_drag_drop$Html5$DragDrop$droppable = F2(
	function (wrap, dropId) {
		return _List_fromArray(
			[
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragenter',
				{preventDefault: true, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnter(dropId)))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragleave',
				{preventDefault: true, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragLeave(dropId)))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragover',
				{preventDefault: true, stopPropagation: false},
				A2(
					$elm$json$Json$Decode$map,
					wrap,
					A3(
						$elm$json$Json$Decode$map2,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragOver(dropId),
						$norpan$elm_html5_drag_drop$Html5$DragDrop$timeStampDecoder,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'drop',
				{preventDefault: true, stopPropagation: true},
				A2(
					$elm$json$Json$Decode$map,
					A2(
						$elm$core$Basics$composeL,
						wrap,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$Drop(dropId)),
					$norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder))
			]);
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId = function (model) {
	switch (model.$) {
		case 'NotDragging':
			return $elm$core$Maybe$Nothing;
		case 'Dragging':
			var dragId = model.a;
			return $elm$core$Maybe$Just(dragId);
		default:
			var dragId = model.a;
			var dropId = model.b;
			return $elm$core$Maybe$Just(dragId);
	}
};
var $author$project$Play$droppableToHand = F2(
	function (model, index) {
		var _v0 = _Utils_Tuple3(
			model.pending,
			model.phase,
			$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
		if (_v0.a) {
			return _List_Nil;
		} else {
			if (_v0.b.$ === 'DRAW') {
				var _v1 = _v0.b;
				return A2(
					$norpan$elm_html5_drag_drop$Html5$DragDrop$droppable,
					$author$project$Play$DragDropMsg,
					$author$project$Play$DropHand(index));
			} else {
				if ((_v0.c.$ === 'Just') && (_v0.c.a.$ === 'DragHand')) {
					var indexFrom = _v0.c.a.a;
					return A2(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$droppable,
						$author$project$Play$DragDropMsg,
						$author$project$Play$DropHand(index));
				} else {
					return _List_Nil;
				}
			}
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Domain$DTOcard$Black = {$: 'Black'};
var $author$project$Domain$DTOcard$Blue = {$: 'Blue'};
var $author$project$Domain$DTOcard$DarkBrown = {$: 'DarkBrown'};
var $author$project$Domain$DTOcard$LightBrown = {$: 'LightBrown'};
var $author$project$Domain$DTOcard$Red = {$: 'Red'};
var $author$project$Domain$DTOcard$Whitish = {$: 'Whitish'};
var $author$project$Domain$DTOcard$Yellow = {$: 'Yellow'};
var $author$project$Domain$DTOcard$getChars = function (dtoCard) {
	if (dtoCard.$ === 'Regular') {
		var suit = dtoCard.a.suit;
		var rank = dtoCard.a.rank;
		var _v1 = function () {
			switch (suit.$) {
				case 'CLUBS':
					return _Utils_Tuple2(33, $author$project$Domain$DTOcard$Black);
				case 'DIAMONDS':
					return _Utils_Tuple2(57, $author$project$Domain$DTOcard$Red);
				case 'HEARTS':
					return _Utils_Tuple2(81, $author$project$Domain$DTOcard$Red);
				default:
					return _Utils_Tuple2(105, $author$project$Domain$DTOcard$Black);
			}
		}();
		var suitOffset = _v1.a;
		var suitColor = _v1.b;
		return $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_Tuple2(161, $author$project$Domain$DTOcard$Whitish),
						_Utils_Tuple2(162, $author$project$Domain$DTOcard$Black)
					]),
					function () {
					switch (rank.$) {
						case 'ACE':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 0, suitColor)
								]);
						case 'N2':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 1, suitColor)
								]);
						case 'N3':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 2, suitColor)
								]);
						case 'N4':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 3, suitColor)
								]);
						case 'N5':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 4, suitColor)
								]);
						case 'N6':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 5, suitColor)
								]);
						case 'N7':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 6, suitColor)
								]);
						case 'N8':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 7, suitColor)
								]);
						case 'N9':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 8, suitColor)
								]);
						case 'N10':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 9, suitColor)
								]);
						case 'JACK':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 10, $author$project$Domain$DTOcard$Black),
									_Utils_Tuple2(suitOffset + 11, $author$project$Domain$DTOcard$DarkBrown),
									_Utils_Tuple2(suitOffset + 12, $author$project$Domain$DTOcard$LightBrown),
									_Utils_Tuple2(suitOffset + 13, $author$project$Domain$DTOcard$Red)
								]);
						case 'QUEEN':
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 14, $author$project$Domain$DTOcard$Black),
									_Utils_Tuple2(suitOffset + 15, $author$project$Domain$DTOcard$DarkBrown),
									_Utils_Tuple2(suitOffset + 16, $author$project$Domain$DTOcard$LightBrown),
									_Utils_Tuple2(suitOffset + 17, $author$project$Domain$DTOcard$Red)
								]);
						default:
							return _List_fromArray(
								[
									_Utils_Tuple2(suitOffset + 18, $author$project$Domain$DTOcard$Black),
									_Utils_Tuple2(suitOffset + 19, $author$project$Domain$DTOcard$DarkBrown),
									_Utils_Tuple2(suitOffset + 20, $author$project$Domain$DTOcard$LightBrown),
									_Utils_Tuple2(suitOffset + 21, $author$project$Domain$DTOcard$Red)
								]);
					}
				}()
				]));
	} else {
		var specialType = dtoCard.a.specialType;
		return $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_Tuple2(161, $author$project$Domain$DTOcard$Whitish),
						_Utils_Tuple2(162, $author$project$Domain$DTOcard$Black)
					]),
					function () {
					var offset = 169;
					return _List_fromArray(
						[
							_Utils_Tuple2(offset, $author$project$Domain$DTOcard$Black),
							_Utils_Tuple2(offset + 1, $author$project$Domain$DTOcard$Blue),
							_Utils_Tuple2(offset + 2, $author$project$Domain$DTOcard$Red),
							_Utils_Tuple2(offset + 3, $author$project$Domain$DTOcard$Yellow)
						]);
				}()
				]));
	}
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $author$project$Domain$DTOcard$getColorClass = F2(
	function (color, postString) {
		switch (color.$) {
			case 'Black':
				return $elm$html$Html$Attributes$class('color-black' + postString);
			case 'Red':
				return $elm$html$Html$Attributes$class('color-red' + postString);
			case 'DarkBrown':
				return $elm$html$Html$Attributes$class('color-darkbrown' + postString);
			case 'LightBrown':
				return $elm$html$Html$Attributes$class('color-lightbrown' + postString);
			case 'Whitish':
				return $elm$html$Html$Attributes$class('color-whitish' + postString);
			case 'LightBlue':
				return $elm$html$Html$Attributes$class('color-lightblue' + postString);
			case 'DarkBlue':
				return $elm$html$Html$Attributes$class('color-darkblue' + postString);
			case 'Blue':
				return $elm$html$Html$Attributes$class('color-blue' + postString);
			default:
				return $elm$html$Html$Attributes$class('color-yellow' + postString);
		}
	});
var $author$project$Domain$DTOcard$viewChar = function (_v0) {
	var _int = _v0.a;
	var color = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('char '),
				A2($author$project$Domain$DTOcard$getColorClass, color, '')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				$elm$core$String$fromChar(
					$elm$core$Char$fromCode(_int)))
			]));
};
var $author$project$Domain$DTOcard$view = function (dtoCard) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('char-holder')
			]),
		A2(
			$elm$core$List$map,
			$author$project$Domain$DTOcard$viewChar,
			$author$project$Domain$DTOcard$getChars(dtoCard)));
};
var $author$project$Play$viewHandCard = F3(
	function (model, index, dtoCardSelected) {
		var draggable = dtoCardSelected.b ? _List_Nil : A2($author$project$Play$draggableFromHand, model, index);
		var classes = function () {
			var _v0 = _Utils_Tuple2(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop),
				dtoCardSelected.b);
			_v0$2:
			while (true) {
				_v0$3:
				while (true) {
					_v0$4:
					while (true) {
						if (_v0.b) {
							if (_v0.a.$ === 'Just') {
								switch (_v0.a.a.$) {
									case 'DragHandSelected':
										var _v1 = _v0.a.a;
										return $elm$html$Html$Attributes$class('hand-card hand-card-selected hand-drag-hide');
									case 'DragHand':
										break _v0$2;
									default:
										break _v0$3;
								}
							} else {
								break _v0$3;
							}
						} else {
							if (_v0.a.$ === 'Just') {
								switch (_v0.a.a.$) {
									case 'DragHandSelected':
										var _v2 = _v0.a.a;
										return $elm$html$Html$Attributes$class('hand-card hand-card-hide');
									case 'DragHand':
										break _v0$2;
									default:
										break _v0$4;
								}
							} else {
								break _v0$4;
							}
						}
					}
					return $elm$html$Html$Attributes$class('hand-card');
				}
				return $elm$html$Html$Attributes$class('hand-card hand-card-selected');
			}
			var i = _v0.a.a.a;
			return _Utils_eq(index, i) ? $elm$html$Html$Attributes$class('hand-card hand-drag-hide') : $elm$html$Html$Attributes$class('hand-card hand-card-hide');
		}();
		return A2(
			$elm$html$Html$div,
			$elm$core$List$concat(
				_List_fromArray(
					[
						draggable,
						A2($author$project$Play$droppableToHand, model, index),
						A2($author$project$Play$clickHand, model, index)
					])),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[classes]),
					_List_fromArray(
						[
							$author$project$Domain$DTOcard$view(dtoCardSelected.a)
						]))
				]));
	});
var $author$project$Play$viewHand = F2(
	function (model, session) {
		var above = $elm$core$Basics$lt;
		return ($author$project$Domain$DTOcard$isMeld(
			A2($author$project$Play$handSelected, model.hand, true)) && A2(
			above,
			0,
			$elm$core$List$length(
				A2($author$project$Play$handSelected, model.hand, false)))) ? A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('hand-container'),
				$author$project$Play$draggableFromHandSelected(model)),
			A2(
				$elm$core$List$indexedMap,
				$author$project$Play$viewHandCard(model),
				model.hand)) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('hand-container')
				]),
			A2(
				$elm$core$List$indexedMap,
				$author$project$Play$viewHandCard(model),
				model.hand));
	});
var $author$project$Play$DragBottomCard = {$: 'DragBottomCard'};
var $author$project$Play$draggableFromBottom = function (model) {
	var _v0 = _Utils_Tuple2(model.pending, model.phase);
	if ((!_v0.a) && (_v0.b.$ === 'DRAW')) {
		var _v1 = _v0.b;
		return A2($norpan$elm_html5_drag_drop$Html5$DragDrop$draggable, $author$project$Play$DragDropMsg, $author$project$Play$DragBottomCard);
	} else {
		return _List_Nil;
	}
};
var $author$project$Play$DragTopCard = {$: 'DragTopCard'};
var $author$project$Play$draggableFromTop = function (model) {
	var _v0 = _Utils_Tuple2(model.pending, model.phase);
	if ((!_v0.a) && (_v0.b.$ === 'DRAW')) {
		var _v1 = _v0.b;
		return A2($norpan$elm_html5_drag_drop$Html5$DragDrop$draggable, $author$project$Play$DragDropMsg, $author$project$Play$DragTopCard);
	} else {
		return _List_Nil;
	}
};
var $author$project$Play$DropBottomCard = {$: 'DropBottomCard'};
var $author$project$Play$droppableToBottom = function (model) {
	var _v0 = _Utils_Tuple2(model.pending, model.phase);
	if ((!_v0.a) && (_v0.b.$ === 'PUT')) {
		var _v1 = _v0.b;
		return A2($norpan$elm_html5_drag_drop$Html5$DragDrop$droppable, $author$project$Play$DragDropMsg, $author$project$Play$DropBottomCard);
	} else {
		return _List_Nil;
	}
};
var $author$project$Domain$DTOcard$DarkBlue = {$: 'DarkBlue'};
var $author$project$Domain$DTOcard$LightBlue = {$: 'LightBlue'};
var $author$project$Domain$DTOcard$getCharsBack = function (back) {
	if (back.$ === 'DARK') {
		return _List_fromArray(
			[
				_Utils_Tuple2(161, $author$project$Domain$DTOcard$Whitish),
				_Utils_Tuple2(162, $author$project$Domain$DTOcard$Black),
				_Utils_Tuple2(165, $author$project$Domain$DTOcard$DarkBlue),
				_Utils_Tuple2(166, $author$project$Domain$DTOcard$LightBlue)
			]);
	} else {
		return _List_fromArray(
			[
				_Utils_Tuple2(161, $author$project$Domain$DTOcard$Whitish),
				_Utils_Tuple2(162, $author$project$Domain$DTOcard$Black),
				_Utils_Tuple2(165, $author$project$Domain$DTOcard$Red),
				_Utils_Tuple2(166, $author$project$Domain$DTOcard$LightBrown)
			]);
	}
};
var $author$project$Domain$DTOcard$viewBack = function (back) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('char-holder')
			]),
		A2(
			$elm$core$List$map,
			$author$project$Domain$DTOcard$viewChar,
			$author$project$Domain$DTOcard$getCharsBack(back)));
};
var $author$project$Play$viewStock = F2(
	function (model, session) {
		var _v0 = model;
		var bottomCard = _v0.bottomCard;
		var topCardBack = _v0.topCardBack;
		var hand = _v0.hand;
		var table = _v0.table;
		var phase = _v0.phase;
		return A2($author$project$Play$isItMyTurn, model, session) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('stock-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$append,
						$author$project$Play$draggableFromBottom(model),
						$author$project$Play$droppableToBottom(model)),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stock-card')
								]),
							_List_fromArray(
								[
									$author$project$Domain$DTOcard$view(bottomCard)
								]))
						])),
					A2(
					$elm$html$Html$div,
					$author$project$Play$draggableFromTop(model),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stock-card')
								]),
							_List_fromArray(
								[
									$author$project$Domain$DTOcard$viewBack(topCardBack)
								]))
						]))
				])) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('stock-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stock-card')
								]),
							_List_fromArray(
								[
									$author$project$Domain$DTOcard$view(bottomCard)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stock-card')
								]),
							_List_fromArray(
								[
									$author$project$Domain$DTOcard$viewBack(topCardBack)
								]))
						]))
				]));
	});
var $author$project$Play$DropTable = {$: 'DropTable'};
var $author$project$Play$droppableToTable = F2(
	function (model, index) {
		var _v0 = _Utils_Tuple3(
			model.pending,
			model.phase,
			$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
		if (_v0.a) {
			return _List_Nil;
		} else {
			if (_v0.b.$ === 'PUT') {
				var _v1 = _v0.b;
				return A2($norpan$elm_html5_drag_drop$Html5$DragDrop$droppable, $author$project$Play$DragDropMsg, $author$project$Play$DropTable);
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Play$DropAfter = {$: 'DropAfter'};
var $author$project$Play$DropBefore = {$: 'DropBefore'};
var $author$project$Play$DropTableSpace = F2(
	function (a, b) {
		return {$: 'DropTableSpace', a: a, b: b};
	});
var $author$project$Play$droppableToTableSpace = F3(
	function (model, tableSpaceIndex, index) {
		var _v0 = _Utils_Tuple3(
			model.pending,
			model.phase,
			$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
		if (_v0.a) {
			return _List_Nil;
		} else {
			if (_v0.b.$ === 'PUT') {
				var _v1 = _v0.b;
				return A2(
					$norpan$elm_html5_drag_drop$Html5$DragDrop$droppable,
					$author$project$Play$DragDropMsg,
					A2($author$project$Play$DropTableSpace, tableSpaceIndex, index));
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Domain$DTOcard$viewEmpty = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('char-holder')
		]),
	_List_Nil);
var $author$project$Play$viewTableDropSpace = F5(
	function (model, session, tableSpaceIndex, cards, dropSpace) {
		var handCardsNumber = $elm$core$List$length(model.hand);
		var droppable = function () {
			var _v0 = _Utils_Tuple3(
				A2($author$project$Play$isItMyTurn, model, session) && (handCardsNumber > 1),
				$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop),
				dropSpace);
			if ((_v0.a && (_v0.b.$ === 'Just')) && (_v0.b.a.$ === 'DragHand')) {
				if (_v0.c.$ === 'DropBefore') {
					var i = _v0.b.a.a;
					var _v1 = _v0.c;
					var _v2 = A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						A2(
							$elm$core$Array$get,
							i,
							$elm$core$Array$fromList(model.hand)));
					if (_v2.$ === 'Just') {
						var draggedCard = _v2.a;
						var cardsAfterDrop = A2($elm$core$List$cons, draggedCard, cards);
						return ($author$project$Domain$DTOcard$isMeld(cardsAfterDrop) && $author$project$Domain$DTOcard$meldSorted(cardsAfterDrop)) ? A3($author$project$Play$droppableToTableSpace, model, tableSpaceIndex, -1) : _List_Nil;
					} else {
						return _List_Nil;
					}
				} else {
					var i = _v0.b.a.a;
					var _v3 = _v0.c;
					var _v4 = A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						A2(
							$elm$core$Array$get,
							i,
							$elm$core$Array$fromList(model.hand)));
					if (_v4.$ === 'Just') {
						var draggedCard = _v4.a;
						var cardsAfterDrop = A2(
							$elm$core$List$append,
							cards,
							_List_fromArray(
								[draggedCard]));
						return ($author$project$Domain$DTOcard$isMeld(cardsAfterDrop) && $author$project$Domain$DTOcard$meldSorted(cardsAfterDrop)) ? A3($author$project$Play$droppableToTableSpace, model, tableSpaceIndex, 99) : _List_Nil;
					} else {
						return _List_Nil;
					}
				}
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$append,
				droppable,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table-space-card table-space-dropcard')
					])),
			_List_fromArray(
				[$author$project$Domain$DTOcard$viewEmpty]));
	});
var $author$project$Play$viewTableSpaceCard = F6(
	function (model, session, tableSpaceIndex, cards, index, card) {
		var droppable = function () {
			var _v0 = _Utils_Tuple3(
				A2($author$project$Play$isItMyTurn, model, session),
				card,
				$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
			if (((_v0.a && (_v0.b.$ === 'Special')) && (_v0.c.$ === 'Just')) && (_v0.c.a.$ === 'DragHand')) {
				var special = _v0.b.a;
				var i = _v0.c.a.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$first,
					A2(
						$elm$core$Array$get,
						i,
						$elm$core$Array$fromList(model.hand)));
				if (_v1.$ === 'Just') {
					var draggedCard = _v1.a;
					var cardsAfterDrop = $elm$core$List$concat(
						_List_fromArray(
							[
								A2($elm$core$List$take, index, cards),
								_List_fromArray(
								[draggedCard]),
								A2($elm$core$List$drop, index + 1, cards)
							]));
					return ($author$project$Domain$DTOcard$isMeld(cardsAfterDrop) && $author$project$Domain$DTOcard$meldSorted(cardsAfterDrop)) ? A3($author$project$Play$droppableToTableSpace, model, tableSpaceIndex, index) : _List_Nil;
				} else {
					return _List_Nil;
				}
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$append,
				droppable,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table-space-card')
					])),
			_List_fromArray(
				[
					$author$project$Domain$DTOcard$view(card)
				]));
	});
var $author$project$Play$viewTableSpace = F4(
	function (model, session, index, cards) {
		var droppable = function () {
			var _v0 = _Utils_Tuple2(
				A2($author$project$Play$isItMyTurn, model, session),
				$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
			if ((_v0.a && (_v0.b.$ === 'Just')) && (_v0.b.a.$ === 'DragHandSelected')) {
				var _v1 = _v0.b.a;
				return A2($author$project$Play$droppableToTable, model, index);
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$append,
				droppable,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table-space')
					])),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-space-grid')
						]),
					$elm$core$List$concat(
						_List_fromArray(
							[
								_List_fromArray(
								[
									A5($author$project$Play$viewTableDropSpace, model, session, index, cards, $author$project$Play$DropBefore)
								]),
								A2(
								$elm$core$List$indexedMap,
								A4($author$project$Play$viewTableSpaceCard, model, session, index, cards),
								cards),
								_List_fromArray(
								[
									A5($author$project$Play$viewTableDropSpace, model, session, index, cards, $author$project$Play$DropAfter)
								])
							])))
				]));
	});
var $author$project$Play$viewTable = F2(
	function (model, session) {
		var droppable = function () {
			var _v0 = _Utils_Tuple2(
				A2($author$project$Play$isItMyTurn, model, session),
				$norpan$elm_html5_drag_drop$Html5$DragDrop$getDragId(model.dragDrop));
			if ((_v0.a && (_v0.b.$ === 'Just')) && (_v0.b.a.$ === 'DragHandSelected')) {
				var _v1 = _v0.b.a;
				return A2(
					$author$project$Play$droppableToTable,
					model,
					$elm$core$List$length(model.table));
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('table-container'),
				droppable),
			A2(
				$elm$core$List$indexedMap,
				A2($author$project$Play$viewTableSpace, model, session),
				model.table));
	});
var $author$project$Play$view = F2(
	function (model, session) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2($author$project$Play$viewStock, model, session),
					A2($author$project$Play$viewTable, model, session),
					A2($author$project$Play$viewHand, model, session),
					A2($author$project$Play$viewGame, model, session)
				]));
	});
var $author$project$Signup$UpdatePlayerName = function (a) {
	return {$: 'UpdatePlayerName', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Attrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Disabled(disabled_);
};
var $elm$html$Html$form = _VirtualDom_node('form');
var $rundis$elm_bootstrap$Bootstrap$Form$form = F2(
	function (attributes, children) {
		return A2($elm$html$Html$form, attributes, children);
	});
var $rundis$elm_bootstrap$Bootstrap$Form$applyModifier = F2(
	function (modifier, options) {
		var value = modifier.a;
		return _Utils_update(
			options,
			{
				attributes: _Utils_ap(options.attributes, value)
			});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$defaultOptions = {attributes: _List_Nil};
var $rundis$elm_bootstrap$Bootstrap$Form$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('form-group')
			]),
		options.attributes);
};
var $rundis$elm_bootstrap$Bootstrap$Form$group = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$div,
			$rundis$elm_bootstrap$Bootstrap$Form$toAttributes(options),
			children);
	});
var $elm$html$Html$label = _VirtualDom_node('label');
var $rundis$elm_bootstrap$Bootstrap$Form$label = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$label,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('form-control-label'),
				attributes),
			children);
	});
var $author$project$Signup$DoCancelCreateGame = function (a) {
	return {$: 'DoCancelCreateGame', a: a};
};
var $author$project$Signup$DoCreateGame = F2(
	function (a, b) {
		return {$: 'DoCreateGame', a: a, b: b};
	});
var $author$project$Signup$UpdateGameName = function (a) {
	return {$: 'UpdateGameName', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Internal$Attrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockAttrs = function (a) {
	return {$: 'BlockAttrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Block$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockAttrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock = function (a) {
	return {$: 'CardBlock', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 'AlignedBlock':
				var align = option.a;
				return _Utils_update(
					options,
					{
						aligned: $elm$core$Maybe$Just(align)
					});
			case 'BlockColoring':
				var role = option.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(role)
					});
			case 'BlockTextColoring':
				var color = option.a;
				return _Utils_update(
					options,
					{
						textColoring: $elm$core$Maybe$Just(color)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions = {aligned: $elm$core$Maybe$Nothing, attributes: _List_Nil, coloring: $elm$core$Maybe$Nothing, textColoring: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size.$) {
		case 'XS':
			return $elm$core$Maybe$Nothing;
		case 'SM':
			return $elm$core$Maybe$Just('sm');
		case 'MD':
			return $elm$core$Maybe$Just('md');
		case 'LG':
			return $elm$core$Maybe$Just('lg');
		default:
			return $elm$core$Maybe$Just('xl');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption = function (dir) {
	switch (dir.$) {
		case 'Center':
			return 'center';
		case 'Left':
			return 'left';
		default:
			return 'right';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass = function (_v0) {
	var dir = _v0.dir;
	var size = _v0.size;
	return $elm$html$Html$Attributes$class(
		'text' + (A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2(
				$elm$core$Maybe$map,
				function (s) {
					return '-' + (s + '-');
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size))) + $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption(dir)));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass = F2(
	function (prefix, role) {
		return $elm$html$Html$Attributes$class(
			prefix + ('-' + function () {
				switch (role.$) {
					case 'Primary':
						return 'primary';
					case 'Secondary':
						return 'secondary';
					case 'Success':
						return 'success';
					case 'Info':
						return 'info';
					case 'Warning':
						return 'warning';
					case 'Danger':
						return 'danger';
					case 'Light':
						return 'light';
					default:
						return 'dark';
				}
			}()));
	});
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass = function (color) {
	if (color.$ === 'White') {
		return $elm$html$Html$Attributes$class('text-white');
	} else {
		var role = color.a;
		return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'text', role);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier, $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card-body')
			]),
		_Utils_ap(
			function () {
				var _v0 = options.aligned;
				if (_v0.$ === 'Just') {
					var align = _v0.a;
					return _List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.coloring;
					if (_v1.$ === 'Just') {
						var role = _v1.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _v2 = options.textColoring;
						if (_v2.$ === 'Just') {
							var color = _v2.a;
							return _List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.attributes))));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$block = F2(
	function (options, items) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock(
			A2(
				$elm$html$Html$div,
				$rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes(options),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var e = _v0.a;
						return e;
					},
					items)));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$block = F3(
	function (options, items, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Card$Config(
			_Utils_update(
				conf,
				{
					blocks: _Utils_ap(
						conf.blocks,
						_List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Card$Internal$block, options, items)
							]))
				}));
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size)
					});
			case 'Coloring':
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(coloring)
					});
			case 'Block':
				return _Utils_update(
					options,
					{block: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {attributes: _List_Nil, block: false, coloring: $elm$core$Maybe$Nothing, disabled: false, size: $elm$core$Maybe$Nothing};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role.$) {
		case 'Primary':
			return 'primary';
		case 'Secondary':
			return 'secondary';
		case 'Success':
			return 'success';
		case 'Info':
			return 'info';
		case 'Warning':
			return 'warning';
		case 'Danger':
			return 'danger';
		case 'Dark':
			return 'dark';
		case 'Light':
			return 'light';
		default:
			return 'link';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.block),
						_Utils_Tuple2('disabled', options.disabled)
					])),
				$elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			function () {
				var _v0 = A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.size);
				if (_v0.$ === 'Just') {
					var s = _v0.a;
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.coloring;
					if (_v1.$ === 'Just') {
						if (_v1.a.$ === 'Roled') {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-outline-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes)));
};
var $rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$button,
			$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Card$config = function (options) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Config(
		{blocks: _List_Nil, footer: $elm$core$Maybe$Nothing, header: $elm$core$Maybe$Nothing, imgBottom: $elm$core$Maybe$Nothing, imgTop: $elm$core$Maybe$Nothing, options: options});
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem = function (a) {
	return {$: 'BlockItem', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Block$custom = function (element) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem(element);
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled(disabled_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Header = function (a) {
	return {$: 'Header', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$headerPrivate = F4(
	function (elemFn, attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Card$Config(
			_Utils_update(
				conf,
				{
					header: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Card$Header(
							A2(
								elemFn,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('card-header'),
									attributes),
								children)))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$header = $rundis$elm_bootstrap$Bootstrap$Card$headerPrivate($elm$html$Html$div);
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $rundis$elm_bootstrap$Bootstrap$Button$onClick = function (message) {
	return $rundis$elm_bootstrap$Bootstrap$Button$attrs(
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Events$preventDefaultOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2(message, true)))
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$onInput = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 'Coloring', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = {$: 'Primary'};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled = function (a) {
	return {$: 'Roled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$primary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary));
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$p = _VirtualDom_node('p');
var $rundis$elm_bootstrap$Bootstrap$Card$Block$text = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem(
			A2(
				$elm$html$Html$p,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-text')
						]),
					attributes),
				children));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Text = {$: 'Text'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Input = function (a) {
	return {$: 'Input', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Type = function (a) {
	return {$: 'Type', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$create = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$Input(
			{
				options: A2(
					$elm$core$List$cons,
					$rundis$elm_bootstrap$Bootstrap$Form$Input$Type(tipe),
					options)
			});
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(id_)
					});
			case 'Type':
				var tipe = modifier.a;
				return _Utils_update(
					options,
					{tipe: tipe});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: $elm$core$Maybe$Just(value_)
					});
			case 'Placeholder':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						placeholder: $elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: $elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation_)
					});
			case 'Readonly':
				var val = modifier.a;
				return _Utils_update(
					options,
					{readonly: val});
			case 'PlainText':
				var val = modifier.a;
				return _Utils_update(
					options,
					{plainText: val});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions = {attributes: _List_Nil, disabled: false, id: $elm$core$Maybe$Nothing, onInput: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, plainText: false, readonly: false, size: $elm$core$Maybe$Nothing, tipe: $rundis$elm_bootstrap$Bootstrap$Form$Input$Text, validation: $elm$core$Maybe$Nothing, value: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute = function (size) {
	return A2(
		$elm$core$Maybe$map,
		function (s) {
			return $elm$html$Html$Attributes$class('form-control-' + s);
		},
		$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute = function (inputType) {
	return $elm$html$Html$Attributes$type_(
		function () {
			switch (inputType.$) {
				case 'Text':
					return 'text';
				case 'Password':
					return 'password';
				case 'DatetimeLocal':
					return 'datetime-local';
				case 'Date':
					return 'date';
				case 'Month':
					return 'month';
				case 'Time':
					return 'time';
				case 'Week':
					return 'week';
				case 'Number':
					return 'number';
				case 'Email':
					return 'email';
				case 'Url':
					return 'url';
				case 'Search':
					return 'search';
				case 'Tel':
					return 'tel';
				default:
					return 'color';
			}
		}());
};
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString = function (validation) {
	if (validation.$ === 'Success') {
		return 'is-valid';
	} else {
		return 'is-invalid';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute = function (validation) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				options.plainText ? 'form-control-plaintext' : 'form-control'),
				$elm$html$Html$Attributes$disabled(options.disabled),
				$elm$html$Html$Attributes$readonly(options.readonly || options.plainText),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute(options.tipe)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id),
						A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute, options.size),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$value, options.value),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, options.placeholder),
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, options.onInput),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute, options.validation)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$view = function (_v0) {
	var options = _v0.a.options;
	return A2(
		$elm$html$Html$input,
		$rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes(options),
		_List_Nil);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$input = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$view(
			A2($rundis$elm_bootstrap$Bootstrap$Form$Input$create, tipe, options));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$text = $rundis$elm_bootstrap$Bootstrap$Form$Input$input($rundis$elm_bootstrap$Bootstrap$Form$Input$Text);
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $rundis$elm_bootstrap$Bootstrap$Card$Block$title = F3(
	function (elemFn, attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem(
			A2(
				elemFn,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('card-title'),
					attributes),
				children));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6 = $rundis$elm_bootstrap$Bootstrap$Card$Block$title($elm$html$Html$h6);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Value = function (a) {
	return {$: 'Value', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$value = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Value(value_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 'Aligned':
				var align = option.a;
				return _Utils_update(
					options,
					{
						aligned: $elm$core$Maybe$Just(align)
					});
			case 'Coloring':
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(coloring)
					});
			case 'TextColoring':
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						textColoring: $elm$core$Maybe$Just(coloring)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions = {aligned: $elm$core$Maybe$Nothing, attributes: _List_Nil, coloring: $elm$core$Maybe$Nothing, textColoring: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier, $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card')
			]),
		_Utils_ap(
			function () {
				var _v0 = options.coloring;
				if (_v0.$ === 'Just') {
					if (_v0.a.$ === 'Roled') {
						var role = _v0.a.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						var role = _v0.a.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'border', role)
							]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.textColoring;
					if (_v1.$ === 'Just') {
						var color = _v1.a;
						return _List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _v2 = options.aligned;
						if (_v2.$ === 'Just') {
							var align = _v2.a;
							return _List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.attributes))));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks = function (blocks) {
	return A2(
		$elm$core$List$map,
		function (block_) {
			if (block_.$ === 'CardBlock') {
				var e = block_.a;
				return e;
			} else {
				var e = block_.a;
				return e;
			}
		},
		blocks);
};
var $rundis$elm_bootstrap$Bootstrap$Card$view = function (_v0) {
	var conf = _v0.a;
	return A2(
		$elm$html$Html$div,
		$rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes(conf.options),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (_v1) {
							var e = _v1.a;
							return e;
						},
						conf.header),
						A2(
						$elm$core$Maybe$map,
						function (_v2) {
							var e = _v2.a;
							return e;
						},
						conf.imgTop)
					])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks(conf.blocks),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							function (_v3) {
								var e = _v3.a;
								return e;
							},
							conf.footer),
							A2(
							$elm$core$Maybe$map,
							function (_v4) {
								var e = _v4.a;
								return e;
							},
							conf.imgBottom)
						])))));
};
var $author$project$Signup$viewPlayer = function (_v0) {
	var playerName = _v0.playerName;
	var playerStatus = _v0.playerStatus;
	switch (playerStatus.$) {
		case 'PLAYING':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('signup-player')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(playerName)
					]));
		case 'DISCONNECTED':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('signup-player-disconnected')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(playerName)
					]));
		default:
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(playerName)
					]));
	}
};
var $author$project$Signup$viewGameCard = F2(
	function (_v0, _v1) {
		var topText = _v0.topText;
		var buttonText = _v0.buttonText;
		var buttonMsg = _v0.buttonMsg;
		var buttonDisabled = _v0.buttonDisabled;
		var nameDisabled = _v0.nameDisabled;
		var cancelMsg = _v0.cancelMsg;
		var cancelDisabled = _v0.cancelDisabled;
		var gameName = _v1.gameName;
		var players = _v1.players;
		return $rundis$elm_bootstrap$Bootstrap$Card$view(
			A3(
				$rundis$elm_bootstrap$Bootstrap$Card$block,
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Card$Block$attrs(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('signup-game-card-bottom')
							]))
					]),
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Card$Block$custom(
						A2(
							$rundis$elm_bootstrap$Bootstrap$Button$button,
							_List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Button$primary,
									$rundis$elm_bootstrap$Bootstrap$Button$onClick(buttonMsg),
									$rundis$elm_bootstrap$Bootstrap$Button$attrs(
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(buttonDisabled),
											$elm$html$Html$Attributes$class('signup-game-card')
										]))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(buttonText)
								])))
					]),
				A3(
					$rundis$elm_bootstrap$Bootstrap$Card$block,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Card$Block$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('signup-game-card-body')
								]))
						]),
					_List_fromArray(
						[
							A2(
							$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6,
							_List_Nil,
							_List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Input$attrs(
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('signup-game-card-title')
												])),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$value(gameName),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$Signup$UpdateGameName),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(nameDisabled)
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('signup-game-card-players')
								]),
							A2($elm$core$List$map, $author$project$Signup$viewPlayer, players))
						]),
					A3(
						$rundis$elm_bootstrap$Bootstrap$Card$header,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('signup-game-card-header')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(topText),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('signup-game-card-close')
									]),
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Button$button,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Button$onClick(cancelMsg),
												$rundis$elm_bootstrap$Bootstrap$Button$attrs(
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('signup-game-card-close')
													])),
												$rundis$elm_bootstrap$Bootstrap$Button$disabled(cancelDisabled)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('X')
											]))
									]))
							]),
						$rundis$elm_bootstrap$Bootstrap$Card$config(
							_List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Card$attrs(
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('signup-game-card')
										]))
								]))))));
	});
var $author$project$Signup$newGame = F2(
	function (_v0, _v1) {
		var phase = _v0.phase;
		var pending = _v0.pending;
		var playerName = _v1.playerName;
		var gameName = _v1.gameName;
		if (phase.$ === 'PhaseInit') {
			return $elm$core$Maybe$Just(
				A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: pending || ((gameName === '') || (playerName === '')),
						buttonMsg: A2($author$project$Signup$DoCreateGame, gameName, playerName),
						buttonText: 'Create new game',
						cancelDisabled: true,
						cancelMsg: $author$project$Signup$DoCancelCreateGame(''),
						nameDisabled: pending || (!_Utils_eq(phase, $author$project$Signup$PhaseInit)),
						topText: 'Start your own game?'
					},
					{gameName: gameName, players: _List_Nil}));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$SM = {$: 'SM'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Size = function (a) {
	return {$: 'Size', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$small = $rundis$elm_bootstrap$Bootstrap$Form$Input$Size($rundis$elm_bootstrap$Bootstrap$General$Internal$SM);
var $author$project$Signup$DoCancelJoinGame = function (a) {
	return {$: 'DoCancelJoinGame', a: a};
};
var $author$project$Signup$DoJoinGame = function (a) {
	return {$: 'DoJoinGame', a: a};
};
var $author$project$Signup$DoStartGame = {$: 'DoStartGame'};
var $author$project$Signup$viewGame = F3(
	function (_v0, _v1, game) {
		var phase = _v0.phase;
		var pending = _v0.pending;
		var playerName = _v1.playerName;
		var _v2 = game;
		var started = _v2.started;
		var gameName = _v2.gameName;
		var gameUuid = _v2.gameUuid;
		var players = _v2.players;
		var creator = _v2.creator;
		var topText = started ? ('was started by ' + creator) : ('wanna join? created by ' + creator);
		switch (phase.$) {
			case 'PhaseInit':
				return A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: pending || (started || (playerName === '')),
						buttonMsg: $author$project$Signup$DoJoinGame(gameUuid),
						buttonText: 'Join game',
						cancelDisabled: true,
						cancelMsg: $author$project$Signup$DoCancelCreateGame(gameUuid),
						nameDisabled: true,
						topText: topText
					},
					{gameName: gameName, players: players});
			case 'PhaseCreated':
				var uuid = phase.a;
				return _Utils_eq(uuid, gameUuid) ? A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: pending,
						buttonMsg: $author$project$Signup$DoStartGame,
						buttonText: 'Start game',
						cancelDisabled: false,
						cancelMsg: $author$project$Signup$DoCancelCreateGame(gameUuid),
						nameDisabled: true,
						topText: 'Waiting for joiners...'
					},
					{gameName: gameName, players: players}) : A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: true,
						buttonMsg: $author$project$Signup$DoJoinGame(gameUuid),
						buttonText: 'Join game',
						cancelDisabled: true,
						cancelMsg: $author$project$Signup$DoCancelCreateGame(gameUuid),
						nameDisabled: true,
						topText: topText
					},
					{gameName: gameName, players: players});
			case 'PhaseJoined':
				var uuid = phase.a;
				return _Utils_eq(uuid, gameUuid) ? A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: true,
						buttonMsg: $author$project$Signup$DoJoinGame(gameUuid),
						buttonText: 'Waiting',
						cancelDisabled: false,
						cancelMsg: $author$project$Signup$DoCancelJoinGame(gameUuid),
						nameDisabled: true,
						topText: 'Waiting for ' + creator
					},
					{gameName: gameName, players: players}) : A2(
					$author$project$Signup$viewGameCard,
					{
						buttonDisabled: true,
						buttonMsg: $author$project$Signup$DoJoinGame(gameUuid),
						buttonText: 'Join game',
						cancelDisabled: true,
						cancelMsg: $author$project$Signup$DoCancelJoinGame(gameUuid),
						nameDisabled: true,
						topText: topText
					},
					{gameName: gameName, players: players});
			default:
				return $elm$html$Html$text('Something is wrong here');
		}
	});
var $author$project$Signup$view = F2(
	function (model, session) {
		var statusText = 'test';
		var _v0 = session;
		var playerUuid = _v0.playerUuid;
		var gameUuid = _v0.gameUuid;
		var playerName = _v0.playerName;
		var _v1 = model;
		var phase = _v1.phase;
		var pending = _v1.pending;
		var joinGame = _v1.joinGame;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('signup-name')
						]),
					_List_fromArray(
						[
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$form,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('signup-label')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Your name or alias')
												])),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Form$Input$attrs(
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('signup-playername')
														])),
													$rundis$elm_bootstrap$Bootstrap$Form$Input$small,
													$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$Signup$UpdatePlayerName),
													$rundis$elm_bootstrap$Bootstrap$Form$Input$value(playerName),
													$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(
													pending || (!_Utils_eq(phase, $author$project$Signup$PhaseInit)))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('signup-card-deck')
						]),
					function () {
						var _v2 = A2($author$project$Signup$newGame, model, session);
						if (_v2.$ === 'Just') {
							var newGameHtml = _v2.a;
							return A2(
								$elm$core$List$append,
								A2(
									$elm$core$List$map,
									A2($author$project$Signup$viewGame, model, session),
									model.games),
								_List_fromArray(
									[newGameHtml]));
						} else {
							return A2(
								$elm$core$List$map,
								A2($author$project$Signup$viewGame, model, session),
								model.games);
						}
					}())
				]));
	});
var $author$project$Main$view = function (model) {
	if (model.$ === 'Signup') {
		var model1 = model.a;
		var session = model.b;
		return {
			body: _List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
					$author$project$CardsCDN$stylesheet,
					A2(
					$elm$html$Html$map,
					$author$project$Main$SignupMsg,
					A2($author$project$Signup$view, model1, session))
				]),
			title: 'Jokeren, Aanmelden'
		};
	} else {
		var model1 = model.a;
		var session = model.b;
		return {
			body: _List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
					$author$project$CardsCDN$stylesheet,
					A2(
					$elm$html$Html$map,
					$author$project$Main$PlayMsg,
					A2($author$project$Play$view, model1, session))
				]),
			title: 'Jokeren, Spelen'
		};
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$LinkClicked, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$string)(0)}});}(this));