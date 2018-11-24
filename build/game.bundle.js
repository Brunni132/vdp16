/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./gl-matrix.js":
/*!**********************!*\
  !*** ./gl-matrix.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.0.0-0

Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function (global, factory) {
   true ? factory(exports) :
  undefined;
}(this, (function (exports) { 'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  var RANDOM = Math.random;
  /**
   * Sets the type of array used when creating new vectors and matrices
   *
   * @param {Type} type Array type, such as Float32Array or Array
   */

  function setMatrixArrayType(type) {
    ARRAY_TYPE = type;
  }
  var degree = Math.PI / 180;
  /**
   * Convert Degree To Radian
   *
   * @param {Number} a Angle in Degrees
   */

  function toRadian(a) {
    return a * degree;
  }
  /**
   * Tests whether or not the arguments have approximately the same value, within an absolute
   * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
   * than or equal to 1.0, and a relative tolerance is used for larger values)
   *
   * @param {Number} a The first number to test.
   * @param {Number} b The second number to test.
   * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
   */

  function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
  }

  var common = /*#__PURE__*/Object.freeze({
    EPSILON: EPSILON,
    get ARRAY_TYPE () { return ARRAY_TYPE; },
    RANDOM: RANDOM,
    setMatrixArrayType: setMatrixArrayType,
    toRadian: toRadian,
    equals: equals
  });

  /**
   * 2x2 Matrix
   * @module mat2
   */

  /**
   * Creates a new identity mat2
   *
   * @returns {mat2} a new 2x2 matrix
   */

  function create() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
    }

    out[0] = 1;
    out[3] = 1;
    return out;
  }
  /**
   * Creates a new mat2 initialized with values from an existing matrix
   *
   * @param {mat2} a matrix to clone
   * @returns {mat2} a new 2x2 matrix
   */

  function clone(a) {
    var out = new ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Copy the values from one mat2 to another
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */

  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Set a mat2 to the identity matrix
   *
   * @param {mat2} out the receiving matrix
   * @returns {mat2} out
   */

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * Create a new mat2 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m10 Component in column 1, row 0 position (index 2)
   * @param {Number} m11 Component in column 1, row 1 position (index 3)
   * @returns {mat2} out A new 2x2 matrix
   */

  function fromValues(m00, m01, m10, m11) {
    var out = new ARRAY_TYPE(4);
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
  }
  /**
   * Set the components of a mat2 to the given values
   *
   * @param {mat2} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m10 Component in column 1, row 0 position (index 2)
   * @param {Number} m11 Component in column 1, row 1 position (index 3)
   * @returns {mat2} out
   */

  function set(out, m00, m01, m10, m11) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
  }
  /**
   * Transpose the values of a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */

  function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache
    // some values
    if (out === a) {
      var a1 = a[1];
      out[1] = a[2];
      out[2] = a1;
    } else {
      out[0] = a[0];
      out[1] = a[2];
      out[2] = a[1];
      out[3] = a[3];
    }

    return out;
  }
  /**
   * Inverts a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */

  function invert(out, a) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3]; // Calculate the determinant

    var det = a0 * a3 - a2 * a1;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] = a0 * det;
    return out;
  }
  /**
   * Calculates the adjugate of a mat2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the source matrix
   * @returns {mat2} out
   */

  function adjoint(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] = a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a0;
    return out;
  }
  /**
   * Calculates the determinant of a mat2
   *
   * @param {mat2} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant(a) {
    return a[0] * a[3] - a[2] * a[1];
  }
  /**
   * Multiplies two mat2's
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */

  function multiply(out, a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
  }
  /**
   * Rotates a mat2 by the given angle
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2} out
   */

  function rotate(out, a, rad) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = a0 * c + a2 * s;
    out[1] = a1 * c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
  }
  /**
   * Scales the mat2 by the dimensions in the given vec2
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat2} out
   **/

  function scale(out, a, v) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var v0 = v[0],
        v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
  }
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.rotate(dest, dest, rad);
   *
   * @param {mat2} out mat2 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2} out
   */

  function fromRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
  }
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat2.identity(dest);
   *     mat2.scale(dest, dest, vec);
   *
   * @param {mat2} out mat2 receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat2} out
   */

  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
  }
  /**
   * Returns a string representation of a mat2
   *
   * @param {mat2} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */

  function str(a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
  }
  /**
   * Returns Frobenius norm of a mat2
   *
   * @param {mat2} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */

  function frob(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
  }
  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
   * @param {mat2} L the lower triangular matrix
   * @param {mat2} D the diagonal matrix
   * @param {mat2} U the upper triangular matrix
   * @param {mat2} a the input matrix to factorize
   */

  function LDU(L, D, U, a) {
    L[2] = a[2] / a[0];
    U[0] = a[0];
    U[1] = a[1];
    U[3] = a[3] - L[2] * U[1];
    return [L, D, U];
  }
  /**
   * Adds two mat2's
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @returns {mat2} out
   */

  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat2} a The first matrix.
   * @param {mat2} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat2} a The first matrix.
   * @param {mat2} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function equals$1(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
  }
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat2} out the receiving matrix
   * @param {mat2} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat2} out
   */

  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  /**
   * Adds two mat2's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat2} out the receiving vector
   * @param {mat2} a the first operand
   * @param {mat2} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat2} out
   */

  function multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    return out;
  }
  /**
   * Alias for {@link mat2.multiply}
   * @function
   */

  var mul = multiply;
  /**
   * Alias for {@link mat2.subtract}
   * @function
   */

  var sub = subtract;

  var mat2 = /*#__PURE__*/Object.freeze({
    create: create,
    clone: clone,
    copy: copy,
    identity: identity,
    fromValues: fromValues,
    set: set,
    transpose: transpose,
    invert: invert,
    adjoint: adjoint,
    determinant: determinant,
    multiply: multiply,
    rotate: rotate,
    scale: scale,
    fromRotation: fromRotation,
    fromScaling: fromScaling,
    str: str,
    frob: frob,
    LDU: LDU,
    add: add,
    subtract: subtract,
    exactEquals: exactEquals,
    equals: equals$1,
    multiplyScalar: multiplyScalar,
    multiplyScalarAndAdd: multiplyScalarAndAdd,
    mul: mul,
    sub: sub
  });

  /**
   * 2x3 Matrix
   * @module mat2d
   *
   * @description
   * A mat2d contains six elements defined as:
   * <pre>
   * [a, c, tx,
   *  b, d, ty]
   * </pre>
   * This is a short form for the 3x3 matrix:
   * <pre>
   * [a, c, tx,
   *  b, d, ty,
   *  0, 0, 1]
   * </pre>
   * The last row is ignored so the array is shorter and operations are faster.
   */

  /**
   * Creates a new identity mat2d
   *
   * @returns {mat2d} a new 2x3 matrix
   */

  function create$1() {
    var out = new ARRAY_TYPE(6);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[4] = 0;
      out[5] = 0;
    }

    out[0] = 1;
    out[3] = 1;
    return out;
  }
  /**
   * Creates a new mat2d initialized with values from an existing matrix
   *
   * @param {mat2d} a matrix to clone
   * @returns {mat2d} a new 2x3 matrix
   */

  function clone$1(a) {
    var out = new ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
  }
  /**
   * Copy the values from one mat2d to another
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the source matrix
   * @returns {mat2d} out
   */

  function copy$1(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
  }
  /**
   * Set a mat2d to the identity matrix
   *
   * @param {mat2d} out the receiving matrix
   * @returns {mat2d} out
   */

  function identity$1(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
  }
  /**
   * Create a new mat2d with the given values
   *
   * @param {Number} a Component A (index 0)
   * @param {Number} b Component B (index 1)
   * @param {Number} c Component C (index 2)
   * @param {Number} d Component D (index 3)
   * @param {Number} tx Component TX (index 4)
   * @param {Number} ty Component TY (index 5)
   * @returns {mat2d} A new mat2d
   */

  function fromValues$1(a, b, c, d, tx, ty) {
    var out = new ARRAY_TYPE(6);
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
  }
  /**
   * Set the components of a mat2d to the given values
   *
   * @param {mat2d} out the receiving matrix
   * @param {Number} a Component A (index 0)
   * @param {Number} b Component B (index 1)
   * @param {Number} c Component C (index 2)
   * @param {Number} d Component D (index 3)
   * @param {Number} tx Component TX (index 4)
   * @param {Number} ty Component TY (index 5)
   * @returns {mat2d} out
   */

  function set$1(out, a, b, c, d, tx, ty) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
  }
  /**
   * Inverts a mat2d
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the source matrix
   * @returns {mat2d} out
   */

  function invert$1(out, a) {
    var aa = a[0],
        ab = a[1],
        ac = a[2],
        ad = a[3];
    var atx = a[4],
        aty = a[5];
    var det = aa * ad - ab * ac;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
  }
  /**
   * Calculates the determinant of a mat2d
   *
   * @param {mat2d} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant$1(a) {
    return a[0] * a[3] - a[1] * a[2];
  }
  /**
   * Multiplies two mat2d's
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the first operand
   * @param {mat2d} b the second operand
   * @returns {mat2d} out
   */

  function multiply$1(out, a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3],
        b4 = b[4],
        b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
  }
  /**
   * Rotates a mat2d by the given angle
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2d} out
   */

  function rotate$1(out, a, rad) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = a0 * c + a2 * s;
    out[1] = a1 * c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
  }
  /**
   * Scales the mat2d by the dimensions in the given vec2
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the matrix to translate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat2d} out
   **/

  function scale$1(out, a, v) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    var v0 = v[0],
        v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
  }
  /**
   * Translates the mat2d by the dimensions in the given vec2
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the matrix to translate
   * @param {vec2} v the vec2 to translate the matrix by
   * @returns {mat2d} out
   **/

  function translate(out, a, v) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    var v0 = v[0],
        v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
  }
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat2d.identity(dest);
   *     mat2d.rotate(dest, dest, rad);
   *
   * @param {mat2d} out mat2d receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat2d} out
   */

  function fromRotation$1(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
  }
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat2d.identity(dest);
   *     mat2d.scale(dest, dest, vec);
   *
   * @param {mat2d} out mat2d receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat2d} out
   */

  function fromScaling$1(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
  }
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat2d.identity(dest);
   *     mat2d.translate(dest, dest, vec);
   *
   * @param {mat2d} out mat2d receiving operation result
   * @param {vec2} v Translation vector
   * @returns {mat2d} out
   */

  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
  }
  /**
   * Returns a string representation of a mat2d
   *
   * @param {mat2d} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */

  function str$1(a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
  }
  /**
   * Returns Frobenius norm of a mat2d
   *
   * @param {mat2d} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */

  function frob$1(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
  }
  /**
   * Adds two mat2d's
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the first operand
   * @param {mat2d} b the second operand
   * @returns {mat2d} out
   */

  function add$1(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the first operand
   * @param {mat2d} b the second operand
   * @returns {mat2d} out
   */

  function subtract$1(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat2d} out the receiving matrix
   * @param {mat2d} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat2d} out
   */

  function multiplyScalar$1(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    return out;
  }
  /**
   * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat2d} out the receiving vector
   * @param {mat2d} a the first operand
   * @param {mat2d} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat2d} out
   */

  function multiplyScalarAndAdd$1(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    return out;
  }
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat2d} a The first matrix.
   * @param {mat2d} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function exactEquals$1(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
  }
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat2d} a The first matrix.
   * @param {mat2d} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function equals$2(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3],
        b4 = b[4],
        b5 = b[5];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
  }
  /**
   * Alias for {@link mat2d.multiply}
   * @function
   */

  var mul$1 = multiply$1;
  /**
   * Alias for {@link mat2d.subtract}
   * @function
   */

  var sub$1 = subtract$1;

  var mat2d = /*#__PURE__*/Object.freeze({
    create: create$1,
    clone: clone$1,
    copy: copy$1,
    identity: identity$1,
    fromValues: fromValues$1,
    set: set$1,
    invert: invert$1,
    determinant: determinant$1,
    multiply: multiply$1,
    rotate: rotate$1,
    scale: scale$1,
    translate: translate,
    fromRotation: fromRotation$1,
    fromScaling: fromScaling$1,
    fromTranslation: fromTranslation,
    str: str$1,
    frob: frob$1,
    add: add$1,
    subtract: subtract$1,
    multiplyScalar: multiplyScalar$1,
    multiplyScalarAndAdd: multiplyScalarAndAdd$1,
    exactEquals: exactEquals$1,
    equals: equals$2,
    mul: mul$1,
    sub: sub$1
  });

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create$2() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Copies the upper-left 3x3 values into the given mat3.
   *
   * @param {mat3} out the receiving 3x3 matrix
   * @param {mat4} a   the source 4x4 matrix
   * @returns {mat3} out
   */

  function fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
  }
  /**
   * Creates a new mat3 initialized with values from an existing matrix
   *
   * @param {mat3} a matrix to clone
   * @returns {mat3} a new 3x3 matrix
   */

  function clone$2(a) {
    var out = new ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
   * Copy the values from one mat3 to another
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function copy$2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
   * Create a new mat3 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   * @returns {mat3} A new mat3
   */

  function fromValues$2(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var out = new ARRAY_TYPE(9);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
  }
  /**
   * Set the components of a mat3 to the given values
   *
   * @param {mat3} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   * @returns {mat3} out
   */

  function set$2(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
  }
  /**
   * Set a mat3 to the identity matrix
   *
   * @param {mat3} out the receiving matrix
   * @returns {mat3} out
   */

  function identity$2(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Transpose the values of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function transpose$1(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      var a01 = a[1],
          a02 = a[2],
          a12 = a[5];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a01;
      out[5] = a[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a[0];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a[1];
      out[4] = a[4];
      out[5] = a[7];
      out[6] = a[2];
      out[7] = a[5];
      out[8] = a[8];
    }

    return out;
  }
  /**
   * Inverts a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function invert$2(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function adjoint$1(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    out[0] = a11 * a22 - a12 * a21;
    out[1] = a02 * a21 - a01 * a22;
    out[2] = a01 * a12 - a02 * a11;
    out[3] = a12 * a20 - a10 * a22;
    out[4] = a00 * a22 - a02 * a20;
    out[5] = a02 * a10 - a00 * a12;
    out[6] = a10 * a21 - a11 * a20;
    out[7] = a01 * a20 - a00 * a21;
    out[8] = a00 * a11 - a01 * a10;
    return out;
  }
  /**
   * Calculates the determinant of a mat3
   *
   * @param {mat3} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant$2(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  /**
   * Multiplies two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */

  function multiply$2(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b00 = b[0],
        b01 = b[1],
        b02 = b[2];
    var b10 = b[3],
        b11 = b[4],
        b12 = b[5];
    var b20 = b[6],
        b21 = b[7],
        b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * Translate a mat3 by the given vector
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to translate
   * @param {vec2} v vector to translate by
   * @returns {mat3} out
   */

  function translate$1(out, a, v) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        x = v[0],
        y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
  }
  /**
   * Rotates a mat3 by the given angle
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat3} out
   */

  function rotate$2(out, a, rad) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
  }
  /**
   * Scales the mat3 by the dimensions in the given vec2
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat3} out
   **/

  function scale$2(out, a, v) {
    var x = v[0],
        y = v[1];
    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];
    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {vec2} v Translation vector
   * @returns {mat3} out
   */

  function fromTranslation$1(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat3} out
   */

  function fromRotation$2(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = -s;
    out[4] = c;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {vec2} v Scaling vector
   * @returns {mat3} out
   */

  function fromScaling$2(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Copies the values from a mat2d into a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat2d} a the matrix to copy
   * @returns {mat3} out
   **/

  function fromMat2d(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;
    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;
    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
  }
  /**
  * Calculates a 3x3 matrix from the given quaternion
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {quat} q Quaternion to create matrix from
  *
  * @returns {mat3} out
  */

  function fromQuat(out, q) {
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }
  /**
  * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {mat4} a Mat4 to derive the normal matrix from
  *
  * @returns {mat3} out
  */

  function normalFromMat4(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  /**
   * Generates a 2D projection matrix with the given bounds
   *
   * @param {mat3} out mat3 frustum matrix will be written into
   * @param {number} width Width of your gl context
   * @param {number} height Height of gl context
   * @returns {mat3} out
   */

  function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Returns a string representation of a mat3
   *
   * @param {mat3} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */

  function str$2(a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
  }
  /**
   * Returns Frobenius norm of a mat3
   *
   * @param {mat3} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */

  function frob$2(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
  }
  /**
   * Adds two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */

  function add$2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */

  function subtract$2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat3} out
   */

  function multiplyScalar$2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
  }
  /**
   * Adds two mat3's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat3} out the receiving vector
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat3} out
   */

  function multiplyScalarAndAdd$2(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    return out;
  }
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat3} a The first matrix.
   * @param {mat3} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function exactEquals$2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
  }
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat3} a The first matrix.
   * @param {mat3} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function equals$3(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7],
        a8 = a[8];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3],
        b4 = b[4],
        b5 = b[5],
        b6 = b[6],
        b7 = b[7],
        b8 = b[8];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
  }
  /**
   * Alias for {@link mat3.multiply}
   * @function
   */

  var mul$2 = multiply$2;
  /**
   * Alias for {@link mat3.subtract}
   * @function
   */

  var sub$2 = subtract$2;

  var mat3 = /*#__PURE__*/Object.freeze({
    create: create$2,
    fromMat4: fromMat4,
    clone: clone$2,
    copy: copy$2,
    fromValues: fromValues$2,
    set: set$2,
    identity: identity$2,
    transpose: transpose$1,
    invert: invert$2,
    adjoint: adjoint$1,
    determinant: determinant$2,
    multiply: multiply$2,
    translate: translate$1,
    rotate: rotate$2,
    scale: scale$2,
    fromTranslation: fromTranslation$1,
    fromRotation: fromRotation$2,
    fromScaling: fromScaling$2,
    fromMat2d: fromMat2d,
    fromQuat: fromQuat,
    normalFromMat4: normalFromMat4,
    projection: projection,
    str: str$2,
    frob: frob$2,
    add: add$2,
    subtract: subtract$2,
    multiplyScalar: multiplyScalar$2,
    multiplyScalarAndAdd: multiplyScalarAndAdd$2,
    exactEquals: exactEquals$2,
    equals: equals$3,
    mul: mul$2,
    sub: sub$2
  });

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$3() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a new mat4 initialized with values from an existing matrix
   *
   * @param {mat4} a matrix to clone
   * @returns {mat4} a new 4x4 matrix
   */

  function clone$3(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Copy the values from one mat4 to another
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function copy$3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Create a new mat4 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} A new mat4
   */

  function fromValues$3(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  /**
   * Set the components of a mat4 to the given values
   *
   * @param {mat4} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} out
   */

  function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

  function identity$3(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Transpose the values of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function transpose$2(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      var a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a12 = a[6],
          a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }

    return out;
  }
  /**
   * Inverts a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function invert$3(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a mat4
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the source matrix
   * @returns {mat4} out
   */

  function adjoint$2(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  /**
   * Calculates the determinant of a mat4
   *
   * @param {mat4} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant$3(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  /**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */

  function multiply$3(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Translate a mat4 by the given vector
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to translate
   * @param {vec3} v vector to translate by
   * @returns {mat4} out
   */

  function translate$2(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  }
  /**
   * Scales the mat4 by the dimensions in the given vec3 not using vectorization
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {vec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/

  function scale$3(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Rotates a mat4 by the given angle around the given axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {vec3} axis the axis to rotate around
   * @returns {mat4} out
   */

  function rotate$3(out, a, rad, axis) {
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11]; // Construct the elements of the rotation matrix

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    return out;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * Creates a matrix from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {vec3} v Translation vector
   * @returns {mat4} out
   */

  function fromTranslation$2(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {vec3} v Scaling vector
   * @returns {mat4} out
   */

  function fromScaling$3(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @param {vec3} axis the axis to rotate around
   * @returns {mat4} out
   */

  function fromRotation$3(out, rad, axis) {
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s, c, t;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c; // Perform rotation-specific matrix multiplication

    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad); // Perform axis-specific matrix multiplication

    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad); // Perform axis-specific matrix multiplication

    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad); // Perform axis-specific matrix multiplication

    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @returns {mat4} out
   */

  function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a new mat4 from a dual quat.
   *
   * @param {mat4} out Matrix
   * @param {quat2} a Dual Quaternion
   * @returns {mat4} mat4 receiving operation result
   */

  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0],
        by = -a[1],
        bz = -a[2],
        bw = a[3],
        ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }

    fromRotationTranslation(out, a, translation);
    return out;
  }
  /**
   * Returns the translation vector component of a transformation
   *  matrix. If a matrix is built with fromRotationTranslation,
   *  the returned vector will be the same as the translation vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive translation component
   * @param  {mat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */

  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  /**
   * Returns the scaling factor component of a transformation
   *  matrix. If a matrix is built with fromRotationTranslationScale
   *  with a normalized Quaternion paramter, the returned vector will be
   *  the same as the scaling vector
   *  originally supplied.
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {mat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */

  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  /**
   * Returns a quaternion representing the rotational component
   *  of a transformation matrix. If a matrix is built with
   *  fromRotationTranslation, the returned quaternion will be the
   *  same as the quaternion originally supplied.
   * @param {quat} out Quaternion to receive the rotation component
   * @param {mat4} mat Matrix to be decomposed (input)
   * @return {quat} out
   */

  function getRotation(out, mat) {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    var trace = mat[0] + mat[5] + mat[10];
    var S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out[3] = 0.25 * S;
      out[0] = (mat[6] - mat[9]) / S;
      out[1] = (mat[8] - mat[2]) / S;
      out[2] = (mat[1] - mat[4]) / S;
    } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
      S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
      out[3] = (mat[6] - mat[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (mat[1] + mat[4]) / S;
      out[2] = (mat[8] + mat[2]) / S;
    } else if (mat[5] > mat[10]) {
      S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
      out[3] = (mat[8] - mat[2]) / S;
      out[0] = (mat[1] + mat[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (mat[6] + mat[9]) / S;
    } else {
      S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
      out[3] = (mat[1] - mat[4]) / S;
      out[0] = (mat[8] + mat[2]) / S;
      out[1] = (mat[6] + mat[9]) / S;
      out[2] = 0.25 * S;
    }

    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @param {vec3} s Scaling vector
   * @returns {mat4} out
   */

  function fromRotationTranslationScale(out, q, v, s) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat4} q Rotation quaternion
   * @param {vec3} v Translation vector
   * @param {vec3} s Scaling vector
   * @param {vec3} o The origin vector around which to scale and rotate
   * @returns {mat4} out
   */

  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a 4x4 matrix from the given quaternion
   *
   * @param {mat4} out mat4 receiving operation result
   * @param {quat} q Quaternion to create matrix from
   *
   * @returns {mat4} out
   */

  function fromQuat$1(out, q) {
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {Number} left Left bound of the frustum
   * @param {Number} right Right bound of the frustum
   * @param {Number} bottom Bottom bound of the frustum
   * @param {Number} top Top bound of the frustum
   * @param {Number} near Near bound of the frustum
   * @param {Number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

  function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }
  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
    var xScale = 2.0 / (leftTan + rightTan);
    var yScale = 2.0 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = far * near / (near - far);
    out[15] = 0.0;
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity$3(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  /**
   * Generates a matrix that makes something look at something else.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function targetTo(out, eye, target, up) {
    var eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2];
    var z0 = eyex - target[0],
        z1 = eyey - target[1],
        z2 = eyez - target[2];
    var len = z0 * z0 + z1 * z1 + z2 * z2;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }

    var x0 = upy * z2 - upz * z1,
        x1 = upz * z0 - upx * z2,
        x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  /**
   * Returns a string representation of a mat4
   *
   * @param {mat4} a matrix to represent as a string
   * @returns {String} string representation of the matrix
   */

  function str$3(a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
  }
  /**
   * Returns Frobenius norm of a mat4
   *
   * @param {mat4} a the matrix to calculate Frobenius norm of
   * @returns {Number} Frobenius norm
   */

  function frob$3(a) {
    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
  }
  /**
   * Adds two mat4's
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */

  function add$3(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */

  function subtract$3(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {Number} b amount to scale the matrix's elements by
   * @returns {mat4} out
   */

  function multiplyScalar$3(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   *
   * @param {mat4} out the receiving vector
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @returns {mat4} out
   */

  function multiplyScalarAndAdd$3(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    out[9] = a[9] + b[9] * scale;
    out[10] = a[10] + b[10] * scale;
    out[11] = a[11] + b[11] * scale;
    out[12] = a[12] + b[12] * scale;
    out[13] = a[13] + b[13] * scale;
    out[14] = a[14] + b[14] * scale;
    out[15] = a[15] + b[15] * scale;
    return out;
  }
  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {mat4} a The first matrix.
   * @param {mat4} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function exactEquals$3(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  /**
   * Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {mat4} a The first matrix.
   * @param {mat4} b The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   */

  function equals$4(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7];
    var a8 = a[8],
        a9 = a[9],
        a10 = a[10],
        a11 = a[11];
    var a12 = a[12],
        a13 = a[13],
        a14 = a[14],
        a15 = a[15];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    var b4 = b[4],
        b5 = b[5],
        b6 = b[6],
        b7 = b[7];
    var b8 = b[8],
        b9 = b[9],
        b10 = b[10],
        b11 = b[11];
    var b12 = b[12],
        b13 = b[13],
        b14 = b[14],
        b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
  }
  /**
   * Alias for {@link mat4.multiply}
   * @function
   */

  var mul$3 = multiply$3;
  /**
   * Alias for {@link mat4.subtract}
   * @function
   */

  var sub$3 = subtract$3;

  var mat4 = /*#__PURE__*/Object.freeze({
    create: create$3,
    clone: clone$3,
    copy: copy$3,
    fromValues: fromValues$3,
    set: set$3,
    identity: identity$3,
    transpose: transpose$2,
    invert: invert$3,
    adjoint: adjoint$2,
    determinant: determinant$3,
    multiply: multiply$3,
    translate: translate$2,
    scale: scale$3,
    rotate: rotate$3,
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    fromTranslation: fromTranslation$2,
    fromScaling: fromScaling$3,
    fromRotation: fromRotation$3,
    fromXRotation: fromXRotation,
    fromYRotation: fromYRotation,
    fromZRotation: fromZRotation,
    fromRotationTranslation: fromRotationTranslation,
    fromQuat2: fromQuat2,
    getTranslation: getTranslation,
    getScaling: getScaling,
    getRotation: getRotation,
    fromRotationTranslationScale: fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
    fromQuat: fromQuat$1,
    frustum: frustum,
    perspective: perspective,
    perspectiveFromFieldOfView: perspectiveFromFieldOfView,
    ortho: ortho,
    lookAt: lookAt,
    targetTo: targetTo,
    str: str$3,
    frob: frob$3,
    add: add$3,
    subtract: subtract$3,
    multiplyScalar: multiplyScalar$3,
    multiplyScalarAndAdd: multiplyScalarAndAdd$3,
    exactEquals: exactEquals$3,
    equals: equals$4,
    mul: mul$3,
    sub: sub$3
  });

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$4() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   *
   * @param {vec3} a vector to clone
   * @returns {vec3} a new 3D vector
   */

  function clone$4(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {vec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues$4(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Copy the values from one vec3 to another
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the source vector
   * @returns {vec3} out
   */

  function copy$4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} out
   */

  function set$4(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function add$4(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function subtract$4(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Multiplies two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function multiply$4(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  /**
   * Divides two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  /**
   * Math.ceil the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to ceil
   * @returns {vec3} out
   */

  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  /**
   * Math.floor the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to floor
   * @returns {vec3} out
   */

  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  /**
   * Returns the minimum of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  /**
   * Returns the maximum of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  /**
   * Math.round the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to round
   * @returns {vec3} out
   */

  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */

  function scale$4(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec3} out
   */

  function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} distance between a and b
   */

  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Calculates the squared euclidian distance between two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} squared distance between a and b
   */

  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Calculates the squared length of a vec3
   *
   * @param {vec3} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */

  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to negate
   * @returns {vec3} out
   */

  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to invert
   * @returns {vec3} out
   */

  function inverse(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    return out;
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec3} out
   */

  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  /**
   * Performs a hermite interpolation with two control points
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {vec3} c the third operand
   * @param {vec3} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec3} out
   */

  function hermite(out, a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Performs a bezier interpolation with two control points
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @param {vec3} c the third operand
   * @param {vec3} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec3} out
   */

  function bezier(out, a, b, c, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec3} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec3} out
   */

  function random(out, scale) {
    scale = scale || 1.0;
    var r = RANDOM() * 2.0 * Math.PI;
    var z = RANDOM() * 2.0 - 1.0;
    var zScale = Math.sqrt(1.0 - z * z) * scale;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
  }
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec3} out
   */

  function transformMat4(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  /**
   * Transforms the vec3 with a mat3.
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat3} m the 3x3 matrix to transform with
   * @returns {vec3} out
   */

  function transformMat3(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {quat} q quaternion to transform with
   * @returns {vec3} out
   */

  function transformQuat(out, a, q) {
    // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3];
    var x = a[0],
        y = a[1],
        z = a[2]; // var qvec = [qx, qy, qz];
    // var uv = vec3.cross([], qvec, a);

    var uvx = qy * z - qz * y,
        uvy = qz * x - qx * z,
        uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

    var uuvx = qy * uvz - qz * uvy,
        uuvy = qz * uvx - qx * uvz,
        uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2; // vec3.scale(uuv, uuv, 2);

    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateX$1(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0];
    r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
    r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateY$1(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateZ$1(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
    r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
    r[2] = p[2]; //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Get the angle between two 3D vectors
   * @param {vec3} a The first operand
   * @param {vec3} b The second operand
   * @returns {Number} The angle in radians
   */

  function angle(a, b) {
    var tempA = fromValues$4(a[0], a[1], a[2]);
    var tempB = fromValues$4(b[0], b[1], b[2]);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    var cosine = dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }
  /**
   * Returns a string representation of a vector
   *
   * @param {vec3} a vector to represent as a string
   * @returns {String} string representation of the vector
   */

  function str$4(a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   *
   * @param {vec3} a The first vector.
   * @param {vec3} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function exactEquals$4(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec3} a The first vector.
   * @param {vec3} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function equals$5(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
  }
  /**
   * Alias for {@link vec3.subtract}
   * @function
   */

  var sub$4 = subtract$4;
  /**
   * Alias for {@link vec3.multiply}
   * @function
   */

  var mul$4 = multiply$4;
  /**
   * Alias for {@link vec3.divide}
   * @function
   */

  var div = divide;
  /**
   * Alias for {@link vec3.distance}
   * @function
   */

  var dist = distance;
  /**
   * Alias for {@link vec3.squaredDistance}
   * @function
   */

  var sqrDist = squaredDistance;
  /**
   * Alias for {@link vec3.length}
   * @function
   */

  var len = length;
  /**
   * Alias for {@link vec3.squaredLength}
   * @function
   */

  var sqrLen = squaredLength;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create$4();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  var vec3 = /*#__PURE__*/Object.freeze({
    create: create$4,
    clone: clone$4,
    length: length,
    fromValues: fromValues$4,
    copy: copy$4,
    set: set$4,
    add: add$4,
    subtract: subtract$4,
    multiply: multiply$4,
    divide: divide,
    ceil: ceil,
    floor: floor,
    min: min,
    max: max,
    round: round,
    scale: scale$4,
    scaleAndAdd: scaleAndAdd,
    distance: distance,
    squaredDistance: squaredDistance,
    squaredLength: squaredLength,
    negate: negate,
    inverse: inverse,
    normalize: normalize,
    dot: dot,
    cross: cross,
    lerp: lerp,
    hermite: hermite,
    bezier: bezier,
    random: random,
    transformMat4: transformMat4,
    transformMat3: transformMat3,
    transformQuat: transformQuat,
    rotateX: rotateX$1,
    rotateY: rotateY$1,
    rotateZ: rotateZ$1,
    angle: angle,
    str: str$4,
    exactEquals: exactEquals$4,
    equals: equals$5,
    sub: sub$4,
    mul: mul$4,
    div: div,
    dist: dist,
    sqrDist: sqrDist,
    len: len,
    sqrLen: sqrLen,
    forEach: forEach
  });

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create$5() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec4 initialized with values from an existing vector
   *
   * @param {vec4} a vector to clone
   * @returns {vec4} a new 4D vector
   */

  function clone$5(a) {
    var out = new ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Creates a new vec4 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} a new 4D vector
   */

  function fromValues$5(x, y, z, w) {
    var out = new ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  /**
   * Copy the values from one vec4 to another
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the source vector
   * @returns {vec4} out
   */

  function copy$5(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Set the components of a vec4 to the given values
   *
   * @param {vec4} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} out
   */

  function set$5(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  /**
   * Adds two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function add$5(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function subtract$5(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }
  /**
   * Multiplies two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function multiply$5(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
  }
  /**
   * Divides two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function divide$1(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
  }
  /**
   * Math.ceil the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to ceil
   * @returns {vec4} out
   */

  function ceil$1(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
  }
  /**
   * Math.floor the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to floor
   * @returns {vec4} out
   */

  function floor$1(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
  }
  /**
   * Returns the minimum of two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function min$1(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
  }
  /**
   * Returns the maximum of two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function max$1(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
  }
  /**
   * Math.round the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to round
   * @returns {vec4} out
   */

  function round$1(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
  }
  /**
   * Scales a vec4 by a scalar number
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec4} out
   */

  function scale$5(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  /**
   * Adds two vec4's after scaling the second operand by a scalar value
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec4} out
   */

  function scaleAndAdd$1(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} distance between a and b
   */

  function distance$1(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    var w = b[3] - a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * Calculates the squared euclidian distance between two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} squared distance between a and b
   */

  function squaredDistance$1(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    var w = b[3] - a[3];
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Calculates the length of a vec4
   *
   * @param {vec4} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length$1(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * Calculates the squared length of a vec4
   *
   * @param {vec4} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */

  function squaredLength$1(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Negates the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to negate
   * @returns {vec4} out
   */

  function negate$1(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to invert
   * @returns {vec4} out
   */

  function inverse$1(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    out[3] = 1.0 / a[3];
    return out;
  }
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to normalize
   * @returns {vec4} out
   */

  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }

    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot$1(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  /**
   * Performs a linear interpolation between two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec4} out
   */

  function lerp$1(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec4} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec4} out
   */

  function random$1(out, scale) {
    scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
    // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
    // http://projecteuclid.org/euclid.aoms/1177692644;

    var v1, v2, v3, v4;
    var s1, s2;

    do {
      v1 = RANDOM() * 2 - 1;
      v2 = RANDOM() * 2 - 1;
      s1 = v1 * v1 + v2 * v2;
    } while (s1 >= 1);

    do {
      v3 = RANDOM() * 2 - 1;
      v4 = RANDOM() * 2 - 1;
      s2 = v3 * v3 + v4 * v4;
    } while (s2 >= 1);

    var d = Math.sqrt((1 - s1) / s2);
    out[0] = scale * v1;
    out[1] = scale * v2;
    out[2] = scale * v3 * d;
    out[3] = scale * v4 * d;
    return out;
  }
  /**
   * Transforms the vec4 with a mat4.
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec4} out
   */

  function transformMat4$1(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  /**
   * Transforms the vec4 with a quat
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to transform
   * @param {quat} q quaternion to transform with
   * @returns {vec4} out
   */

  function transformQuat$1(out, a, q) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3]; // calculate quat * vec

    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
  }
  /**
   * Returns a string representation of a vector
   *
   * @param {vec4} a vector to represent as a string
   * @returns {String} string representation of the vector
   */

  function str$5(a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   *
   * @param {vec4} a The first vector.
   * @param {vec4} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function exactEquals$5(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec4} a The first vector.
   * @param {vec4} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function equals$6(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
  }
  /**
   * Alias for {@link vec4.subtract}
   * @function
   */

  var sub$5 = subtract$5;
  /**
   * Alias for {@link vec4.multiply}
   * @function
   */

  var mul$5 = multiply$5;
  /**
   * Alias for {@link vec4.divide}
   * @function
   */

  var div$1 = divide$1;
  /**
   * Alias for {@link vec4.distance}
   * @function
   */

  var dist$1 = distance$1;
  /**
   * Alias for {@link vec4.squaredDistance}
   * @function
   */

  var sqrDist$1 = squaredDistance$1;
  /**
   * Alias for {@link vec4.length}
   * @function
   */

  var len$1 = length$1;
  /**
   * Alias for {@link vec4.squaredLength}
   * @function
   */

  var sqrLen$1 = squaredLength$1;
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$1 = function () {
    var vec = create$5();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  }();

  var vec4 = /*#__PURE__*/Object.freeze({
    create: create$5,
    clone: clone$5,
    fromValues: fromValues$5,
    copy: copy$5,
    set: set$5,
    add: add$5,
    subtract: subtract$5,
    multiply: multiply$5,
    divide: divide$1,
    ceil: ceil$1,
    floor: floor$1,
    min: min$1,
    max: max$1,
    round: round$1,
    scale: scale$5,
    scaleAndAdd: scaleAndAdd$1,
    distance: distance$1,
    squaredDistance: squaredDistance$1,
    length: length$1,
    squaredLength: squaredLength$1,
    negate: negate$1,
    inverse: inverse$1,
    normalize: normalize$1,
    dot: dot$1,
    lerp: lerp$1,
    random: random$1,
    transformMat4: transformMat4$1,
    transformQuat: transformQuat$1,
    str: str$5,
    exactEquals: exactEquals$5,
    equals: equals$6,
    sub: sub$5,
    mul: mul$5,
    div: div$1,
    dist: dist$1,
    sqrDist: sqrDist$1,
    len: len$1,
    sqrLen: sqrLen$1,
    forEach: forEach$1
  });

  /**
   * Quaternion
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */

  function create$6() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    out[3] = 1;
    return out;
  }
  /**
   * Set a quat to the identity quaternion
   *
   * @param {quat} out the receiving quaternion
   * @returns {quat} out
   */

  function identity$4(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/

  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param  {vec3} out_axis  Vector receiving the axis of rotation
   * @param  {quat} q     Quaternion to be decomposed
   * @return {Number}     Angle, in radians, of the rotation
   */

  function getAxisAngle(out_axis, q) {
    var rad = Math.acos(q[3]) * 2.0;
    var s = Math.sin(rad / 2.0);

    if (s > EPSILON) {
      out_axis[0] = q[0] / s;
      out_axis[1] = q[1] / s;
      out_axis[2] = q[2] / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }

    return rad;
  }
  /**
   * Multiplies two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {quat} out
   */

  function multiply$6(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the X axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateX$2(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Y axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateY$2(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var by = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Z axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateZ$2(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bz = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate W component of
   * @returns {quat} out
   */

  function calculateW(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1; // calc cosine

    cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    } // calculate coefficients


    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Generates a random quaternion
   *
   * @param {quat} out the receiving quaternion
   * @returns {quat} out
   */

  function random$2(out) {
    // Implementation of http://planning.cs.uiuc.edu/node198.html
    // TODO: Calling random 3 times is probably not the fastest solution
    var u1 = RANDOM();
    var u2 = RANDOM();
    var u3 = RANDOM();
    var sqrt1MinusU1 = Math.sqrt(1 - u1);
    var sqrtU1 = Math.sqrt(u1);
    out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
    out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
    out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
    out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
    return out;
  }
  /**
   * Calculates the inverse of a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate inverse of
   * @returns {quat} out
   */

  function invert$4(out, a) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var dot$$1 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    var invDot = dot$$1 ? 1.0 / dot$$1 : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate conjugate of
   * @returns {quat} out
   */

  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {mat3} m rotation matrix
   * @returns {quat} out
   * @function
   */

  function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w

      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)

      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out;
  }
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   *
   * @param {quat} out the receiving quaternion
   * @param {x} Angle to rotate around X axis in degrees.
   * @param {y} Angle to rotate around Y axis in degrees.
   * @param {z} Angle to rotate around Z axis in degrees.
   * @returns {quat} out
   * @function
   */

  function fromEuler(out, x, y, z) {
    var halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  /**
   * Returns a string representation of a quatenion
   *
   * @param {quat} a vector to represent as a string
   * @returns {String} string representation of the vector
   */

  function str$6(a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
  }
  /**
   * Creates a new quat initialized with values from an existing quaternion
   *
   * @param {quat} a quaternion to clone
   * @returns {quat} a new quaternion
   * @function
   */

  var clone$6 = clone$5;
  /**
   * Creates a new quat initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} a new quaternion
   * @function
   */

  var fromValues$6 = fromValues$5;
  /**
   * Copy the values from one quat to another
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the source quaternion
   * @returns {quat} out
   * @function
   */

  var copy$6 = copy$5;
  /**
   * Set the components of a quat to the given values
   *
   * @param {quat} out the receiving quaternion
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} out
   * @function
   */

  var set$6 = set$5;
  /**
   * Adds two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {quat} out
   * @function
   */

  var add$6 = add$5;
  /**
   * Alias for {@link quat.multiply}
   * @function
   */

  var mul$6 = multiply$6;
  /**
   * Scales a quat by a scalar number
   *
   * @param {quat} out the receiving vector
   * @param {quat} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {quat} out
   * @function
   */

  var scale$6 = scale$5;
  /**
   * Calculates the dot product of two quat's
   *
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {Number} dot product of a and b
   * @function
   */

  var dot$2 = dot$1;
  /**
   * Performs a linear interpolation between two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   * @function
   */

  var lerp$2 = lerp$1;
  /**
   * Calculates the length of a quat
   *
   * @param {quat} a vector to calculate length of
   * @returns {Number} length of a
   */

  var length$2 = length$1;
  /**
   * Alias for {@link quat.length}
   * @function
   */

  var len$2 = length$2;
  /**
   * Calculates the squared length of a quat
   *
   * @param {quat} a vector to calculate squared length of
   * @returns {Number} squared length of a
   * @function
   */

  var squaredLength$2 = squaredLength$1;
  /**
   * Alias for {@link quat.squaredLength}
   * @function
   */

  var sqrLen$2 = squaredLength$2;
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */

  var normalize$2 = normalize$1;
  /**
   * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
   *
   * @param {quat} a The first quaternion.
   * @param {quat} b The second quaternion.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  var exactEquals$6 = exactEquals$5;
  /**
   * Returns whether or not the quaternions have approximately the same elements in the same position.
   *
   * @param {quat} a The first vector.
   * @param {quat} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  var equals$7 = equals$6;
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */

  var rotationTo = function () {
    var tmpvec3 = create$4();
    var xUnitVec3 = fromValues$4(1, 0, 0);
    var yUnitVec3 = fromValues$4(0, 1, 0);
    return function (out, a, b) {
      var dot$$1 = dot(a, b);

      if (dot$$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$$1;
        return normalize$2(out, out);
      }
    };
  }();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  var sqlerp = function () {
    var temp1 = create$6();
    var temp2 = create$6();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */

  var setAxes = function () {
    var matr = create$2();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize$2(out, fromMat3(out, matr));
    };
  }();

  var quat = /*#__PURE__*/Object.freeze({
    create: create$6,
    identity: identity$4,
    setAxisAngle: setAxisAngle,
    getAxisAngle: getAxisAngle,
    multiply: multiply$6,
    rotateX: rotateX$2,
    rotateY: rotateY$2,
    rotateZ: rotateZ$2,
    calculateW: calculateW,
    slerp: slerp,
    random: random$2,
    invert: invert$4,
    conjugate: conjugate,
    fromMat3: fromMat3,
    fromEuler: fromEuler,
    str: str$6,
    clone: clone$6,
    fromValues: fromValues$6,
    copy: copy$6,
    set: set$6,
    add: add$6,
    mul: mul$6,
    scale: scale$6,
    dot: dot$2,
    lerp: lerp$2,
    length: length$2,
    len: len$2,
    squaredLength: squaredLength$2,
    sqrLen: sqrLen$2,
    normalize: normalize$2,
    exactEquals: exactEquals$6,
    equals: equals$7,
    rotationTo: rotationTo,
    sqlerp: sqlerp,
    setAxes: setAxes
  });

  /**
   * Dual Quaternion<br>
   * Format: [real, dual]<br>
   * Quaternion format: XYZW<br>
   * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
   * @module quat2
   */

  /**
   * Creates a new identity dual quat
   *
   * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
   */

  function create$7() {
    var dq = new ARRAY_TYPE(8);

    if (ARRAY_TYPE != Float32Array) {
      dq[0] = 0;
      dq[1] = 0;
      dq[2] = 0;
      dq[4] = 0;
      dq[5] = 0;
      dq[6] = 0;
      dq[7] = 0;
    }

    dq[3] = 1;
    return dq;
  }
  /**
   * Creates a new quat initialized with values from an existing quaternion
   *
   * @param {quat2} a dual quaternion to clone
   * @returns {quat2} new dual quaternion
   * @function
   */

  function clone$7(a) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = a[0];
    dq[1] = a[1];
    dq[2] = a[2];
    dq[3] = a[3];
    dq[4] = a[4];
    dq[5] = a[5];
    dq[6] = a[6];
    dq[7] = a[7];
    return dq;
  }
  /**
   * Creates a new dual quat initialized with the given values
   *
   * @param {Number} x1 X component
   * @param {Number} y1 Y component
   * @param {Number} z1 Z component
   * @param {Number} w1 W component
   * @param {Number} x2 X component
   * @param {Number} y2 Y component
   * @param {Number} z2 Z component
   * @param {Number} w2 W component
   * @returns {quat2} new dual quaternion
   * @function
   */

  function fromValues$7(x1, y1, z1, w1, x2, y2, z2, w2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    dq[4] = x2;
    dq[5] = y2;
    dq[6] = z2;
    dq[7] = w2;
    return dq;
  }
  /**
   * Creates a new dual quat from the given values (quat and translation)
   *
   * @param {Number} x1 X component
   * @param {Number} y1 Y component
   * @param {Number} z1 Z component
   * @param {Number} w1 W component
   * @param {Number} x2 X component (translation)
   * @param {Number} y2 Y component (translation)
   * @param {Number} z2 Z component (translation)
   * @returns {quat2} new dual quaternion
   * @function
   */

  function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    var ax = x2 * 0.5,
        ay = y2 * 0.5,
        az = z2 * 0.5;
    dq[4] = ax * w1 + ay * z1 - az * y1;
    dq[5] = ay * w1 + az * x1 - ax * z1;
    dq[6] = az * w1 + ax * y1 - ay * x1;
    dq[7] = -ax * x1 - ay * y1 - az * z1;
    return dq;
  }
  /**
   * Creates a dual quat from a quaternion and a translation
   *
   * @param {quat2} dual quaternion receiving operation result
   * @param {quat} q quaternion
   * @param {vec3} t tranlation vector
   * @returns {quat2} dual quaternion receiving operation result
   * @function
   */

  function fromRotationTranslation$1(out, q, t) {
    var ax = t[0] * 0.5,
        ay = t[1] * 0.5,
        az = t[2] * 0.5,
        bx = q[0],
        by = q[1],
        bz = q[2],
        bw = q[3];
    out[0] = bx;
    out[1] = by;
    out[2] = bz;
    out[3] = bw;
    out[4] = ax * bw + ay * bz - az * by;
    out[5] = ay * bw + az * bx - ax * bz;
    out[6] = az * bw + ax * by - ay * bx;
    out[7] = -ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * Creates a dual quat from a translation
   *
   * @param {quat2} dual quaternion receiving operation result
   * @param {vec3} t translation vector
   * @returns {quat2} dual quaternion receiving operation result
   * @function
   */

  function fromTranslation$3(out, t) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = t[0] * 0.5;
    out[5] = t[1] * 0.5;
    out[6] = t[2] * 0.5;
    out[7] = 0;
    return out;
  }
  /**
   * Creates a dual quat from a quaternion
   *
   * @param {quat2} dual quaternion receiving operation result
   * @param {quat} q the quaternion
   * @returns {quat2} dual quaternion receiving operation result
   * @function
   */

  function fromRotation$4(out, q) {
    out[0] = q[0];
    out[1] = q[1];
    out[2] = q[2];
    out[3] = q[3];
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  /**
   * Creates a new dual quat from a matrix (4x4)
   *
   * @param {quat2} out the dual quaternion
   * @param {mat4} a the matrix
   * @returns {quat2} dual quat receiving operation result
   * @function
   */

  function fromMat4$1(out, a) {
    //TODO Optimize this
    var outer = create$6();
    getRotation(outer, a);
    var t = new ARRAY_TYPE(3);
    getTranslation(t, a);
    fromRotationTranslation$1(out, outer, t);
    return out;
  }
  /**
   * Copy the values from one dual quat to another
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the source dual quaternion
   * @returns {quat2} out
   * @function
   */

  function copy$7(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    return out;
  }
  /**
   * Set a dual quat to the identity dual quaternion
   *
   * @param {quat2} out the receiving quaternion
   * @returns {quat2} out
   */

  function identity$5(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  /**
   * Set the components of a dual quat to the given values
   *
   * @param {quat2} out the receiving quaternion
   * @param {Number} x1 X component
   * @param {Number} y1 Y component
   * @param {Number} z1 Z component
   * @param {Number} w1 W component
   * @param {Number} x2 X component
   * @param {Number} y2 Y component
   * @param {Number} z2 Z component
   * @param {Number} w2 W component
   * @returns {quat2} out
   * @function
   */

  function set$7(out, x1, y1, z1, w1, x2, y2, z2, w2) {
    out[0] = x1;
    out[1] = y1;
    out[2] = z1;
    out[3] = w1;
    out[4] = x2;
    out[5] = y2;
    out[6] = z2;
    out[7] = w2;
    return out;
  }
  /**
   * Gets the real part of a dual quat
   * @param  {quat} out real part
   * @param  {quat2} a Dual Quaternion
   * @return {quat} real part
   */

  var getReal = copy$6;
  /**
   * Gets the dual part of a dual quat
   * @param  {quat} out dual part
   * @param  {quat2} a Dual Quaternion
   * @return {quat} dual part
   */

  function getDual(out, a) {
    out[0] = a[4];
    out[1] = a[5];
    out[2] = a[6];
    out[3] = a[7];
    return out;
  }
  /**
   * Set the real component of a dual quat to the given quaternion
   *
   * @param {quat2} out the receiving quaternion
   * @param {quat} q a quaternion representing the real part
   * @returns {quat2} out
   * @function
   */

  var setReal = copy$6;
  /**
   * Set the dual component of a dual quat to the given quaternion
   *
   * @param {quat2} out the receiving quaternion
   * @param {quat} q a quaternion representing the dual part
   * @returns {quat2} out
   * @function
   */

  function setDual(out, q) {
    out[4] = q[0];
    out[5] = q[1];
    out[6] = q[2];
    out[7] = q[3];
    return out;
  }
  /**
   * Gets the translation of a normalized dual quat
   * @param  {vec3} out translation
   * @param  {quat2} a Dual Quaternion to be decomposed
   * @return {vec3} translation
   */

  function getTranslation$1(out, a) {
    var ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7],
        bx = -a[0],
        by = -a[1],
        bz = -a[2],
        bw = a[3];
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return out;
  }
  /**
   * Translates a dual quat by the given vector
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to translate
   * @param {vec3} v vector to translate by
   * @returns {quat2} out
   */

  function translate$3(out, a, v) {
    var ax1 = a[0],
        ay1 = a[1],
        az1 = a[2],
        aw1 = a[3],
        bx1 = v[0] * 0.5,
        by1 = v[1] * 0.5,
        bz1 = v[2] * 0.5,
        ax2 = a[4],
        ay2 = a[5],
        az2 = a[6],
        aw2 = a[7];
    out[0] = ax1;
    out[1] = ay1;
    out[2] = az1;
    out[3] = aw1;
    out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return out;
  }
  /**
   * Rotates a dual quat around the X axis
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to rotate
   * @param {number} rad how far should the rotation be
   * @returns {quat2} out
   */

  function rotateX$3(out, a, rad) {
    var bx = -a[0],
        by = -a[1],
        bz = -a[2],
        bw = a[3],
        ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7],
        ax1 = ax * bw + aw * bx + ay * bz - az * by,
        ay1 = ay * bw + aw * by + az * bx - ax * bz,
        az1 = az * bw + aw * bz + ax * by - ay * bx,
        aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateX$2(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  /**
   * Rotates a dual quat around the Y axis
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to rotate
   * @param {number} rad how far should the rotation be
   * @returns {quat2} out
   */

  function rotateY$3(out, a, rad) {
    var bx = -a[0],
        by = -a[1],
        bz = -a[2],
        bw = a[3],
        ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7],
        ax1 = ax * bw + aw * bx + ay * bz - az * by,
        ay1 = ay * bw + aw * by + az * bx - ax * bz,
        az1 = az * bw + aw * bz + ax * by - ay * bx,
        aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateY$2(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  /**
   * Rotates a dual quat around the Z axis
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to rotate
   * @param {number} rad how far should the rotation be
   * @returns {quat2} out
   */

  function rotateZ$3(out, a, rad) {
    var bx = -a[0],
        by = -a[1],
        bz = -a[2],
        bw = a[3],
        ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7],
        ax1 = ax * bw + aw * bx + ay * bz - az * by,
        ay1 = ay * bw + aw * by + az * bx - ax * bz,
        az1 = az * bw + aw * bz + ax * by - ay * bx,
        aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateZ$2(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  /**
   * Rotates a dual quat by a given quaternion (a * q)
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to rotate
   * @param {quat} q quaternion to rotate by
   * @returns {quat2} out
   */

  function rotateByQuatAppend(out, a, q) {
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3],
        ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax * qw + aw * qx + ay * qz - az * qy;
    out[1] = ay * qw + aw * qy + az * qx - ax * qz;
    out[2] = az * qw + aw * qz + ax * qy - ay * qx;
    out[3] = aw * qw - ax * qx - ay * qy - az * qz;
    ax = a[4];
    ay = a[5];
    az = a[6];
    aw = a[7];
    out[4] = ax * qw + aw * qx + ay * qz - az * qy;
    out[5] = ay * qw + aw * qy + az * qx - ax * qz;
    out[6] = az * qw + aw * qz + ax * qy - ay * qx;
    out[7] = aw * qw - ax * qx - ay * qy - az * qz;
    return out;
  }
  /**
   * Rotates a dual quat by a given quaternion (q * a)
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat} q quaternion to rotate by
   * @param {quat2} a the dual quaternion to rotate
   * @returns {quat2} out
   */

  function rotateByQuatPrepend(out, q, a) {
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3],
        bx = a[0],
        by = a[1],
        bz = a[2],
        bw = a[3];
    out[0] = qx * bw + qw * bx + qy * bz - qz * by;
    out[1] = qy * bw + qw * by + qz * bx - qx * bz;
    out[2] = qz * bw + qw * bz + qx * by - qy * bx;
    out[3] = qw * bw - qx * bx - qy * by - qz * bz;
    bx = a[4];
    by = a[5];
    bz = a[6];
    bw = a[7];
    out[4] = qx * bw + qw * bx + qy * bz - qz * by;
    out[5] = qy * bw + qw * by + qz * bx - qx * bz;
    out[6] = qz * bw + qw * bz + qx * by - qy * bx;
    out[7] = qw * bw - qx * bx - qy * by - qz * bz;
    return out;
  }
  /**
   * Rotates a dual quat around a given axis. Does the normalisation automatically
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the dual quaternion to rotate
   * @param {vec3} axis the axis to rotate around
   * @param {Number} rad how far the rotation should be
   * @returns {quat2} out
   */

  function rotateAroundAxis(out, a, axis, rad) {
    //Special case for rad = 0
    if (Math.abs(rad) < EPSILON) {
      return copy$7(out, a);
    }

    var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    rad = rad * 0.5;
    var s = Math.sin(rad);
    var bx = s * axis[0] / axisLength;
    var by = s * axis[1] / axisLength;
    var bz = s * axis[2] / axisLength;
    var bw = Math.cos(rad);
    var ax1 = a[0],
        ay1 = a[1],
        az1 = a[2],
        aw1 = a[3];
    out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    var ax = a[4],
        ay = a[5],
        az = a[6],
        aw = a[7];
    out[4] = ax * bw + aw * bx + ay * bz - az * by;
    out[5] = ay * bw + aw * by + az * bx - ax * bz;
    out[6] = az * bw + aw * bz + ax * by - ay * bx;
    out[7] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * Adds two dual quat's
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the first operand
   * @param {quat2} b the second operand
   * @returns {quat2} out
   * @function
   */

  function add$7(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    return out;
  }
  /**
   * Multiplies two dual quat's
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a the first operand
   * @param {quat2} b the second operand
   * @returns {quat2} out
   */

  function multiply$7(out, a, b) {
    var ax0 = a[0],
        ay0 = a[1],
        az0 = a[2],
        aw0 = a[3],
        bx1 = b[4],
        by1 = b[5],
        bz1 = b[6],
        bw1 = b[7],
        ax1 = a[4],
        ay1 = a[5],
        az1 = a[6],
        aw1 = a[7],
        bx0 = b[0],
        by0 = b[1],
        bz0 = b[2],
        bw0 = b[3];
    out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return out;
  }
  /**
   * Alias for {@link quat2.multiply}
   * @function
   */

  var mul$7 = multiply$7;
  /**
   * Scales a dual quat by a scalar number
   *
   * @param {quat2} out the receiving dual quat
   * @param {quat2} a the dual quat to scale
   * @param {Number} b amount to scale the dual quat by
   * @returns {quat2} out
   * @function
   */

  function scale$7(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    return out;
  }
  /**
   * Calculates the dot product of two dual quat's (The dot product of the real parts)
   *
   * @param {quat2} a the first operand
   * @param {quat2} b the second operand
   * @returns {Number} dot product of a and b
   * @function
   */

  var dot$3 = dot$2;
  /**
   * Performs a linear interpolation between two dual quats's
   * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
   *
   * @param {quat2} out the receiving dual quat
   * @param {quat2} a the first operand
   * @param {quat2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat2} out
   */

  function lerp$3(out, a, b, t) {
    var mt = 1 - t;
    if (dot$3(a, b) < 0) t = -t;
    out[0] = a[0] * mt + b[0] * t;
    out[1] = a[1] * mt + b[1] * t;
    out[2] = a[2] * mt + b[2] * t;
    out[3] = a[3] * mt + b[3] * t;
    out[4] = a[4] * mt + b[4] * t;
    out[5] = a[5] * mt + b[5] * t;
    out[6] = a[6] * mt + b[6] * t;
    out[7] = a[7] * mt + b[7] * t;
    return out;
  }
  /**
   * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a dual quat to calculate inverse of
   * @returns {quat2} out
   */

  function invert$5(out, a) {
    var sqlen = squaredLength$3(a);
    out[0] = -a[0] / sqlen;
    out[1] = -a[1] / sqlen;
    out[2] = -a[2] / sqlen;
    out[3] = a[3] / sqlen;
    out[4] = -a[4] / sqlen;
    out[5] = -a[5] / sqlen;
    out[6] = -a[6] / sqlen;
    out[7] = a[7] / sqlen;
    return out;
  }
  /**
   * Calculates the conjugate of a dual quat
   * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
   *
   * @param {quat2} out the receiving quaternion
   * @param {quat2} a quat to calculate conjugate of
   * @returns {quat2} out
   */

  function conjugate$1(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    out[4] = -a[4];
    out[5] = -a[5];
    out[6] = -a[6];
    out[7] = a[7];
    return out;
  }
  /**
   * Calculates the length of a dual quat
   *
   * @param {quat2} a dual quat to calculate length of
   * @returns {Number} length of a
   * @function
   */

  var length$3 = length$2;
  /**
   * Alias for {@link quat2.length}
   * @function
   */

  var len$3 = length$3;
  /**
   * Calculates the squared length of a dual quat
   *
   * @param {quat2} a dual quat to calculate squared length of
   * @returns {Number} squared length of a
   * @function
   */

  var squaredLength$3 = squaredLength$2;
  /**
   * Alias for {@link quat2.squaredLength}
   * @function
   */

  var sqrLen$3 = squaredLength$3;
  /**
   * Normalize a dual quat
   *
   * @param {quat2} out the receiving dual quaternion
   * @param {quat2} a dual quaternion to normalize
   * @returns {quat2} out
   * @function
   */

  function normalize$3(out, a) {
    var magnitude = squaredLength$3(a);

    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude);
      var a0 = a[0] / magnitude;
      var a1 = a[1] / magnitude;
      var a2 = a[2] / magnitude;
      var a3 = a[3] / magnitude;
      var b0 = a[4];
      var b1 = a[5];
      var b2 = a[6];
      var b3 = a[7];
      var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = (b0 - a0 * a_dot_b) / magnitude;
      out[5] = (b1 - a1 * a_dot_b) / magnitude;
      out[6] = (b2 - a2 * a_dot_b) / magnitude;
      out[7] = (b3 - a3 * a_dot_b) / magnitude;
    }

    return out;
  }
  /**
   * Returns a string representation of a dual quatenion
   *
   * @param {quat2} a dual quaternion to represent as a string
   * @returns {String} string representation of the dual quat
   */

  function str$7(a) {
    return 'quat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ')';
  }
  /**
   * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
   *
   * @param {quat2} a the first dual quaternion.
   * @param {quat2} b the second dual quaternion.
   * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
   */

  function exactEquals$7(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
  }
  /**
   * Returns whether or not the dual quaternions have approximately the same elements in the same position.
   *
   * @param {quat2} a the first dual quat.
   * @param {quat2} b the second dual quat.
   * @returns {Boolean} true if the dual quats are equal, false otherwise.
   */

  function equals$8(a, b) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3],
        a4 = a[4],
        a5 = a[5],
        a6 = a[6],
        a7 = a[7];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3],
        b4 = b[4],
        b5 = b[5],
        b6 = b[6],
        b7 = b[7];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
  }

  var quat2 = /*#__PURE__*/Object.freeze({
    create: create$7,
    clone: clone$7,
    fromValues: fromValues$7,
    fromRotationTranslationValues: fromRotationTranslationValues,
    fromRotationTranslation: fromRotationTranslation$1,
    fromTranslation: fromTranslation$3,
    fromRotation: fromRotation$4,
    fromMat4: fromMat4$1,
    copy: copy$7,
    identity: identity$5,
    set: set$7,
    getReal: getReal,
    getDual: getDual,
    setReal: setReal,
    setDual: setDual,
    getTranslation: getTranslation$1,
    translate: translate$3,
    rotateX: rotateX$3,
    rotateY: rotateY$3,
    rotateZ: rotateZ$3,
    rotateByQuatAppend: rotateByQuatAppend,
    rotateByQuatPrepend: rotateByQuatPrepend,
    rotateAroundAxis: rotateAroundAxis,
    add: add$7,
    multiply: multiply$7,
    mul: mul$7,
    scale: scale$7,
    dot: dot$3,
    lerp: lerp$3,
    invert: invert$5,
    conjugate: conjugate$1,
    length: length$3,
    len: len$3,
    squaredLength: squaredLength$3,
    sqrLen: sqrLen$3,
    normalize: normalize$3,
    str: str$7,
    exactEquals: exactEquals$7,
    equals: equals$8
  });

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create$8() {
    var out = new ARRAY_TYPE(2);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec2 initialized with values from an existing vector
   *
   * @param {vec2} a vector to clone
   * @returns {vec2} a new 2D vector
   */

  function clone$8(a) {
    var out = new ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  /**
   * Creates a new vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} a new 2D vector
   */

  function fromValues$8(x, y) {
    var out = new ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * Copy the values from one vec2 to another
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the source vector
   * @returns {vec2} out
   */

  function copy$8(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  /**
   * Set the components of a vec2 to the given values
   *
   * @param {vec2} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @returns {vec2} out
   */

  function set$8(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * Adds two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function add$8(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function subtract$6(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  }
  /**
   * Multiplies two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function multiply$8(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  }
  /**
   * Divides two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function divide$2(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  }
  /**
   * Math.ceil the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to ceil
   * @returns {vec2} out
   */

  function ceil$2(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
  }
  /**
   * Math.floor the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to floor
   * @returns {vec2} out
   */

  function floor$2(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
  }
  /**
   * Returns the minimum of two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function min$2(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  }
  /**
   * Returns the maximum of two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec2} out
   */

  function max$2(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  }
  /**
   * Math.round the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to round
   * @returns {vec2} out
   */

  function round$2(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
  }
  /**
   * Scales a vec2 by a scalar number
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec2} out
   */

  function scale$8(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }
  /**
   * Adds two vec2's after scaling the second operand by a scalar value
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec2} out
   */

  function scaleAndAdd$2(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} distance between a and b
   */

  function distance$2(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x * x + y * y);
  }
  /**
   * Calculates the squared euclidian distance between two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} squared distance between a and b
   */

  function squaredDistance$2(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x * x + y * y;
  }
  /**
   * Calculates the length of a vec2
   *
   * @param {vec2} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length$4(a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x * x + y * y);
  }
  /**
   * Calculates the squared length of a vec2
   *
   * @param {vec2} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */

  function squaredLength$4(a) {
    var x = a[0],
        y = a[1];
    return x * x + y * y;
  }
  /**
   * Negates the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to negate
   * @returns {vec2} out
   */

  function negate$2(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to invert
   * @returns {vec2} out
   */

  function inverse$2(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    return out;
  }
  /**
   * Normalize a vec2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a vector to normalize
   * @returns {vec2} out
   */

  function normalize$4(out, a) {
    var x = a[0],
        y = a[1];
    var len = x * x + y * y;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot$4(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  /**
   * Computes the cross product of two vec2's
   * Note that the cross product must by definition produce a 3D vector
   *
   * @param {vec3} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec3} out
   */

  function cross$1(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec2's
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec2} out
   */

  function lerp$4(out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
  }
  /**
   * Generates a random vector with the given scale
   *
   * @param {vec2} out the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec2} out
   */

  function random$3(out, scale) {
    scale = scale || 1.0;
    var r = RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
  }
  /**
   * Transforms the vec2 with a mat2
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat2} m matrix to transform with
   * @returns {vec2} out
   */

  function transformMat2(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
  }
  /**
   * Transforms the vec2 with a mat2d
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat2d} m matrix to transform with
   * @returns {vec2} out
   */

  function transformMat2d(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
  }
  /**
   * Transforms the vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat3} m matrix to transform with
   * @returns {vec2} out
   */

  function transformMat3$1(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }
  /**
   * Transforms the vec2 with a mat4
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec2} out
   */

  function transformMat4$2(out, a, m) {
    var x = a[0];
    var y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
  }
  /**
   * Rotate a 2D vector
   * @param {vec2} out The receiving vec2
   * @param {vec2} a The vec2 point to rotate
   * @param {vec2} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec2} out
   */

  function rotate$4(out, a, b, c) {
    //Translate point to the origin
    var p0 = a[0] - b[0],
        p1 = a[1] - b[1],
        sinC = Math.sin(c),
        cosC = Math.cos(c); //perform rotation and translate to correct position

    out[0] = p0 * cosC - p1 * sinC + b[0];
    out[1] = p0 * sinC + p1 * cosC + b[1];
    return out;
  }
  /**
   * Get the angle between two 2D vectors
   * @param {vec2} a The first operand
   * @param {vec2} b The second operand
   * @returns {Number} The angle in radians
   */

  function angle$1(a, b) {
    var x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1];
    var len1 = x1 * x1 + y1 * y1;

    if (len1 > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len1 = 1 / Math.sqrt(len1);
    }

    var len2 = x2 * x2 + y2 * y2;

    if (len2 > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len2 = 1 / Math.sqrt(len2);
    }

    var cosine = (x1 * x2 + y1 * y2) * len1 * len2;

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }
  /**
   * Returns a string representation of a vector
   *
   * @param {vec2} a vector to represent as a string
   * @returns {String} string representation of the vector
   */

  function str$8(a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
  }
  /**
   * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function exactEquals$8(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   *
   * @param {vec2} a The first vector.
   * @param {vec2} b The second vector.
   * @returns {Boolean} True if the vectors are equal, false otherwise.
   */

  function equals$9(a, b) {
    var a0 = a[0],
        a1 = a[1];
    var b0 = b[0],
        b1 = b[1];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
  }
  /**
   * Alias for {@link vec2.length}
   * @function
   */

  var len$4 = length$4;
  /**
   * Alias for {@link vec2.subtract}
   * @function
   */

  var sub$6 = subtract$6;
  /**
   * Alias for {@link vec2.multiply}
   * @function
   */

  var mul$8 = multiply$8;
  /**
   * Alias for {@link vec2.divide}
   * @function
   */

  var div$2 = divide$2;
  /**
   * Alias for {@link vec2.distance}
   * @function
   */

  var dist$2 = distance$2;
  /**
   * Alias for {@link vec2.squaredDistance}
   * @function
   */

  var sqrDist$2 = squaredDistance$2;
  /**
   * Alias for {@link vec2.squaredLength}
   * @function
   */

  var sqrLen$4 = squaredLength$4;
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$2 = function () {
    var vec = create$8();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  }();

  var vec2 = /*#__PURE__*/Object.freeze({
    create: create$8,
    clone: clone$8,
    fromValues: fromValues$8,
    copy: copy$8,
    set: set$8,
    add: add$8,
    subtract: subtract$6,
    multiply: multiply$8,
    divide: divide$2,
    ceil: ceil$2,
    floor: floor$2,
    min: min$2,
    max: max$2,
    round: round$2,
    scale: scale$8,
    scaleAndAdd: scaleAndAdd$2,
    distance: distance$2,
    squaredDistance: squaredDistance$2,
    length: length$4,
    squaredLength: squaredLength$4,
    negate: negate$2,
    inverse: inverse$2,
    normalize: normalize$4,
    dot: dot$4,
    cross: cross$1,
    lerp: lerp$4,
    random: random$3,
    transformMat2: transformMat2,
    transformMat2d: transformMat2d,
    transformMat3: transformMat3$1,
    transformMat4: transformMat4$2,
    rotate: rotate$4,
    angle: angle$1,
    str: str$8,
    exactEquals: exactEquals$8,
    equals: equals$9,
    len: len$4,
    sub: sub$6,
    mul: mul$8,
    div: div$2,
    dist: dist$2,
    sqrDist: sqrDist$2,
    sqrLen: sqrLen$4,
    forEach: forEach$2
  });

  exports.glMatrix = common;
  exports.mat2 = mat2;
  exports.mat2d = mat2d;
  exports.mat3 = mat3;
  exports.mat4 = mat4;
  exports.quat = quat;
  exports.quat2 = quat2;
  exports.vec2 = vec2;
  exports.vec3 = vec3;
  exports.vec4 = vec4;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gl-matrix */ "./gl-matrix.js");
/* harmony import */ var _gl_matrix__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_gl_matrix__WEBPACK_IMPORTED_MODULE_0__);


main();

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function initBuffers(gl) {

	const positions = [
		10.0,  10.0,  0,
		138.0,  10.0, 0,
		10.0, 138.0,  0,
		138.0, 138.0, 0,
	];

	const colors = [
		1.0,  1.0,  1.0,  1.0,    // white
		1.0,  0.0,  0.0,  1.0,    // red
		0.0,  1.0,  0.0,  1.0,    // green
		0.0,  0.0,  1.0,  1.0,    // blue
	];

	const textureCoordinates = [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	];

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,
		new Float32Array(positions),
		gl.STATIC_DRAW);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		color: colorBuffer,
		textureCoord: textureCoordBuffer
	};
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url, done) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
		width, height, border, srcFormat, srcType,
		pixel);

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			srcFormat, srcType, image);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn of mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		if (done) done(texture);
	};
	image.src = url;

	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");
  // Vertex shader program
	const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;
	const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		},
	};

	const texture = loadTexture(gl, 'cube.png');
	const buffers = initBuffers(gl);

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	const projectionMatrix = _gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create();
	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	_gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].ortho(projectionMatrix, 0.0, 320.0, 240.0, 0.0, 0.1, 100);

	const modelViewMatrix = _gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create();
	_gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].translate(modelViewMatrix,
		modelViewMatrix,
		[-0.0, 0.0, -0.1]);

	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute.
	{
		const numComponents = 3;  // pull out 2 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
	}

	// tell webgl how to pull out the texture coordinates from buffer
	{
		const num = 2; // every coordinate composed of 2 values
		const type = gl.FLOAT; // the data in the buffer is 32 bit float
		const normalize = false; // don't normalize
		const stride = 0; // how many bytes to get from one set to the next
		const offset = 0; // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

		// Tell WebGL we want to affect texture unit 0
		gl.activeTexture(gl.TEXTURE0);

		// Bind the texture to texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Tell the shader we bound the texture to texture unit 0
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	}

	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);

	// Set the shader uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZ2wtbWF0cml4LmpzIiwid2VicGFjazovLy8uL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRSxLQUE0RDtBQUM5RCxFQUFFLFNBQ2lDO0FBQ25DLENBQUMsNEJBQTRCOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsUUFBUTtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUIsRUFBRTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOztBQUVsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFB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T0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQzs7QUFFcEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxNQUFNO0FBQ25CLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsTUFBTTtBQUNuQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7O0FBRTFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLEtBQUs7QUFDbkIsY0FBYyxLQUFLO0FBQ25CLGNBQWMsS0FBSztBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLEtBQUs7QUFDbkIsY0FBYyxLQUFLO0FBQ25CLGNBQWMsS0FBSztBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixjQUFjLEtBQUs7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxNQUFNO0FBQ25CLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsTUFBTTtBQUNuQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQSxtREFBbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0EsbURBQW1EOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGFBQWEsT0FBTztBQUNwQixlQUFlLE1BQU07QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQSxzQkFBc0IsT0FBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9B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QSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMsa0RBQWtEOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjtBQUNBOztBQUVBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsTUFBTTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixlQUFlLE1BQU07QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLE1BQU07QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsTUFBTTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsTUFBTTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixlQUFlLE9BQU87QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLE9BQU87QUFDcEIsZUFBZSxLQUFLO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsT0FBTztBQUNwQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsTUFBTTtBQUNuQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGVBQWUsT0FBTztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsZUFBZSxPQUFPO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsTUFBTTtBQUNuQixhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEIsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsTUFBTTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBLHNCQUFzQixPQUFPO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdEQUFnRCxjQUFjOztBQUU5RCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDNXhPRDtBQUFBO0FBQUE7QUFBaUM7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsMEJBQTBCO0FBQzFCLHlCQUF5Qjs7QUFFekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLCtDQUFJO0FBQzlCO0FBQ0E7QUFDQSxDQUFDLCtDQUFJOztBQUVMLHlCQUF5QiwrQ0FBSTtBQUM3QixDQUFDLCtDQUFJO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsd0JBQXdCO0FBQ3hCLDBCQUEwQjtBQUMxQixtQkFBbUI7QUFDbkI7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLHdCQUF3QjtBQUN4QiwwQkFBMEI7QUFDMUIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2FtZS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9idWlsZC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9pbmRleC5qc1wiKTtcbiIsIlxuLyohXG5AZmlsZW92ZXJ2aWV3IGdsLW1hdHJpeCAtIEhpZ2ggcGVyZm9ybWFuY2UgbWF0cml4IGFuZCB2ZWN0b3Igb3BlcmF0aW9uc1xuQGF1dGhvciBCcmFuZG9uIEpvbmVzXG5AYXV0aG9yIENvbGluIE1hY0tlbnppZSBJVlxuQHZlcnNpb24gMy4wLjAtMFxuXG5Db3B5cmlnaHQgKGMpIDIwMTUtMjAxOCwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIChmYWN0b3J5KChnbG9iYWwuZ2xNYXRyaXggPSB7fSkpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ29tbW9uIHV0aWxpdGllc1xuICAgKiBAbW9kdWxlIGdsTWF0cml4XG4gICAqL1xuICAvLyBDb25maWd1cmF0aW9uIENvbnN0YW50c1xuICB2YXIgRVBTSUxPTiA9IDAuMDAwMDAxO1xuICB2YXIgQVJSQVlfVFlQRSA9IHR5cGVvZiBGbG9hdDMyQXJyYXkgIT09ICd1bmRlZmluZWQnID8gRmxvYXQzMkFycmF5IDogQXJyYXk7XG4gIHZhciBSQU5ET00gPSBNYXRoLnJhbmRvbTtcbiAgLyoqXG4gICAqIFNldHMgdGhlIHR5cGUgb2YgYXJyYXkgdXNlZCB3aGVuIGNyZWF0aW5nIG5ldyB2ZWN0b3JzIGFuZCBtYXRyaWNlc1xuICAgKlxuICAgKiBAcGFyYW0ge1R5cGV9IHR5cGUgQXJyYXkgdHlwZSwgc3VjaCBhcyBGbG9hdDMyQXJyYXkgb3IgQXJyYXlcbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0TWF0cml4QXJyYXlUeXBlKHR5cGUpIHtcbiAgICBBUlJBWV9UWVBFID0gdHlwZTtcbiAgfVxuICB2YXIgZGVncmVlID0gTWF0aC5QSSAvIDE4MDtcbiAgLyoqXG4gICAqIENvbnZlcnQgRGVncmVlIFRvIFJhZGlhblxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYSBBbmdsZSBpbiBEZWdyZWVzXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRvUmFkaWFuKGEpIHtcbiAgICByZXR1cm4gYSAqIGRlZ3JlZTtcbiAgfVxuICAvKipcbiAgICogVGVzdHMgd2hldGhlciBvciBub3QgdGhlIGFyZ3VtZW50cyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgdmFsdWUsIHdpdGhpbiBhbiBhYnNvbHV0ZVxuICAgKiBvciByZWxhdGl2ZSB0b2xlcmFuY2Ugb2YgZ2xNYXRyaXguRVBTSUxPTiAoYW4gYWJzb2x1dGUgdG9sZXJhbmNlIGlzIHVzZWQgZm9yIHZhbHVlcyBsZXNzXG4gICAqIHRoYW4gb3IgZXF1YWwgdG8gMS4wLCBhbmQgYSByZWxhdGl2ZSB0b2xlcmFuY2UgaXMgdXNlZCBmb3IgbGFyZ2VyIHZhbHVlcylcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGEgVGhlIGZpcnN0IG51bWJlciB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gYiBUaGUgc2Vjb25kIG51bWJlciB0byB0ZXN0LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgbnVtYmVycyBhcmUgYXBwcm94aW1hdGVseSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBNYXRoLmFicyhhIC0gYikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYSksIE1hdGguYWJzKGIpKTtcbiAgfVxuXG4gIHZhciBjb21tb24gPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgRVBTSUxPTjogRVBTSUxPTixcbiAgICBnZXQgQVJSQVlfVFlQRSAoKSB7IHJldHVybiBBUlJBWV9UWVBFOyB9LFxuICAgIFJBTkRPTTogUkFORE9NLFxuICAgIHNldE1hdHJpeEFycmF5VHlwZTogc2V0TWF0cml4QXJyYXlUeXBlLFxuICAgIHRvUmFkaWFuOiB0b1JhZGlhbixcbiAgICBlcXVhbHM6IGVxdWFsc1xuICB9KTtcblxuICAvKipcbiAgICogMngyIE1hdHJpeFxuICAgKiBAbW9kdWxlIG1hdDJcbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0MlxuICAgKlxuICAgKiBAcmV0dXJucyB7bWF0Mn0gYSBuZXcgMngyIG1hdHJpeFxuICAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGUoKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDQpO1xuXG4gICAgaWYgKEFSUkFZX1RZUEUgIT0gRmxvYXQzMkFycmF5KSB7XG4gICAgICBvdXRbMV0gPSAwO1xuICAgICAgb3V0WzJdID0gMDtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBtYXQyIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0Mn0gYSBtYXRyaXggdG8gY2xvbmVcbiAgICogQHJldHVybnMge21hdDJ9IGEgbmV3IDJ4MiBtYXRyaXhcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUoYSkge1xuICAgIHZhciBvdXQgPSBuZXcgQVJSQVlfVFlQRSg0KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQyIHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY29weShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldCBhIG1hdDIgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGlkZW50aXR5KG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG1hdDIgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDAgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTEwIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDAgcG9zaXRpb24gKGluZGV4IDIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTEgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMylcbiAgICogQHJldHVybnMge21hdDJ9IG91dCBBIG5ldyAyeDIgbWF0cml4XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21WYWx1ZXMobTAwLCBtMDEsIG0xMCwgbTExKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IG0wMDtcbiAgICBvdXRbMV0gPSBtMDE7XG4gICAgb3V0WzJdID0gbTEwO1xuICAgIG91dFszXSA9IG0xMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBtYXQyIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMCBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAwKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAxIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDEgcG9zaXRpb24gKGluZGV4IDEpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTAgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAzKVxuICAgKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldChvdXQsIG0wMCwgbTAxLCBtMTAsIG0xMSkge1xuICAgIG91dFswXSA9IG0wMDtcbiAgICBvdXRbMV0gPSBtMDE7XG4gICAgb3V0WzJdID0gbTEwO1xuICAgIG91dFszXSA9IG0xMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhbnNwb3NlKG91dCwgYSkge1xuICAgIC8vIElmIHdlIGFyZSB0cmFuc3Bvc2luZyBvdXJzZWx2ZXMgd2UgY2FuIHNraXAgYSBmZXcgc3RlcHMgYnV0IGhhdmUgdG8gY2FjaGVcbiAgICAvLyBzb21lIHZhbHVlc1xuICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgIHZhciBhMSA9IGFbMV07XG4gICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgb3V0WzJdID0gYTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgb3V0WzJdID0gYVsxXTtcbiAgICAgIG91dFszXSA9IGFbM107XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogSW52ZXJ0cyBhIG1hdDJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJ0KG91dCwgYSkge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM107IC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcblxuICAgIHZhciBkZXQgPSBhMCAqIGEzIC0gYTIgKiBhMTtcblxuICAgIGlmICghZGV0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG4gICAgb3V0WzBdID0gYTMgKiBkZXQ7XG4gICAgb3V0WzFdID0gLWExICogZGV0O1xuICAgIG91dFsyXSA9IC1hMiAqIGRldDtcbiAgICBvdXRbM10gPSBhMCAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gYWRqb2ludChvdXQsIGEpIHtcbiAgICAvLyBDYWNoaW5nIHRoaXMgdmFsdWUgaXMgbmVzc2VjYXJ5IGlmIG91dCA9PSBhXG4gICAgdmFyIGEwID0gYVswXTtcbiAgICBvdXRbMF0gPSBhWzNdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIG91dFszXSA9IGEwO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0MlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICAgKi9cblxuICBmdW5jdGlvbiBkZXRlcm1pbmFudChhKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBhWzNdIC0gYVsyXSAqIGFbMV07XG4gIH1cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgdHdvIG1hdDInc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5KG91dCwgYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM107XG4gICAgdmFyIGIwID0gYlswXSxcbiAgICAgICAgYjEgPSBiWzFdLFxuICAgICAgICBiMiA9IGJbMl0sXG4gICAgICAgIGIzID0gYlszXTtcbiAgICBvdXRbMF0gPSBhMCAqIGIwICsgYTIgKiBiMTtcbiAgICBvdXRbMV0gPSBhMSAqIGIwICsgYTMgKiBiMTtcbiAgICBvdXRbMl0gPSBhMCAqIGIyICsgYTIgKiBiMztcbiAgICBvdXRbM10gPSBhMSAqIGIyICsgYTMgKiBiMztcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0MiBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcm90YXRlKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXTtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGEwICogYyArIGEyICogcztcbiAgICBvdXRbMV0gPSBhMSAqIGMgKyBhMyAqIHM7XG4gICAgb3V0WzJdID0gYTAgKiAtcyArIGEyICogYztcbiAgICBvdXRbM10gPSBhMSAqIC1zICsgYTMgKiBjO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNjYWxlcyB0aGUgbWF0MiBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJ9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAgICogQHBhcmFtIHt2ZWMyfSB2IHRoZSB2ZWMyIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDJ9IG91dFxuICAgKiovXG5cbiAgZnVuY3Rpb24gc2NhbGUob3V0LCBhLCB2KSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXTtcbiAgICB2YXIgdjAgPSB2WzBdLFxuICAgICAgICB2MSA9IHZbMV07XG4gICAgb3V0WzBdID0gYTAgKiB2MDtcbiAgICBvdXRbMV0gPSBhMSAqIHYwO1xuICAgIG91dFsyXSA9IGEyICogdjE7XG4gICAgb3V0WzNdID0gYTMgKiB2MTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZVxuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDIuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQyLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IG91dCBtYXQyIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uKG91dCwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBvdXRbMF0gPSBjO1xuICAgIG91dFsxXSA9IHM7XG4gICAgb3V0WzJdID0gLXM7XG4gICAgb3V0WzNdID0gYztcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3Igc2NhbGluZ1xuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDIuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQyLnNjYWxlKGRlc3QsIGRlc3QsIHZlYyk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0Mn0gb3V0IG1hdDIgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHt2ZWMyfSB2IFNjYWxpbmcgdmVjdG9yXG4gICAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVNjYWxpbmcob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gdlswXTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gdlsxXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0MlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IGEgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICAgKi9cblxuICBmdW5jdGlvbiBzdHIoYSkge1xuICAgIHJldHVybiAnbWF0MignICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcpJztcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IEZyb2Jlbml1cyBub3JtXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb2IoYSkge1xuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIEwsIEQgYW5kIFUgbWF0cmljZXMgKExvd2VyIHRyaWFuZ3VsYXIsIERpYWdvbmFsIGFuZCBVcHBlciB0cmlhbmd1bGFyKSBieSBmYWN0b3JpemluZyB0aGUgaW5wdXQgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0Mn0gTCB0aGUgbG93ZXIgdHJpYW5ndWxhciBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBEIHRoZSBkaWFnb25hbCBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBVIHRoZSB1cHBlciB0cmlhbmd1bGFyIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJ9IGEgdGhlIGlucHV0IG1hdHJpeCB0byBmYWN0b3JpemVcbiAgICovXG5cbiAgZnVuY3Rpb24gTERVKEwsIEQsIFUsIGEpIHtcbiAgICBMWzJdID0gYVsyXSAvIGFbMF07XG4gICAgVVswXSA9IGFbMF07XG4gICAgVVsxXSA9IGFbMV07XG4gICAgVVszXSA9IGFbM10gLSBMWzJdICogVVsxXTtcbiAgICByZXR1cm4gW0wsIEQsIFVdO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byBtYXQyJ3NcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0Mn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge21hdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBhZGQob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSArIGJbM107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU3VidHJhY3RzIG1hdHJpeCBiIGZyb20gbWF0cml4IGFcbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0Mn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge21hdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzdWJ0cmFjdChvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdIC0gYlszXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaWNlcyBoYXZlIGV4YWN0bHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24gKHdoZW4gY29tcGFyZWQgd2l0aCA9PT0pXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0Mn0gYSBUaGUgZmlyc3QgbWF0cml4LlxuICAgKiBAcGFyYW0ge21hdDJ9IGIgVGhlIHNlY29uZCBtYXRyaXguXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXhhY3RFcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV0gJiYgYVsyXSA9PT0gYlsyXSAmJiBhWzNdID09PSBiWzNdO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaWNlcyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0Mn0gYSBUaGUgZmlyc3QgbWF0cml4LlxuICAgKiBAcGFyYW0ge21hdDJ9IGIgVGhlIHNlY29uZCBtYXRyaXguXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXF1YWxzJDEoYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM107XG4gICAgdmFyIGIwID0gYlswXSxcbiAgICAgICAgYjEgPSBiWzFdLFxuICAgICAgICBiMiA9IGJbMl0sXG4gICAgICAgIGIzID0gYlszXTtcbiAgICByZXR1cm4gTWF0aC5hYnMoYTAgLSBiMCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmIE1hdGguYWJzKGExIC0gYjEpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKSAmJiBNYXRoLmFicyhhMiAtIGIyKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMiksIE1hdGguYWJzKGIyKSkgJiYgTWF0aC5hYnMoYTMgLSBiMykgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTMpLCBNYXRoLmFicyhiMykpO1xuICB9XG4gIC8qKlxuICAgKiBNdWx0aXBseSBlYWNoIGVsZW1lbnQgb2YgdGhlIG1hdHJpeCBieSBhIHNjYWxhci5cbiAgICpcbiAgICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gc2NhbGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSBtYXRyaXgncyBlbGVtZW50cyBieVxuICAgKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5U2NhbGFyKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIG1hdDIncyBhZnRlciBtdWx0aXBseWluZyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge21hdDJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiJ3MgZWxlbWVudHMgYnkgYmVmb3JlIGFkZGluZ1xuICAgKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5U2NhbGFyQW5kQWRkKG91dCwgYSwgYiwgc2NhbGUpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl0gKiBzY2FsZTtcbiAgICBvdXRbM10gPSBhWzNdICsgYlszXSAqIHNjYWxlO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgbWF0Mi5tdWx0aXBseX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBtdWwgPSBtdWx0aXBseTtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgbWF0Mi5zdWJ0cmFjdH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzdWIgPSBzdWJ0cmFjdDtcblxuICB2YXIgbWF0MiA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICBjbG9uZTogY2xvbmUsXG4gICAgY29weTogY29weSxcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgZnJvbVZhbHVlczogZnJvbVZhbHVlcyxcbiAgICBzZXQ6IHNldCxcbiAgICB0cmFuc3Bvc2U6IHRyYW5zcG9zZSxcbiAgICBpbnZlcnQ6IGludmVydCxcbiAgICBhZGpvaW50OiBhZGpvaW50LFxuICAgIGRldGVybWluYW50OiBkZXRlcm1pbmFudCxcbiAgICBtdWx0aXBseTogbXVsdGlwbHksXG4gICAgcm90YXRlOiByb3RhdGUsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIGZyb21Sb3RhdGlvbjogZnJvbVJvdGF0aW9uLFxuICAgIGZyb21TY2FsaW5nOiBmcm9tU2NhbGluZyxcbiAgICBzdHI6IHN0cixcbiAgICBmcm9iOiBmcm9iLFxuICAgIExEVTogTERVLFxuICAgIGFkZDogYWRkLFxuICAgIHN1YnRyYWN0OiBzdWJ0cmFjdCxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMsXG4gICAgZXF1YWxzOiBlcXVhbHMkMSxcbiAgICBtdWx0aXBseVNjYWxhcjogbXVsdGlwbHlTY2FsYXIsXG4gICAgbXVsdGlwbHlTY2FsYXJBbmRBZGQ6IG11bHRpcGx5U2NhbGFyQW5kQWRkLFxuICAgIG11bDogbXVsLFxuICAgIHN1Yjogc3ViXG4gIH0pO1xuXG4gIC8qKlxuICAgKiAyeDMgTWF0cml4XG4gICAqIEBtb2R1bGUgbWF0MmRcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgbWF0MmQgY29udGFpbnMgc2l4IGVsZW1lbnRzIGRlZmluZWQgYXM6XG4gICAqIDxwcmU+XG4gICAqIFthLCBjLCB0eCxcbiAgICogIGIsIGQsIHR5XVxuICAgKiA8L3ByZT5cbiAgICogVGhpcyBpcyBhIHNob3J0IGZvcm0gZm9yIHRoZSAzeDMgbWF0cml4OlxuICAgKiA8cHJlPlxuICAgKiBbYSwgYywgdHgsXG4gICAqICBiLCBkLCB0eSxcbiAgICogIDAsIDAsIDFdXG4gICAqIDwvcHJlPlxuICAgKiBUaGUgbGFzdCByb3cgaXMgaWdub3JlZCBzbyB0aGUgYXJyYXkgaXMgc2hvcnRlciBhbmQgb3BlcmF0aW9ucyBhcmUgZmFzdGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBtYXQyZFxuICAgKlxuICAgKiBAcmV0dXJucyB7bWF0MmR9IGEgbmV3IDJ4MyBtYXRyaXhcbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlJDEoKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDYpO1xuXG4gICAgaWYgKEFSUkFZX1RZUEUgIT0gRmxvYXQzMkFycmF5KSB7XG4gICAgICBvdXRbMV0gPSAwO1xuICAgICAgb3V0WzJdID0gMDtcbiAgICAgIG91dFs0XSA9IDA7XG4gICAgICBvdXRbNV0gPSAwO1xuICAgIH1cblxuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzNdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG1hdDJkIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgbWF0cml4IHRvIGNsb25lXG4gICAqIEByZXR1cm5zIHttYXQyZH0gYSBuZXcgMngzIG1hdHJpeFxuICAgKi9cblxuICBmdW5jdGlvbiBjbG9uZSQxKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEFSUkFZX1RZUEUoNik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDJkIHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDJkfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY29weSQxKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldCBhIG1hdDJkIHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGlkZW50aXR5JDEob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG1hdDJkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYSBDb21wb25lbnQgQSAoaW5kZXggMClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGIgQ29tcG9uZW50IEIgKGluZGV4IDEpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjIENvbXBvbmVudCBDIChpbmRleCAyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gZCBDb21wb25lbnQgRCAoaW5kZXggMylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHR4IENvbXBvbmVudCBUWCAoaW5kZXggNClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHR5IENvbXBvbmVudCBUWSAoaW5kZXggNSlcbiAgICogQHJldHVybnMge21hdDJkfSBBIG5ldyBtYXQyZFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tVmFsdWVzJDEoYSwgYiwgYywgZCwgdHgsIHR5KSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDYpO1xuICAgIG91dFswXSA9IGE7XG4gICAgb3V0WzFdID0gYjtcbiAgICBvdXRbMl0gPSBjO1xuICAgIG91dFszXSA9IGQ7XG4gICAgb3V0WzRdID0gdHg7XG4gICAgb3V0WzVdID0gdHk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgbWF0MmQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGEgQ29tcG9uZW50IEEgKGluZGV4IDApXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiIENvbXBvbmVudCBCIChpbmRleCAxKVxuICAgKiBAcGFyYW0ge051bWJlcn0gYyBDb21wb25lbnQgQyAoaW5kZXggMilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGQgQ29tcG9uZW50IEQgKGluZGV4IDMpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0eCBDb21wb25lbnQgVFggKGluZGV4IDQpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0eSBDb21wb25lbnQgVFkgKGluZGV4IDUpXG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldCQxKG91dCwgYSwgYiwgYywgZCwgdHgsIHR5KSB7XG4gICAgb3V0WzBdID0gYTtcbiAgICBvdXRbMV0gPSBiO1xuICAgIG91dFsyXSA9IGM7XG4gICAgb3V0WzNdID0gZDtcbiAgICBvdXRbNF0gPSB0eDtcbiAgICBvdXRbNV0gPSB0eTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBJbnZlcnRzIGEgbWF0MmRcbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDJkfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJ0JDEob3V0LCBhKSB7XG4gICAgdmFyIGFhID0gYVswXSxcbiAgICAgICAgYWIgPSBhWzFdLFxuICAgICAgICBhYyA9IGFbMl0sXG4gICAgICAgIGFkID0gYVszXTtcbiAgICB2YXIgYXR4ID0gYVs0XSxcbiAgICAgICAgYXR5ID0gYVs1XTtcbiAgICB2YXIgZGV0ID0gYWEgKiBhZCAtIGFiICogYWM7XG5cbiAgICBpZiAoIWRldCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgIG91dFswXSA9IGFkICogZGV0O1xuICAgIG91dFsxXSA9IC1hYiAqIGRldDtcbiAgICBvdXRbMl0gPSAtYWMgKiBkZXQ7XG4gICAgb3V0WzNdID0gYWEgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGFjICogYXR5IC0gYWQgKiBhdHgpICogZGV0O1xuICAgIG91dFs1XSA9IChhYiAqIGF0eCAtIGFhICogYXR5KSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDJkXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICAgKi9cblxuICBmdW5jdGlvbiBkZXRlcm1pbmFudCQxKGEpIHtcbiAgICByZXR1cm4gYVswXSAqIGFbM10gLSBhWzFdICogYVsyXTtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbGllcyB0d28gbWF0MmQnc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyZH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge21hdDJkfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseSQxKG91dCwgYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM10sXG4gICAgICAgIGE0ID0gYVs0XSxcbiAgICAgICAgYTUgPSBhWzVdO1xuICAgIHZhciBiMCA9IGJbMF0sXG4gICAgICAgIGIxID0gYlsxXSxcbiAgICAgICAgYjIgPSBiWzJdLFxuICAgICAgICBiMyA9IGJbM10sXG4gICAgICAgIGI0ID0gYls0XSxcbiAgICAgICAgYjUgPSBiWzVdO1xuICAgIG91dFswXSA9IGEwICogYjAgKyBhMiAqIGIxO1xuICAgIG91dFsxXSA9IGExICogYjAgKyBhMyAqIGIxO1xuICAgIG91dFsyXSA9IGEwICogYjIgKyBhMiAqIGIzO1xuICAgIG91dFszXSA9IGExICogYjIgKyBhMyAqIGIzO1xuICAgIG91dFs0XSA9IGEwICogYjQgKyBhMiAqIGI1ICsgYTQ7XG4gICAgb3V0WzVdID0gYTEgKiBiNCArIGEzICogYjUgKyBhNTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0MmQgYnkgdGhlIGdpdmVuIGFuZ2xlXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZSQxKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXSxcbiAgICAgICAgYTQgPSBhWzRdLFxuICAgICAgICBhNSA9IGFbNV07XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBvdXRbMF0gPSBhMCAqIGMgKyBhMiAqIHM7XG4gICAgb3V0WzFdID0gYTEgKiBjICsgYTMgKiBzO1xuICAgIG91dFsyXSA9IGEwICogLXMgKyBhMiAqIGM7XG4gICAgb3V0WzNdID0gYTEgKiAtcyArIGEzICogYztcbiAgICBvdXRbNF0gPSBhNDtcbiAgICBvdXRbNV0gPSBhNTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTY2FsZXMgdGhlIG1hdDJkIGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMyXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gICAqIEBwYXJhbSB7dmVjMn0gdiB0aGUgdmVjMiB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqKi9cblxuICBmdW5jdGlvbiBzY2FsZSQxKG91dCwgYSwgdikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM10sXG4gICAgICAgIGE0ID0gYVs0XSxcbiAgICAgICAgYTUgPSBhWzVdO1xuICAgIHZhciB2MCA9IHZbMF0sXG4gICAgICAgIHYxID0gdlsxXTtcbiAgICBvdXRbMF0gPSBhMCAqIHYwO1xuICAgIG91dFsxXSA9IGExICogdjA7XG4gICAgb3V0WzJdID0gYTIgKiB2MTtcbiAgICBvdXRbM10gPSBhMyAqIHYxO1xuICAgIG91dFs0XSA9IGE0O1xuICAgIG91dFs1XSA9IGE1O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZXMgdGhlIG1hdDJkIGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMyXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gICAqIEBwYXJhbSB7dmVjMn0gdiB0aGUgdmVjMiB0byB0cmFuc2xhdGUgdGhlIG1hdHJpeCBieVxuICAgKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICAgKiovXG5cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKG91dCwgYSwgdikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM10sXG4gICAgICAgIGE0ID0gYVs0XSxcbiAgICAgICAgYTUgPSBhWzVdO1xuICAgIHZhciB2MCA9IHZbMF0sXG4gICAgICAgIHYxID0gdlsxXTtcbiAgICBvdXRbMF0gPSBhMDtcbiAgICBvdXRbMV0gPSBhMTtcbiAgICBvdXRbMl0gPSBhMjtcbiAgICBvdXRbM10gPSBhMztcbiAgICBvdXRbNF0gPSBhMCAqIHYwICsgYTIgKiB2MSArIGE0O1xuICAgIG91dFs1XSA9IGExICogdjAgKyBhMyAqIHYxICsgYTU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgZ2l2ZW4gYW5nbGVcbiAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAqXG4gICAqICAgICBtYXQyZC5pZGVudGl0eShkZXN0KTtcbiAgICogICAgIG1hdDJkLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDJkfSBvdXQgbWF0MmQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDJkfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uJDEob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGM7XG4gICAgb3V0WzFdID0gcztcbiAgICBvdXRbMl0gPSAtcztcbiAgICBvdXRbM10gPSBjO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3Igc2NhbGluZ1xuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDJkLmlkZW50aXR5KGRlc3QpO1xuICAgKiAgICAgbWF0MmQuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gb3V0IG1hdDJkIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7dmVjMn0gdiBTY2FsaW5nIHZlY3RvclxuICAgKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tU2NhbGluZyQxKG91dCwgdikge1xuICAgIG91dFswXSA9IHZbMF07XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IHZbMV07XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciB0cmFuc2xhdGlvblxuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDJkLmlkZW50aXR5KGRlc3QpO1xuICAgKiAgICAgbWF0MmQudHJhbnNsYXRlKGRlc3QsIGRlc3QsIHZlYyk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCBtYXQyZCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge3ZlYzJ9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21UcmFuc2xhdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIG91dFs0XSA9IHZbMF07XG4gICAgb3V0WzVdID0gdlsxXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0MmRcbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gYSBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN0ciQxKGEpIHtcbiAgICByZXR1cm4gJ21hdDJkKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJywgJyArIGFbNF0gKyAnLCAnICsgYVs1XSArICcpJztcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDJkXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgRnJvYmVuaXVzIG5vcm0gb2ZcbiAgICogQHJldHVybnMge051bWJlcn0gRnJvYmVuaXVzIG5vcm1cbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvYiQxKGEpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGFbMF0sIDIpICsgTWF0aC5wb3coYVsxXSwgMikgKyBNYXRoLnBvdyhhWzJdLCAyKSArIE1hdGgucG93KGFbM10sIDIpICsgTWF0aC5wb3coYVs0XSwgMikgKyBNYXRoLnBvdyhhWzVdLCAyKSArIDEpO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byBtYXQyZCdzXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0MmR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGFkZCQxKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gKyBiWzNdO1xuICAgIG91dFs0XSA9IGFbNF0gKyBiWzRdO1xuICAgIG91dFs1XSA9IGFbNV0gKyBiWzVdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyBtYXRyaXggYiBmcm9tIG1hdHJpeCBhXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0MmR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN1YnRyYWN0JDEob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAtIGJbM107XG4gICAgb3V0WzRdID0gYVs0XSAtIGJbNF07XG4gICAgb3V0WzVdID0gYVs1XSAtIGJbNV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gc2NhbGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSBtYXRyaXgncyBlbGVtZW50cyBieVxuICAgKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseVNjYWxhciQxKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIG91dFs0XSA9IGFbNF0gKiBiO1xuICAgIG91dFs1XSA9IGFbNV0gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIG1hdDJkJ3MgYWZ0ZXIgbXVsdGlwbHlpbmcgZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQyZH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIHRoZSBhbW91bnQgdG8gc2NhbGUgYidzIGVsZW1lbnRzIGJ5IGJlZm9yZSBhZGRpbmdcbiAgICogQHJldHVybnMge21hdDJkfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbXVsdGlwbHlTY2FsYXJBbmRBZGQkMShvdXQsIGEsIGIsIHNjYWxlKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF0gKiBzY2FsZTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXSAqIHNjYWxlO1xuICAgIG91dFsyXSA9IGFbMl0gKyBiWzJdICogc2NhbGU7XG4gICAgb3V0WzNdID0gYVszXSArIGJbM10gKiBzY2FsZTtcbiAgICBvdXRbNF0gPSBhWzRdICsgYls0XSAqIHNjYWxlO1xuICAgIG91dFs1XSA9IGFbNV0gKyBiWzVdICogc2NhbGU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbWF0cmljZXMgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICAgKlxuICAgKiBAcGFyYW0ge21hdDJkfSBhIFRoZSBmaXJzdCBtYXRyaXguXG4gICAqIEBwYXJhbSB7bWF0MmR9IGIgVGhlIHNlY29uZCBtYXRyaXguXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXhhY3RFcXVhbHMkMShhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXSAmJiBhWzJdID09PSBiWzJdICYmIGFbM10gPT09IGJbM10gJiYgYVs0XSA9PT0gYls0XSAmJiBhWzVdID09PSBiWzVdO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaWNlcyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0MmR9IGEgVGhlIGZpcnN0IG1hdHJpeC5cbiAgICogQHBhcmFtIHttYXQyZH0gYiBUaGUgc2Vjb25kIG1hdHJpeC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIG1hdHJpY2VzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBlcXVhbHMkMihhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXSxcbiAgICAgICAgYTQgPSBhWzRdLFxuICAgICAgICBhNSA9IGFbNV07XG4gICAgdmFyIGIwID0gYlswXSxcbiAgICAgICAgYjEgPSBiWzFdLFxuICAgICAgICBiMiA9IGJbMl0sXG4gICAgICAgIGIzID0gYlszXSxcbiAgICAgICAgYjQgPSBiWzRdLFxuICAgICAgICBiNSA9IGJbNV07XG4gICAgcmV0dXJuIE1hdGguYWJzKGEwIC0gYjApIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEwKSwgTWF0aC5hYnMoYjApKSAmJiBNYXRoLmFicyhhMSAtIGIxKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMSksIE1hdGguYWJzKGIxKSkgJiYgTWF0aC5hYnMoYTIgLSBiMikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpICYmIE1hdGguYWJzKGEzIC0gYjMpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEzKSwgTWF0aC5hYnMoYjMpKSAmJiBNYXRoLmFicyhhNCAtIGI0KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNCksIE1hdGguYWJzKGI0KSkgJiYgTWF0aC5hYnMoYTUgLSBiNSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTUpLCBNYXRoLmFicyhiNSkpO1xuICB9XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDJkLm11bHRpcGx5fVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIG11bCQxID0gbXVsdGlwbHkkMTtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgbWF0MmQuc3VidHJhY3R9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc3ViJDEgPSBzdWJ0cmFjdCQxO1xuXG4gIHZhciBtYXQyZCA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQxLFxuICAgIGNsb25lOiBjbG9uZSQxLFxuICAgIGNvcHk6IGNvcHkkMSxcbiAgICBpZGVudGl0eTogaWRlbnRpdHkkMSxcbiAgICBmcm9tVmFsdWVzOiBmcm9tVmFsdWVzJDEsXG4gICAgc2V0OiBzZXQkMSxcbiAgICBpbnZlcnQ6IGludmVydCQxLFxuICAgIGRldGVybWluYW50OiBkZXRlcm1pbmFudCQxLFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSQxLFxuICAgIHJvdGF0ZTogcm90YXRlJDEsXG4gICAgc2NhbGU6IHNjYWxlJDEsXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgZnJvbVJvdGF0aW9uOiBmcm9tUm90YXRpb24kMSxcbiAgICBmcm9tU2NhbGluZzogZnJvbVNjYWxpbmckMSxcbiAgICBmcm9tVHJhbnNsYXRpb246IGZyb21UcmFuc2xhdGlvbixcbiAgICBzdHI6IHN0ciQxLFxuICAgIGZyb2I6IGZyb2IkMSxcbiAgICBhZGQ6IGFkZCQxLFxuICAgIHN1YnRyYWN0OiBzdWJ0cmFjdCQxLFxuICAgIG11bHRpcGx5U2NhbGFyOiBtdWx0aXBseVNjYWxhciQxLFxuICAgIG11bHRpcGx5U2NhbGFyQW5kQWRkOiBtdWx0aXBseVNjYWxhckFuZEFkZCQxLFxuICAgIGV4YWN0RXF1YWxzOiBleGFjdEVxdWFscyQxLFxuICAgIGVxdWFsczogZXF1YWxzJDIsXG4gICAgbXVsOiBtdWwkMSxcbiAgICBzdWI6IHN1YiQxXG4gIH0pO1xuXG4gIC8qKlxuICAgKiAzeDMgTWF0cml4XG4gICAqIEBtb2R1bGUgbWF0M1xuICAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBtYXQzXG4gICAqXG4gICAqIEByZXR1cm5zIHttYXQzfSBhIG5ldyAzeDMgbWF0cml4XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZSQyKCkge1xuICAgIHZhciBvdXQgPSBuZXcgQVJSQVlfVFlQRSg5KTtcblxuICAgIGlmIChBUlJBWV9UWVBFICE9IEZsb2F0MzJBcnJheSkge1xuICAgICAgb3V0WzFdID0gMDtcbiAgICAgIG91dFsyXSA9IDA7XG4gICAgICBvdXRbM10gPSAwO1xuICAgICAgb3V0WzVdID0gMDtcbiAgICAgIG91dFs2XSA9IDA7XG4gICAgICBvdXRbN10gPSAwO1xuICAgIH1cblxuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzRdID0gMTtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENvcGllcyB0aGUgdXBwZXItbGVmdCAzeDMgdmFsdWVzIGludG8gdGhlIGdpdmVuIG1hdDMuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgM3gzIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgICB0aGUgc291cmNlIDR4NCBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tTWF0NChvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzRdO1xuICAgIG91dFs0XSA9IGFbNV07XG4gICAgb3V0WzVdID0gYVs2XTtcbiAgICBvdXRbNl0gPSBhWzhdO1xuICAgIG91dFs3XSA9IGFbOV07XG4gICAgb3V0WzhdID0gYVsxMF07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBtYXQzIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0M30gYSBtYXRyaXggdG8gY2xvbmVcbiAgICogQHJldHVybnMge21hdDN9IGEgbmV3IDN4MyBtYXRyaXhcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUkMihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDkpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQzIHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY29weSQyKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBtYXQzIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAwIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDAgcG9zaXRpb24gKGluZGV4IDApXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDEgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMiBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTEwIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDAgcG9zaXRpb24gKGluZGV4IDMpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTEgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggNClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMiBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAyIHBvc2l0aW9uIChpbmRleCA1KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTIwIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDAgcG9zaXRpb24gKGluZGV4IDYpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMjEgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggNylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0yMiBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCA4KVxuICAgKiBAcmV0dXJucyB7bWF0M30gQSBuZXcgbWF0M1xuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tVmFsdWVzJDIobTAwLCBtMDEsIG0wMiwgbTEwLCBtMTEsIG0xMiwgbTIwLCBtMjEsIG0yMikge1xuICAgIHZhciBvdXQgPSBuZXcgQVJSQVlfVFlQRSg5KTtcbiAgICBvdXRbMF0gPSBtMDA7XG4gICAgb3V0WzFdID0gbTAxO1xuICAgIG91dFsyXSA9IG0wMjtcbiAgICBvdXRbM10gPSBtMTA7XG4gICAgb3V0WzRdID0gbTExO1xuICAgIG91dFs1XSA9IG0xMjtcbiAgICBvdXRbNl0gPSBtMjA7XG4gICAgb3V0WzddID0gbTIxO1xuICAgIG91dFs4XSA9IG0yMjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBtYXQzIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMCBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAwKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAxIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDEgcG9zaXRpb24gKGluZGV4IDEpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDIgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMCBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAzKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTExIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDEgcG9zaXRpb24gKGluZGV4IDQpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTIgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggNSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0yMCBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA2KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTIxIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDEgcG9zaXRpb24gKGluZGV4IDcpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMjIgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggOClcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzZXQkMihvdXQsIG0wMCwgbTAxLCBtMDIsIG0xMCwgbTExLCBtMTIsIG0yMCwgbTIxLCBtMjIpIHtcbiAgICBvdXRbMF0gPSBtMDA7XG4gICAgb3V0WzFdID0gbTAxO1xuICAgIG91dFsyXSA9IG0wMjtcbiAgICBvdXRbM10gPSBtMTA7XG4gICAgb3V0WzRdID0gbTExO1xuICAgIG91dFs1XSA9IG0xMjtcbiAgICBvdXRbNl0gPSBtMjA7XG4gICAgb3V0WzddID0gbTIxO1xuICAgIG91dFs4XSA9IG0yMjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgYSBtYXQzIHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBpZGVudGl0eSQyKG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMTtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0M1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDN9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiB0cmFuc3Bvc2UkMShvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgdmFyIGEwMSA9IGFbMV0sXG4gICAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgICBhMTIgPSBhWzVdO1xuICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICBvdXRbM10gPSBhMDE7XG4gICAgICBvdXRbNV0gPSBhWzddO1xuICAgICAgb3V0WzZdID0gYTAyO1xuICAgICAgb3V0WzddID0gYTEyO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICBvdXRbM10gPSBhWzFdO1xuICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICBvdXRbNl0gPSBhWzJdO1xuICAgICAgb3V0WzddID0gYVs1XTtcbiAgICAgIG91dFs4XSA9IGFbOF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogSW52ZXJ0cyBhIG1hdDNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJ0JDIob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sXG4gICAgICAgIGEwMSA9IGFbMV0sXG4gICAgICAgIGEwMiA9IGFbMl07XG4gICAgdmFyIGExMCA9IGFbM10sXG4gICAgICAgIGExMSA9IGFbNF0sXG4gICAgICAgIGExMiA9IGFbNV07XG4gICAgdmFyIGEyMCA9IGFbNl0sXG4gICAgICAgIGEyMSA9IGFbN10sXG4gICAgICAgIGEyMiA9IGFbOF07XG4gICAgdmFyIGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMTtcbiAgICB2YXIgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcbiAgICB2YXIgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwOyAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG5cbiAgICB2YXIgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xuXG4gICAgaWYgKCFkZXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRldCA9IDEuMCAvIGRldDtcbiAgICBvdXRbMF0gPSBiMDEgKiBkZXQ7XG4gICAgb3V0WzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xuICAgIG91dFsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xuICAgIG91dFszXSA9IGIxMSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcbiAgICBvdXRbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XG4gICAgb3V0WzZdID0gYjIxICogZGV0O1xuICAgIG91dFs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gYWRqb2ludCQxKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdO1xuICAgIHZhciBhMTAgPSBhWzNdLFxuICAgICAgICBhMTEgPSBhWzRdLFxuICAgICAgICBhMTIgPSBhWzVdO1xuICAgIHZhciBhMjAgPSBhWzZdLFxuICAgICAgICBhMjEgPSBhWzddLFxuICAgICAgICBhMjIgPSBhWzhdO1xuICAgIG91dFswXSA9IGExMSAqIGEyMiAtIGExMiAqIGEyMTtcbiAgICBvdXRbMV0gPSBhMDIgKiBhMjEgLSBhMDEgKiBhMjI7XG4gICAgb3V0WzJdID0gYTAxICogYTEyIC0gYTAyICogYTExO1xuICAgIG91dFszXSA9IGExMiAqIGEyMCAtIGExMCAqIGEyMjtcbiAgICBvdXRbNF0gPSBhMDAgKiBhMjIgLSBhMDIgKiBhMjA7XG4gICAgb3V0WzVdID0gYTAyICogYTEwIC0gYTAwICogYTEyO1xuICAgIG91dFs2XSA9IGExMCAqIGEyMSAtIGExMSAqIGEyMDtcbiAgICBvdXRbN10gPSBhMDEgKiBhMjAgLSBhMDAgKiBhMjE7XG4gICAgb3V0WzhdID0gYTAwICogYTExIC0gYTAxICogYTEwO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0M1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICAgKi9cblxuICBmdW5jdGlvbiBkZXRlcm1pbmFudCQyKGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXTtcbiAgICB2YXIgYTEwID0gYVszXSxcbiAgICAgICAgYTExID0gYVs0XSxcbiAgICAgICAgYTEyID0gYVs1XTtcbiAgICB2YXIgYTIwID0gYVs2XSxcbiAgICAgICAgYTIxID0gYVs3XSxcbiAgICAgICAgYTIyID0gYVs4XTtcbiAgICByZXR1cm4gYTAwICogKGEyMiAqIGExMSAtIGExMiAqIGEyMSkgKyBhMDEgKiAoLWEyMiAqIGExMCArIGExMiAqIGEyMCkgKyBhMDIgKiAoYTIxICogYTEwIC0gYTExICogYTIwKTtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbGllcyB0d28gbWF0MydzXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0M30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge21hdDN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbXVsdGlwbHkkMihvdXQsIGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXTtcbiAgICB2YXIgYTEwID0gYVszXSxcbiAgICAgICAgYTExID0gYVs0XSxcbiAgICAgICAgYTEyID0gYVs1XTtcbiAgICB2YXIgYTIwID0gYVs2XSxcbiAgICAgICAgYTIxID0gYVs3XSxcbiAgICAgICAgYTIyID0gYVs4XTtcbiAgICB2YXIgYjAwID0gYlswXSxcbiAgICAgICAgYjAxID0gYlsxXSxcbiAgICAgICAgYjAyID0gYlsyXTtcbiAgICB2YXIgYjEwID0gYlszXSxcbiAgICAgICAgYjExID0gYls0XSxcbiAgICAgICAgYjEyID0gYls1XTtcbiAgICB2YXIgYjIwID0gYls2XSxcbiAgICAgICAgYjIxID0gYls3XSxcbiAgICAgICAgYjIyID0gYls4XTtcbiAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XG4gICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xuICAgIG91dFsyXSA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcbiAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XG4gICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xuICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcbiAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XG4gICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xuICAgIG91dFs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgYSBtYXQzIGJ5IHRoZSBnaXZlbiB2ZWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gICAqIEBwYXJhbSB7dmVjMn0gdiB2ZWN0b3IgdG8gdHJhbnNsYXRlIGJ5XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhbnNsYXRlJDEob3V0LCBhLCB2KSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sXG4gICAgICAgIGEwMSA9IGFbMV0sXG4gICAgICAgIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sXG4gICAgICAgIGExMSA9IGFbNF0sXG4gICAgICAgIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sXG4gICAgICAgIGEyMSA9IGFbN10sXG4gICAgICAgIGEyMiA9IGFbOF0sXG4gICAgICAgIHggPSB2WzBdLFxuICAgICAgICB5ID0gdlsxXTtcbiAgICBvdXRbMF0gPSBhMDA7XG4gICAgb3V0WzFdID0gYTAxO1xuICAgIG91dFsyXSA9IGEwMjtcbiAgICBvdXRbM10gPSBhMTA7XG4gICAgb3V0WzRdID0gYTExO1xuICAgIG91dFs1XSA9IGExMjtcbiAgICBvdXRbNl0gPSB4ICogYTAwICsgeSAqIGExMCArIGEyMDtcbiAgICBvdXRbN10gPSB4ICogYTAxICsgeSAqIGExMSArIGEyMTtcbiAgICBvdXRbOF0gPSB4ICogYTAyICsgeSAqIGExMiArIGEyMjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0MyBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcm90YXRlJDIob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSxcbiAgICAgICAgYTExID0gYVs0XSxcbiAgICAgICAgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSxcbiAgICAgICAgYTIxID0gYVs3XSxcbiAgICAgICAgYTIyID0gYVs4XSxcbiAgICAgICAgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGMgKiBhMDAgKyBzICogYTEwO1xuICAgIG91dFsxXSA9IGMgKiBhMDEgKyBzICogYTExO1xuICAgIG91dFsyXSA9IGMgKiBhMDIgKyBzICogYTEyO1xuICAgIG91dFszXSA9IGMgKiBhMTAgLSBzICogYTAwO1xuICAgIG91dFs0XSA9IGMgKiBhMTEgLSBzICogYTAxO1xuICAgIG91dFs1XSA9IGMgKiBhMTIgLSBzICogYTAyO1xuICAgIG91dFs2XSA9IGEyMDtcbiAgICBvdXRbN10gPSBhMjE7XG4gICAgb3V0WzhdID0gYTIyO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNjYWxlcyB0aGUgbWF0MyBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAgICogQHBhcmFtIHt2ZWMyfSB2IHRoZSB2ZWMyIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKiovXG5cbiAgZnVuY3Rpb24gc2NhbGUkMihvdXQsIGEsIHYpIHtcbiAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgIHkgPSB2WzFdO1xuICAgIG91dFswXSA9IHggKiBhWzBdO1xuICAgIG91dFsxXSA9IHggKiBhWzFdO1xuICAgIG91dFsyXSA9IHggKiBhWzJdO1xuICAgIG91dFszXSA9IHkgKiBhWzNdO1xuICAgIG91dFs0XSA9IHkgKiBhWzRdO1xuICAgIG91dFs1XSA9IHkgKiBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciB0cmFuc2xhdGlvblxuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDMuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQzLnRyYW5zbGF0ZShkZXN0LCBkZXN0LCB2ZWMpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCBtYXQzIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7dmVjMn0gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tVHJhbnNsYXRpb24kMShvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDE7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSB2WzBdO1xuICAgIG91dFs3XSA9IHZbMV07XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZVxuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDMuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQzLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCBtYXQzIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uJDIob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGM7XG4gICAgb3V0WzFdID0gcztcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IC1zO1xuICAgIG91dFs0XSA9IGM7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3Igc2NhbGluZ1xuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDMuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQzLnNjYWxlKGRlc3QsIGRlc3QsIHZlYyk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHt2ZWMyfSB2IFNjYWxpbmcgdmVjdG9yXG4gICAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVNjYWxpbmckMihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSB2WzBdO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHZbMV07XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDb3BpZXMgdGhlIHZhbHVlcyBmcm9tIGEgbWF0MmQgaW50byBhIG1hdDNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQyZH0gYSB0aGUgbWF0cml4IHRvIGNvcHlcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKiovXG5cbiAgZnVuY3Rpb24gZnJvbU1hdDJkKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IGFbMl07XG4gICAgb3V0WzRdID0gYVszXTtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IGFbNF07XG4gICAgb3V0WzddID0gYVs1XTtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICogQ2FsY3VsYXRlcyBhIDN4MyBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gcXVhdGVybmlvblxuICAqXG4gICogQHBhcmFtIHttYXQzfSBvdXQgbWF0MyByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAqIEBwYXJhbSB7cXVhdH0gcSBRdWF0ZXJuaW9uIHRvIGNyZWF0ZSBtYXRyaXggZnJvbVxuICAqXG4gICogQHJldHVybnMge21hdDN9IG91dFxuICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21RdWF0KG91dCwgcSkge1xuICAgIHZhciB4ID0gcVswXSxcbiAgICAgICAgeSA9IHFbMV0sXG4gICAgICAgIHogPSBxWzJdLFxuICAgICAgICB3ID0gcVszXTtcbiAgICB2YXIgeDIgPSB4ICsgeDtcbiAgICB2YXIgeTIgPSB5ICsgeTtcbiAgICB2YXIgejIgPSB6ICsgejtcbiAgICB2YXIgeHggPSB4ICogeDI7XG4gICAgdmFyIHl4ID0geSAqIHgyO1xuICAgIHZhciB5eSA9IHkgKiB5MjtcbiAgICB2YXIgenggPSB6ICogeDI7XG4gICAgdmFyIHp5ID0geiAqIHkyO1xuICAgIHZhciB6eiA9IHogKiB6MjtcbiAgICB2YXIgd3ggPSB3ICogeDI7XG4gICAgdmFyIHd5ID0gdyAqIHkyO1xuICAgIHZhciB3eiA9IHcgKiB6MjtcbiAgICBvdXRbMF0gPSAxIC0geXkgLSB6ejtcbiAgICBvdXRbM10gPSB5eCAtIHd6O1xuICAgIG91dFs2XSA9IHp4ICsgd3k7XG4gICAgb3V0WzFdID0geXggKyB3ejtcbiAgICBvdXRbNF0gPSAxIC0geHggLSB6ejtcbiAgICBvdXRbN10gPSB6eSAtIHd4O1xuICAgIG91dFsyXSA9IHp4IC0gd3k7XG4gICAgb3V0WzVdID0genkgKyB3eDtcbiAgICBvdXRbOF0gPSAxIC0geHggLSB5eTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAqIENhbGN1bGF0ZXMgYSAzeDMgbm9ybWFsIG1hdHJpeCAodHJhbnNwb3NlIGludmVyc2UpIGZyb20gdGhlIDR4NCBtYXRyaXhcbiAgKlxuICAqIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgKiBAcGFyYW0ge21hdDR9IGEgTWF0NCB0byBkZXJpdmUgdGhlIG5vcm1hbCBtYXRyaXggZnJvbVxuICAqXG4gICogQHJldHVybnMge21hdDN9IG91dFxuICAqL1xuXG4gIGZ1bmN0aW9uIG5vcm1hbEZyb21NYXQ0KG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdO1xuICAgIHZhciBhMTAgPSBhWzRdLFxuICAgICAgICBhMTEgPSBhWzVdLFxuICAgICAgICBhMTIgPSBhWzZdLFxuICAgICAgICBhMTMgPSBhWzddO1xuICAgIHZhciBhMjAgPSBhWzhdLFxuICAgICAgICBhMjEgPSBhWzldLFxuICAgICAgICBhMjIgPSBhWzEwXSxcbiAgICAgICAgYTIzID0gYVsxMV07XG4gICAgdmFyIGEzMCA9IGFbMTJdLFxuICAgICAgICBhMzEgPSBhWzEzXSxcbiAgICAgICAgYTMyID0gYVsxNF0sXG4gICAgICAgIGEzMyA9IGFbMTVdO1xuICAgIHZhciBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTA7XG4gICAgdmFyIGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMDtcbiAgICB2YXIgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwO1xuICAgIHZhciBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTE7XG4gICAgdmFyIGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMTtcbiAgICB2YXIgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyO1xuICAgIHZhciBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzA7XG4gICAgdmFyIGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMDtcbiAgICB2YXIgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwO1xuICAgIHZhciBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzE7XG4gICAgdmFyIGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMTtcbiAgICB2YXIgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyOyAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG5cbiAgICB2YXIgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgaWYgKCFkZXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRldCA9IDEuMCAvIGRldDtcbiAgICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMV0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcbiAgICBvdXRbMl0gPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldDtcbiAgICBvdXRbM10gPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3KSAqIGRldDtcbiAgICBvdXRbNV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcbiAgICBvdXRbNl0gPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldDtcbiAgICBvdXRbN10gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSAyRCBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgbWF0MyBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggV2lkdGggb2YgeW91ciBnbCBjb250ZXh0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgSGVpZ2h0IG9mIGdsIGNvbnRleHRcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBwcm9qZWN0aW9uKG91dCwgd2lkdGgsIGhlaWdodCkge1xuICAgIG91dFswXSA9IDIgLyB3aWR0aDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAtMiAvIGhlaWdodDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IC0xO1xuICAgIG91dFs3XSA9IDE7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0M1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IGEgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICAgKi9cblxuICBmdW5jdGlvbiBzdHIkMihhKSB7XG4gICAgcmV0dXJuICdtYXQzKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJywgJyArIGFbNF0gKyAnLCAnICsgYVs1XSArICcsICcgKyBhWzZdICsgJywgJyArIGFbN10gKyAnLCAnICsgYVs4XSArICcpJztcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDNcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IEZyb2Jlbml1cyBub3JtXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb2IkMihhKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhhWzBdLCAyKSArIE1hdGgucG93KGFbMV0sIDIpICsgTWF0aC5wb3coYVsyXSwgMikgKyBNYXRoLnBvdyhhWzNdLCAyKSArIE1hdGgucG93KGFbNF0sIDIpICsgTWF0aC5wb3coYVs1XSwgMikgKyBNYXRoLnBvdyhhWzZdLCAyKSArIE1hdGgucG93KGFbN10sIDIpICsgTWF0aC5wb3coYVs4XSwgMikpO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byBtYXQzJ3NcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0M30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBhZGQkMihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdICsgYlszXTtcbiAgICBvdXRbNF0gPSBhWzRdICsgYls0XTtcbiAgICBvdXRbNV0gPSBhWzVdICsgYls1XTtcbiAgICBvdXRbNl0gPSBhWzZdICsgYls2XTtcbiAgICBvdXRbN10gPSBhWzddICsgYls3XTtcbiAgICBvdXRbOF0gPSBhWzhdICsgYls4XTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgbWF0cml4IGIgZnJvbSBtYXRyaXggYVxuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN1YnRyYWN0JDIob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAtIGJbM107XG4gICAgb3V0WzRdID0gYVs0XSAtIGJbNF07XG4gICAgb3V0WzVdID0gYVs1XSAtIGJbNV07XG4gICAgb3V0WzZdID0gYVs2XSAtIGJbNl07XG4gICAgb3V0WzddID0gYVs3XSAtIGJbN107XG4gICAgb3V0WzhdID0gYVs4XSAtIGJbOF07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0M30gYSB0aGUgbWF0cml4IHRvIHNjYWxlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgbWF0cml4J3MgZWxlbWVudHMgYnlcbiAgICogQHJldHVybnMge21hdDN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseVNjYWxhciQyKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIG91dFs0XSA9IGFbNF0gKiBiO1xuICAgIG91dFs1XSA9IGFbNV0gKiBiO1xuICAgIG91dFs2XSA9IGFbNl0gKiBiO1xuICAgIG91dFs3XSA9IGFbN10gKiBiO1xuICAgIG91dFs4XSA9IGFbOF0gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIG1hdDMncyBhZnRlciBtdWx0aXBseWluZyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge21hdDN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiJ3MgZWxlbWVudHMgYnkgYmVmb3JlIGFkZGluZ1xuICAgKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5U2NhbGFyQW5kQWRkJDIob3V0LCBhLCBiLCBzY2FsZSkge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdICogc2NhbGU7XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV0gKiBzY2FsZTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXSAqIHNjYWxlO1xuICAgIG91dFszXSA9IGFbM10gKyBiWzNdICogc2NhbGU7XG4gICAgb3V0WzRdID0gYVs0XSArIGJbNF0gKiBzY2FsZTtcbiAgICBvdXRbNV0gPSBhWzVdICsgYls1XSAqIHNjYWxlO1xuICAgIG91dFs2XSA9IGFbNl0gKyBiWzZdICogc2NhbGU7XG4gICAgb3V0WzddID0gYVs3XSArIGJbN10gKiBzY2FsZTtcbiAgICBvdXRbOF0gPSBhWzhdICsgYls4XSAqIHNjYWxlO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG1hdHJpY2VzIGhhdmUgZXhhY3RseSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBwb3NpdGlvbiAod2hlbiBjb21wYXJlZCB3aXRoID09PSlcbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBhIFRoZSBmaXJzdCBtYXRyaXguXG4gICAqIEBwYXJhbSB7bWF0M30gYiBUaGUgc2Vjb25kIG1hdHJpeC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIG1hdHJpY2VzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBleGFjdEVxdWFscyQyKGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdICYmIGFbMl0gPT09IGJbMl0gJiYgYVszXSA9PT0gYlszXSAmJiBhWzRdID09PSBiWzRdICYmIGFbNV0gPT09IGJbNV0gJiYgYVs2XSA9PT0gYls2XSAmJiBhWzddID09PSBiWzddICYmIGFbOF0gPT09IGJbOF07XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG1hdHJpY2VzIGhhdmUgYXBwcm94aW1hdGVseSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBwb3NpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHttYXQzfSBhIFRoZSBmaXJzdCBtYXRyaXguXG4gICAqIEBwYXJhbSB7bWF0M30gYiBUaGUgc2Vjb25kIG1hdHJpeC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIG1hdHJpY2VzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBlcXVhbHMkMyhhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXSxcbiAgICAgICAgYTQgPSBhWzRdLFxuICAgICAgICBhNSA9IGFbNV0sXG4gICAgICAgIGE2ID0gYVs2XSxcbiAgICAgICAgYTcgPSBhWzddLFxuICAgICAgICBhOCA9IGFbOF07XG4gICAgdmFyIGIwID0gYlswXSxcbiAgICAgICAgYjEgPSBiWzFdLFxuICAgICAgICBiMiA9IGJbMl0sXG4gICAgICAgIGIzID0gYlszXSxcbiAgICAgICAgYjQgPSBiWzRdLFxuICAgICAgICBiNSA9IGJbNV0sXG4gICAgICAgIGI2ID0gYls2XSxcbiAgICAgICAgYjcgPSBiWzddLFxuICAgICAgICBiOCA9IGJbOF07XG4gICAgcmV0dXJuIE1hdGguYWJzKGEwIC0gYjApIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEwKSwgTWF0aC5hYnMoYjApKSAmJiBNYXRoLmFicyhhMSAtIGIxKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMSksIE1hdGguYWJzKGIxKSkgJiYgTWF0aC5hYnMoYTIgLSBiMikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpICYmIE1hdGguYWJzKGEzIC0gYjMpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEzKSwgTWF0aC5hYnMoYjMpKSAmJiBNYXRoLmFicyhhNCAtIGI0KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNCksIE1hdGguYWJzKGI0KSkgJiYgTWF0aC5hYnMoYTUgLSBiNSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTUpLCBNYXRoLmFicyhiNSkpICYmIE1hdGguYWJzKGE2IC0gYjYpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE2KSwgTWF0aC5hYnMoYjYpKSAmJiBNYXRoLmFicyhhNyAtIGI3KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNyksIE1hdGguYWJzKGI3KSkgJiYgTWF0aC5hYnMoYTggLSBiOCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTgpLCBNYXRoLmFicyhiOCkpO1xuICB9XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDMubXVsdGlwbHl9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbXVsJDIgPSBtdWx0aXBseSQyO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayBtYXQzLnN1YnRyYWN0fVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHN1YiQyID0gc3VidHJhY3QkMjtcblxuICB2YXIgbWF0MyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQyLFxuICAgIGZyb21NYXQ0OiBmcm9tTWF0NCxcbiAgICBjbG9uZTogY2xvbmUkMixcbiAgICBjb3B5OiBjb3B5JDIsXG4gICAgZnJvbVZhbHVlczogZnJvbVZhbHVlcyQyLFxuICAgIHNldDogc2V0JDIsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5JDIsXG4gICAgdHJhbnNwb3NlOiB0cmFuc3Bvc2UkMSxcbiAgICBpbnZlcnQ6IGludmVydCQyLFxuICAgIGFkam9pbnQ6IGFkam9pbnQkMSxcbiAgICBkZXRlcm1pbmFudDogZGV0ZXJtaW5hbnQkMixcbiAgICBtdWx0aXBseTogbXVsdGlwbHkkMixcbiAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSQxLFxuICAgIHJvdGF0ZTogcm90YXRlJDIsXG4gICAgc2NhbGU6IHNjYWxlJDIsXG4gICAgZnJvbVRyYW5zbGF0aW9uOiBmcm9tVHJhbnNsYXRpb24kMSxcbiAgICBmcm9tUm90YXRpb246IGZyb21Sb3RhdGlvbiQyLFxuICAgIGZyb21TY2FsaW5nOiBmcm9tU2NhbGluZyQyLFxuICAgIGZyb21NYXQyZDogZnJvbU1hdDJkLFxuICAgIGZyb21RdWF0OiBmcm9tUXVhdCxcbiAgICBub3JtYWxGcm9tTWF0NDogbm9ybWFsRnJvbU1hdDQsXG4gICAgcHJvamVjdGlvbjogcHJvamVjdGlvbixcbiAgICBzdHI6IHN0ciQyLFxuICAgIGZyb2I6IGZyb2IkMixcbiAgICBhZGQ6IGFkZCQyLFxuICAgIHN1YnRyYWN0OiBzdWJ0cmFjdCQyLFxuICAgIG11bHRpcGx5U2NhbGFyOiBtdWx0aXBseVNjYWxhciQyLFxuICAgIG11bHRpcGx5U2NhbGFyQW5kQWRkOiBtdWx0aXBseVNjYWxhckFuZEFkZCQyLFxuICAgIGV4YWN0RXF1YWxzOiBleGFjdEVxdWFscyQyLFxuICAgIGVxdWFsczogZXF1YWxzJDMsXG4gICAgbXVsOiBtdWwkMixcbiAgICBzdWI6IHN1YiQyXG4gIH0pO1xuXG4gIC8qKlxuICAgKiA0eDQgTWF0cml4PGJyPkZvcm1hdDogY29sdW1uLW1ham9yLCB3aGVuIHR5cGVkIG91dCBpdCBsb29rcyBsaWtlIHJvdy1tYWpvcjxicj5UaGUgbWF0cmljZXMgYXJlIGJlaW5nIHBvc3QgbXVsdGlwbGllZC5cbiAgICogQG1vZHVsZSBtYXQ0XG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IG1hdDRcbiAgICpcbiAgICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlJDMoKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDE2KTtcblxuICAgIGlmIChBUlJBWV9UWVBFICE9IEZsb2F0MzJBcnJheSkge1xuICAgICAgb3V0WzFdID0gMDtcbiAgICAgIG91dFsyXSA9IDA7XG4gICAgICBvdXRbM10gPSAwO1xuICAgICAgb3V0WzRdID0gMDtcbiAgICAgIG91dFs2XSA9IDA7XG4gICAgICBvdXRbN10gPSAwO1xuICAgICAgb3V0WzhdID0gMDtcbiAgICAgIG91dFs5XSA9IDA7XG4gICAgICBvdXRbMTFdID0gMDtcbiAgICAgIG91dFsxMl0gPSAwO1xuICAgICAgb3V0WzEzXSA9IDA7XG4gICAgICBvdXRbMTRdID0gMDtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBtYXQ0IGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gYSBtYXRyaXggdG8gY2xvbmVcbiAgICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUkMyhhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDE2KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICBvdXRbOV0gPSBhWzldO1xuICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICBvdXRbMTFdID0gYVsxMV07XG4gICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQ0IHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY29weSQzKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIG91dFs5XSA9IGFbOV07XG4gICAgb3V0WzEwXSA9IGFbMTBdO1xuICAgIG91dFsxMV0gPSBhWzExXTtcbiAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IG1hdDQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDAgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAyIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDIgcG9zaXRpb24gKGluZGV4IDIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDMgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMCBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA0KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTExIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDEgcG9zaXRpb24gKGluZGV4IDUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTIgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggNilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMyBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAzIHBvc2l0aW9uIChpbmRleCA3KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTIwIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDAgcG9zaXRpb24gKGluZGV4IDgpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMjEgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggOSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0yMiBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxMClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0yMyBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxMSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0zMCBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAxMilcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0zMSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxMylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0zMiBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxNClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0zMyBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxNSlcbiAgICogQHJldHVybnMge21hdDR9IEEgbmV3IG1hdDRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVZhbHVlcyQzKG0wMCwgbTAxLCBtMDIsIG0wMywgbTEwLCBtMTEsIG0xMiwgbTEzLCBtMjAsIG0yMSwgbTIyLCBtMjMsIG0zMCwgbTMxLCBtMzIsIG0zMykge1xuICAgIHZhciBvdXQgPSBuZXcgQVJSQVlfVFlQRSgxNik7XG4gICAgb3V0WzBdID0gbTAwO1xuICAgIG91dFsxXSA9IG0wMTtcbiAgICBvdXRbMl0gPSBtMDI7XG4gICAgb3V0WzNdID0gbTAzO1xuICAgIG91dFs0XSA9IG0xMDtcbiAgICBvdXRbNV0gPSBtMTE7XG4gICAgb3V0WzZdID0gbTEyO1xuICAgIG91dFs3XSA9IG0xMztcbiAgICBvdXRbOF0gPSBtMjA7XG4gICAgb3V0WzldID0gbTIxO1xuICAgIG91dFsxMF0gPSBtMjI7XG4gICAgb3V0WzExXSA9IG0yMztcbiAgICBvdXRbMTJdID0gbTMwO1xuICAgIG91dFsxM10gPSBtMzE7XG4gICAgb3V0WzE0XSA9IG0zMjtcbiAgICBvdXRbMTVdID0gbTMzO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIG1hdDQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAwIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDAgcG9zaXRpb24gKGluZGV4IDApXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMDEgQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMSlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMiBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTAzIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDMgcG9zaXRpb24gKGluZGV4IDMpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTAgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggNClcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0xMSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA1KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTEyIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDIgcG9zaXRpb24gKGluZGV4IDYpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMTMgQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggNylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG0yMCBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA4KVxuICAgKiBAcGFyYW0ge051bWJlcn0gbTIxIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDEgcG9zaXRpb24gKGluZGV4IDkpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMjIgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTApXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMjMgQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTEpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMzAgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMTIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMzEgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMTMpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMzIgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTQpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtMzMgQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTUpXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0JDMob3V0LCBtMDAsIG0wMSwgbTAyLCBtMDMsIG0xMCwgbTExLCBtMTIsIG0xMywgbTIwLCBtMjEsIG0yMiwgbTIzLCBtMzAsIG0zMSwgbTMyLCBtMzMpIHtcbiAgICBvdXRbMF0gPSBtMDA7XG4gICAgb3V0WzFdID0gbTAxO1xuICAgIG91dFsyXSA9IG0wMjtcbiAgICBvdXRbM10gPSBtMDM7XG4gICAgb3V0WzRdID0gbTEwO1xuICAgIG91dFs1XSA9IG0xMTtcbiAgICBvdXRbNl0gPSBtMTI7XG4gICAgb3V0WzddID0gbTEzO1xuICAgIG91dFs4XSA9IG0yMDtcbiAgICBvdXRbOV0gPSBtMjE7XG4gICAgb3V0WzEwXSA9IG0yMjtcbiAgICBvdXRbMTFdID0gbTIzO1xuICAgIG91dFsxMl0gPSBtMzA7XG4gICAgb3V0WzEzXSA9IG0zMTtcbiAgICBvdXRbMTRdID0gbTMyO1xuICAgIG91dFsxNV0gPSBtMzM7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU2V0IGEgbWF0NCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkkMyhvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAxO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0NFxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiB0cmFuc3Bvc2UkMihvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgdmFyIGEwMSA9IGFbMV0sXG4gICAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgICBhMDMgPSBhWzNdO1xuICAgICAgdmFyIGExMiA9IGFbNl0sXG4gICAgICAgICAgYTEzID0gYVs3XTtcbiAgICAgIHZhciBhMjMgPSBhWzExXTtcbiAgICAgIG91dFsxXSA9IGFbNF07XG4gICAgICBvdXRbMl0gPSBhWzhdO1xuICAgICAgb3V0WzNdID0gYVsxMl07XG4gICAgICBvdXRbNF0gPSBhMDE7XG4gICAgICBvdXRbNl0gPSBhWzldO1xuICAgICAgb3V0WzddID0gYVsxM107XG4gICAgICBvdXRbOF0gPSBhMDI7XG4gICAgICBvdXRbOV0gPSBhMTI7XG4gICAgICBvdXRbMTFdID0gYVsxNF07XG4gICAgICBvdXRbMTJdID0gYTAzO1xuICAgICAgb3V0WzEzXSA9IGExMztcbiAgICAgIG91dFsxNF0gPSBhMjM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICBvdXRbMV0gPSBhWzRdO1xuICAgICAgb3V0WzJdID0gYVs4XTtcbiAgICAgIG91dFszXSA9IGFbMTJdO1xuICAgICAgb3V0WzRdID0gYVsxXTtcbiAgICAgIG91dFs1XSA9IGFbNV07XG4gICAgICBvdXRbNl0gPSBhWzldO1xuICAgICAgb3V0WzddID0gYVsxM107XG4gICAgICBvdXRbOF0gPSBhWzJdO1xuICAgICAgb3V0WzldID0gYVs2XTtcbiAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgIG91dFsxMV0gPSBhWzE0XTtcbiAgICAgIG91dFsxMl0gPSBhWzNdO1xuICAgICAgb3V0WzEzXSA9IGFbN107XG4gICAgICBvdXRbMTRdID0gYVsxMV07XG4gICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogSW52ZXJ0cyBhIG1hdDRcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJ0JDMob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sXG4gICAgICAgIGEwMSA9IGFbMV0sXG4gICAgICAgIGEwMiA9IGFbMl0sXG4gICAgICAgIGEwMyA9IGFbM107XG4gICAgdmFyIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN107XG4gICAgdmFyIGEyMCA9IGFbOF0sXG4gICAgICAgIGEyMSA9IGFbOV0sXG4gICAgICAgIGEyMiA9IGFbMTBdLFxuICAgICAgICBhMjMgPSBhWzExXTtcbiAgICB2YXIgYTMwID0gYVsxMl0sXG4gICAgICAgIGEzMSA9IGFbMTNdLFxuICAgICAgICBhMzIgPSBhWzE0XSxcbiAgICAgICAgYTMzID0gYVsxNV07XG4gICAgdmFyIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcbiAgICB2YXIgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xuICAgIHZhciBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTA7XG4gICAgdmFyIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcbiAgICB2YXIgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xuICAgIHZhciBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTI7XG4gICAgdmFyIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcbiAgICB2YXIgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xuICAgIHZhciBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzA7XG4gICAgdmFyIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcbiAgICB2YXIgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xuICAgIHZhciBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7IC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcblxuICAgIHZhciBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICBpZiAoIWRldCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgIG91dFswXSA9IChhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDkpICogZGV0O1xuICAgIG91dFsxXSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xuICAgIG91dFsyXSA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xuICAgIG91dFszXSA9IChhMjIgKiBiMDQgLSBhMjEgKiBiMDUgLSBhMjMgKiBiMDMpICogZGV0O1xuICAgIG91dFs0XSA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xuICAgIG91dFs1XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xuICAgIG91dFs2XSA9IChhMzIgKiBiMDIgLSBhMzAgKiBiMDUgLSBhMzMgKiBiMDEpICogZGV0O1xuICAgIG91dFs3XSA9IChhMjAgKiBiMDUgLSBhMjIgKiBiMDIgKyBhMjMgKiBiMDEpICogZGV0O1xuICAgIG91dFs4XSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xuICAgIG91dFs5XSA9IChhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDYpICogZGV0O1xuICAgIG91dFsxMF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcbiAgICBvdXRbMTFdID0gKGEyMSAqIGIwMiAtIGEyMCAqIGIwNCAtIGEyMyAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzEyXSA9IChhMTEgKiBiMDcgLSBhMTAgKiBiMDkgLSBhMTIgKiBiMDYpICogZGV0O1xuICAgIG91dFsxM10gPSAoYTAwICogYjA5IC0gYTAxICogYjA3ICsgYTAyICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTRdID0gKGEzMSAqIGIwMSAtIGEzMCAqIGIwMyAtIGEzMiAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzE1XSA9IChhMjAgKiBiMDMgLSBhMjEgKiBiMDEgKyBhMjIgKiBiMDApICogZGV0O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0NFxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBhZGpvaW50JDIob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sXG4gICAgICAgIGEwMSA9IGFbMV0sXG4gICAgICAgIGEwMiA9IGFbMl0sXG4gICAgICAgIGEwMyA9IGFbM107XG4gICAgdmFyIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN107XG4gICAgdmFyIGEyMCA9IGFbOF0sXG4gICAgICAgIGEyMSA9IGFbOV0sXG4gICAgICAgIGEyMiA9IGFbMTBdLFxuICAgICAgICBhMjMgPSBhWzExXTtcbiAgICB2YXIgYTMwID0gYVsxMl0sXG4gICAgICAgIGEzMSA9IGFbMTNdLFxuICAgICAgICBhMzIgPSBhWzE0XSxcbiAgICAgICAgYTMzID0gYVsxNV07XG4gICAgb3V0WzBdID0gYTExICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjEgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMSAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpO1xuICAgIG91dFsxXSA9IC0oYTAxICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjEgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMSAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpKTtcbiAgICBvdXRbMl0gPSBhMDEgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMSAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMxICogKGEwMiAqIGExMyAtIGEwMyAqIGExMik7XG4gICAgb3V0WzNdID0gLShhMDEgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSAtIGExMSAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpICsgYTIxICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs0XSA9IC0oYTEwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICBvdXRbNV0gPSBhMDAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMik7XG4gICAgb3V0WzZdID0gLShhMDAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs3XSA9IGEwMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTEwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjAgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKTtcbiAgICBvdXRbOF0gPSBhMTAgKiAoYTIxICogYTMzIC0gYTIzICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzMgLSBhMTMgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMyAtIGExMyAqIGEyMSk7XG4gICAgb3V0WzldID0gLShhMDAgKiAoYTIxICogYTMzIC0gYTIzICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzMgLSBhMDMgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkpO1xuICAgIG91dFsxMF0gPSBhMDAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSAtIGExMCAqIChhMDEgKiBhMzMgLSBhMDMgKiBhMzEpICsgYTMwICogKGEwMSAqIGExMyAtIGEwMyAqIGExMSk7XG4gICAgb3V0WzExXSA9IC0oYTAwICogKGExMSAqIGEyMyAtIGExMyAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIzIC0gYTAzICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTMgLSBhMDMgKiBhMTEpKTtcbiAgICBvdXRbMTJdID0gLShhMTAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkpO1xuICAgIG91dFsxM10gPSBhMDAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSk7XG4gICAgb3V0WzE0XSA9IC0oYTAwICogKGExMSAqIGEzMiAtIGExMiAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICBvdXRbMTVdID0gYTAwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0NFxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAgICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICAgKi9cblxuICBmdW5jdGlvbiBkZXRlcm1pbmFudCQzKGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgYTAzID0gYVszXTtcbiAgICB2YXIgYTEwID0gYVs0XSxcbiAgICAgICAgYTExID0gYVs1XSxcbiAgICAgICAgYTEyID0gYVs2XSxcbiAgICAgICAgYTEzID0gYVs3XTtcbiAgICB2YXIgYTIwID0gYVs4XSxcbiAgICAgICAgYTIxID0gYVs5XSxcbiAgICAgICAgYTIyID0gYVsxMF0sXG4gICAgICAgIGEyMyA9IGFbMTFdO1xuICAgIHZhciBhMzAgPSBhWzEyXSxcbiAgICAgICAgYTMxID0gYVsxM10sXG4gICAgICAgIGEzMiA9IGFbMTRdLFxuICAgICAgICBhMzMgPSBhWzE1XTtcbiAgICB2YXIgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwO1xuICAgIHZhciBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XG4gICAgdmFyIGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMDtcbiAgICB2YXIgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExO1xuICAgIHZhciBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XG4gICAgdmFyIGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMjtcbiAgICB2YXIgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwO1xuICAgIHZhciBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XG4gICAgdmFyIGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMDtcbiAgICB2YXIgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxO1xuICAgIHZhciBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XG4gICAgdmFyIGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjsgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuXG4gICAgcmV0dXJuIGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbGllcyB0d28gbWF0NHNcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQ0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseSQzKG91dCwgYSwgYikge1xuICAgIHZhciBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdO1xuICAgIHZhciBhMTAgPSBhWzRdLFxuICAgICAgICBhMTEgPSBhWzVdLFxuICAgICAgICBhMTIgPSBhWzZdLFxuICAgICAgICBhMTMgPSBhWzddO1xuICAgIHZhciBhMjAgPSBhWzhdLFxuICAgICAgICBhMjEgPSBhWzldLFxuICAgICAgICBhMjIgPSBhWzEwXSxcbiAgICAgICAgYTIzID0gYVsxMV07XG4gICAgdmFyIGEzMCA9IGFbMTJdLFxuICAgICAgICBhMzEgPSBhWzEzXSxcbiAgICAgICAgYTMyID0gYVsxNF0sXG4gICAgICAgIGEzMyA9IGFbMTVdOyAvLyBDYWNoZSBvbmx5IHRoZSBjdXJyZW50IGxpbmUgb2YgdGhlIHNlY29uZCBtYXRyaXhcblxuICAgIHZhciBiMCA9IGJbMF0sXG4gICAgICAgIGIxID0gYlsxXSxcbiAgICAgICAgYjIgPSBiWzJdLFxuICAgICAgICBiMyA9IGJbM107XG4gICAgb3V0WzBdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XG4gICAgb3V0WzFdID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzE7XG4gICAgb3V0WzJdID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzI7XG4gICAgb3V0WzNdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XG4gICAgYjAgPSBiWzRdO1xuICAgIGIxID0gYls1XTtcbiAgICBiMiA9IGJbNl07XG4gICAgYjMgPSBiWzddO1xuICAgIG91dFs0XSA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xuICAgIG91dFs1XSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xuICAgIG91dFs2XSA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyO1xuICAgIG91dFs3XSA9IGIwICogYTAzICsgYjEgKiBhMTMgKyBiMiAqIGEyMyArIGIzICogYTMzO1xuICAgIGIwID0gYls4XTtcbiAgICBiMSA9IGJbOV07XG4gICAgYjIgPSBiWzEwXTtcbiAgICBiMyA9IGJbMTFdO1xuICAgIG91dFs4XSA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xuICAgIG91dFs5XSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xuICAgIG91dFsxMF0gPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcbiAgICBvdXRbMTFdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XG4gICAgYjAgPSBiWzEyXTtcbiAgICBiMSA9IGJbMTNdO1xuICAgIGIyID0gYlsxNF07XG4gICAgYjMgPSBiWzE1XTtcbiAgICBvdXRbMTJdID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XG4gICAgb3V0WzEzXSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xuICAgIG91dFsxNF0gPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcbiAgICBvdXRbMTVdID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNsYXRlIGEgbWF0NCBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICAgKiBAcGFyYW0ge3ZlYzN9IHYgdmVjdG9yIHRvIHRyYW5zbGF0ZSBieVxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZSQyKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgIHogPSB2WzJdO1xuICAgIHZhciBhMDAsIGEwMSwgYTAyLCBhMDM7XG4gICAgdmFyIGExMCwgYTExLCBhMTIsIGExMztcbiAgICB2YXIgYTIwLCBhMjEsIGEyMiwgYTIzO1xuXG4gICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgb3V0WzEyXSA9IGFbMF0gKiB4ICsgYVs0XSAqIHkgKyBhWzhdICogeiArIGFbMTJdO1xuICAgICAgb3V0WzEzXSA9IGFbMV0gKiB4ICsgYVs1XSAqIHkgKyBhWzldICogeiArIGFbMTNdO1xuICAgICAgb3V0WzE0XSA9IGFbMl0gKiB4ICsgYVs2XSAqIHkgKyBhWzEwXSAqIHogKyBhWzE0XTtcbiAgICAgIG91dFsxNV0gPSBhWzNdICogeCArIGFbN10gKiB5ICsgYVsxMV0gKiB6ICsgYVsxNV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGEwMCA9IGFbMF07XG4gICAgICBhMDEgPSBhWzFdO1xuICAgICAgYTAyID0gYVsyXTtcbiAgICAgIGEwMyA9IGFbM107XG4gICAgICBhMTAgPSBhWzRdO1xuICAgICAgYTExID0gYVs1XTtcbiAgICAgIGExMiA9IGFbNl07XG4gICAgICBhMTMgPSBhWzddO1xuICAgICAgYTIwID0gYVs4XTtcbiAgICAgIGEyMSA9IGFbOV07XG4gICAgICBhMjIgPSBhWzEwXTtcbiAgICAgIGEyMyA9IGFbMTFdO1xuICAgICAgb3V0WzBdID0gYTAwO1xuICAgICAgb3V0WzFdID0gYTAxO1xuICAgICAgb3V0WzJdID0gYTAyO1xuICAgICAgb3V0WzNdID0gYTAzO1xuICAgICAgb3V0WzRdID0gYTEwO1xuICAgICAgb3V0WzVdID0gYTExO1xuICAgICAgb3V0WzZdID0gYTEyO1xuICAgICAgb3V0WzddID0gYTEzO1xuICAgICAgb3V0WzhdID0gYTIwO1xuICAgICAgb3V0WzldID0gYTIxO1xuICAgICAgb3V0WzEwXSA9IGEyMjtcbiAgICAgIG91dFsxMV0gPSBhMjM7XG4gICAgICBvdXRbMTJdID0gYTAwICogeCArIGExMCAqIHkgKyBhMjAgKiB6ICsgYVsxMl07XG4gICAgICBvdXRbMTNdID0gYTAxICogeCArIGExMSAqIHkgKyBhMjEgKiB6ICsgYVsxM107XG4gICAgICBvdXRbMTRdID0gYTAyICogeCArIGExMiAqIHkgKyBhMjIgKiB6ICsgYVsxNF07XG4gICAgICBvdXRbMTVdID0gYTAzICogeCArIGExMyAqIHkgKyBhMjMgKiB6ICsgYVsxNV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU2NhbGVzIHRoZSBtYXQ0IGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMzIG5vdCB1c2luZyB2ZWN0b3JpemF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHNjYWxlXG4gICAqIEBwYXJhbSB7dmVjM30gdiB0aGUgdmVjMyB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICoqL1xuXG4gIGZ1bmN0aW9uIHNjYWxlJDMob3V0LCBhLCB2KSB7XG4gICAgdmFyIHggPSB2WzBdLFxuICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgeiA9IHZbMl07XG4gICAgb3V0WzBdID0gYVswXSAqIHg7XG4gICAgb3V0WzFdID0gYVsxXSAqIHg7XG4gICAgb3V0WzJdID0gYVsyXSAqIHg7XG4gICAgb3V0WzNdID0gYVszXSAqIHg7XG4gICAgb3V0WzRdID0gYVs0XSAqIHk7XG4gICAgb3V0WzVdID0gYVs1XSAqIHk7XG4gICAgb3V0WzZdID0gYVs2XSAqIHk7XG4gICAgb3V0WzddID0gYVs3XSAqIHk7XG4gICAgb3V0WzhdID0gYVs4XSAqIHo7XG4gICAgb3V0WzldID0gYVs5XSAqIHo7XG4gICAgb3V0WzEwXSA9IGFbMTBdICogejtcbiAgICBvdXRbMTFdID0gYVsxMV0gKiB6O1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0NCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBnaXZlbiBheGlzXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICAgKiBAcGFyYW0ge3ZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZSQzKG91dCwgYSwgcmFkLCBheGlzKSB7XG4gICAgdmFyIHggPSBheGlzWzBdLFxuICAgICAgICB5ID0gYXhpc1sxXSxcbiAgICAgICAgeiA9IGF4aXNbMl07XG4gICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIHZhciBzLCBjLCB0O1xuICAgIHZhciBhMDAsIGEwMSwgYTAyLCBhMDM7XG4gICAgdmFyIGExMCwgYTExLCBhMTIsIGExMztcbiAgICB2YXIgYTIwLCBhMjEsIGEyMiwgYTIzO1xuICAgIHZhciBiMDAsIGIwMSwgYjAyO1xuICAgIHZhciBiMTAsIGIxMSwgYjEyO1xuICAgIHZhciBiMjAsIGIyMSwgYjIyO1xuXG4gICAgaWYgKGxlbiA8IEVQU0lMT04pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxlbiA9IDEgLyBsZW47XG4gICAgeCAqPSBsZW47XG4gICAgeSAqPSBsZW47XG4gICAgeiAqPSBsZW47XG4gICAgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgdCA9IDEgLSBjO1xuICAgIGEwMCA9IGFbMF07XG4gICAgYTAxID0gYVsxXTtcbiAgICBhMDIgPSBhWzJdO1xuICAgIGEwMyA9IGFbM107XG4gICAgYTEwID0gYVs0XTtcbiAgICBhMTEgPSBhWzVdO1xuICAgIGExMiA9IGFbNl07XG4gICAgYTEzID0gYVs3XTtcbiAgICBhMjAgPSBhWzhdO1xuICAgIGEyMSA9IGFbOV07XG4gICAgYTIyID0gYVsxMF07XG4gICAgYTIzID0gYVsxMV07IC8vIENvbnN0cnVjdCB0aGUgZWxlbWVudHMgb2YgdGhlIHJvdGF0aW9uIG1hdHJpeFxuXG4gICAgYjAwID0geCAqIHggKiB0ICsgYztcbiAgICBiMDEgPSB5ICogeCAqIHQgKyB6ICogcztcbiAgICBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICBiMTAgPSB4ICogeSAqIHQgLSB6ICogcztcbiAgICBiMTEgPSB5ICogeSAqIHQgKyBjO1xuICAgIGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgIGIyMCA9IHggKiB6ICogdCArIHkgKiBzO1xuICAgIGIyMSA9IHkgKiB6ICogdCAtIHggKiBzO1xuICAgIGIyMiA9IHogKiB6ICogdCArIGM7IC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgICBvdXRbMF0gPSBhMDAgKiBiMDAgKyBhMTAgKiBiMDEgKyBhMjAgKiBiMDI7XG4gICAgb3V0WzFdID0gYTAxICogYjAwICsgYTExICogYjAxICsgYTIxICogYjAyO1xuICAgIG91dFsyXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICBvdXRbM10gPSBhMDMgKiBiMDAgKyBhMTMgKiBiMDEgKyBhMjMgKiBiMDI7XG4gICAgb3V0WzRdID0gYTAwICogYjEwICsgYTEwICogYjExICsgYTIwICogYjEyO1xuICAgIG91dFs1XSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICBvdXRbNl0gPSBhMDIgKiBiMTAgKyBhMTIgKiBiMTEgKyBhMjIgKiBiMTI7XG4gICAgb3V0WzddID0gYTAzICogYjEwICsgYTEzICogYjExICsgYTIzICogYjEyO1xuICAgIG91dFs4XSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICBvdXRbOV0gPSBhMDEgKiBiMjAgKyBhMTEgKiBiMjEgKyBhMjEgKiBiMjI7XG4gICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICBvdXRbMTFdID0gYTAzICogYjIwICsgYTEzICogYjIxICsgYTIzICogYjIyO1xuXG4gICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVYKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTtcbiAgICB2YXIgYTEwID0gYVs0XTtcbiAgICB2YXIgYTExID0gYVs1XTtcbiAgICB2YXIgYTEyID0gYVs2XTtcbiAgICB2YXIgYTEzID0gYVs3XTtcbiAgICB2YXIgYTIwID0gYVs4XTtcbiAgICB2YXIgYTIxID0gYVs5XTtcbiAgICB2YXIgYTIyID0gYVsxMF07XG4gICAgdmFyIGEyMyA9IGFbMTFdO1xuXG4gICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgIG91dFsxXSA9IGFbMV07XG4gICAgICBvdXRbMl0gPSBhWzJdO1xuICAgICAgb3V0WzNdID0gYVszXTtcbiAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuXG4gICAgb3V0WzRdID0gYTEwICogYyArIGEyMCAqIHM7XG4gICAgb3V0WzVdID0gYTExICogYyArIGEyMSAqIHM7XG4gICAgb3V0WzZdID0gYTEyICogYyArIGEyMiAqIHM7XG4gICAgb3V0WzddID0gYTEzICogYyArIGEyMyAqIHM7XG4gICAgb3V0WzhdID0gYTIwICogYyAtIGExMCAqIHM7XG4gICAgb3V0WzldID0gYTIxICogYyAtIGExMSAqIHM7XG4gICAgb3V0WzEwXSA9IGEyMiAqIGMgLSBhMTIgKiBzO1xuICAgIG91dFsxMV0gPSBhMjMgKiBjIC0gYTEzICogcztcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVZKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTtcbiAgICB2YXIgYTAwID0gYVswXTtcbiAgICB2YXIgYTAxID0gYVsxXTtcbiAgICB2YXIgYTAyID0gYVsyXTtcbiAgICB2YXIgYTAzID0gYVszXTtcbiAgICB2YXIgYTIwID0gYVs4XTtcbiAgICB2YXIgYTIxID0gYVs5XTtcbiAgICB2YXIgYTIyID0gYVsxMF07XG4gICAgdmFyIGEyMyA9IGFbMTFdO1xuXG4gICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgIG91dFs1XSA9IGFbNV07XG4gICAgICBvdXRbNl0gPSBhWzZdO1xuICAgICAgb3V0WzddID0gYVs3XTtcbiAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuXG4gICAgb3V0WzBdID0gYTAwICogYyAtIGEyMCAqIHM7XG4gICAgb3V0WzFdID0gYTAxICogYyAtIGEyMSAqIHM7XG4gICAgb3V0WzJdID0gYTAyICogYyAtIGEyMiAqIHM7XG4gICAgb3V0WzNdID0gYTAzICogYyAtIGEyMyAqIHM7XG4gICAgb3V0WzhdID0gYTAwICogcyArIGEyMCAqIGM7XG4gICAgb3V0WzldID0gYTAxICogcyArIGEyMSAqIGM7XG4gICAgb3V0WzEwXSA9IGEwMiAqIHMgKyBhMjIgKiBjO1xuICAgIG91dFsxMV0gPSBhMDMgKiBzICsgYTIzICogYztcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFogYXhpc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVaKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTtcbiAgICB2YXIgYTAwID0gYVswXTtcbiAgICB2YXIgYTAxID0gYVsxXTtcbiAgICB2YXIgYTAyID0gYVsyXTtcbiAgICB2YXIgYTAzID0gYVszXTtcbiAgICB2YXIgYTEwID0gYVs0XTtcbiAgICB2YXIgYTExID0gYVs1XTtcbiAgICB2YXIgYTEyID0gYVs2XTtcbiAgICB2YXIgYTEzID0gYVs3XTtcblxuICAgIGlmIChhICE9PSBvdXQpIHtcbiAgICAgIC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIGxhc3Qgcm93XG4gICAgICBvdXRbOF0gPSBhWzhdO1xuICAgICAgb3V0WzldID0gYVs5XTtcbiAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgIG91dFsxMV0gPSBhWzExXTtcbiAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuXG4gICAgb3V0WzBdID0gYTAwICogYyArIGExMCAqIHM7XG4gICAgb3V0WzFdID0gYTAxICogYyArIGExMSAqIHM7XG4gICAgb3V0WzJdID0gYTAyICogYyArIGExMiAqIHM7XG4gICAgb3V0WzNdID0gYTAzICogYyArIGExMyAqIHM7XG4gICAgb3V0WzRdID0gYTEwICogYyAtIGEwMCAqIHM7XG4gICAgb3V0WzVdID0gYTExICogYyAtIGEwMSAqIHM7XG4gICAgb3V0WzZdID0gYTEyICogYyAtIGEwMiAqIHM7XG4gICAgb3V0WzddID0gYTEzICogYyAtIGEwMyAqIHM7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHRyYW5zbGF0aW9uXG4gICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgKlxuICAgKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAgICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIGRlc3QsIHZlYyk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHt2ZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21UcmFuc2xhdGlvbiQyKG91dCwgdikge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAxO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IHZbMF07XG4gICAgb3V0WzEzXSA9IHZbMV07XG4gICAgb3V0WzE0XSA9IHZbMl07XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcbiAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAqXG4gICAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICAgKiAgICAgbWF0NC5zY2FsZShkZXN0LCBkZXN0LCB2ZWMpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7dmVjM30gdiBTY2FsaW5nIHZlY3RvclxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21TY2FsaW5nJDMob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gdlswXTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IHZbMV07XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gdlsyXTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZSBhcm91bmQgYSBnaXZlbiBheGlzXG4gICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgKlxuICAgKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAgICogICAgIG1hdDQucm90YXRlKGRlc3QsIGRlc3QsIHJhZCwgYXhpcyk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHBhcmFtIHt2ZWMzfSBheGlzIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tUm90YXRpb24kMyhvdXQsIHJhZCwgYXhpcykge1xuICAgIHZhciB4ID0gYXhpc1swXSxcbiAgICAgICAgeSA9IGF4aXNbMV0sXG4gICAgICAgIHogPSBheGlzWzJdO1xuICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICB2YXIgcywgYywgdDtcblxuICAgIGlmIChsZW4gPCBFUFNJTE9OKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZW4gPSAxIC8gbGVuO1xuICAgIHggKj0gbGVuO1xuICAgIHkgKj0gbGVuO1xuICAgIHogKj0gbGVuO1xuICAgIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHQgPSAxIC0gYzsgLy8gUGVyZm9ybSByb3RhdGlvbi1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICAgIG91dFswXSA9IHggKiB4ICogdCArIGM7XG4gICAgb3V0WzFdID0geSAqIHggKiB0ICsgeiAqIHM7XG4gICAgb3V0WzJdID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSB4ICogeSAqIHQgLSB6ICogcztcbiAgICBvdXRbNV0gPSB5ICogeSAqIHQgKyBjO1xuICAgIG91dFs2XSA9IHogKiB5ICogdCArIHggKiBzO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geCAqIHogKiB0ICsgeSAqIHM7XG4gICAgb3V0WzldID0geSAqIHogKiB0IC0geCAqIHM7XG4gICAgb3V0WzEwXSA9IHogKiB6ICogdCArIGM7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQ0LnJvdGF0ZVgoZGVzdCwgZGVzdCwgcmFkKTtcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21YUm90YXRpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhyYWQpOyAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG5cbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gYztcbiAgICBvdXRbNl0gPSBzO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAtcztcbiAgICBvdXRbMTBdID0gYztcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXG4gICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgKlxuICAgKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAgICogICAgIG1hdDQucm90YXRlWShkZXN0LCBkZXN0LCByYWQpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVlSb3RhdGlvbihvdXQsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICB2YXIgYyA9IE1hdGguY29zKHJhZCk7IC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cblxuICAgIG91dFswXSA9IGM7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAtcztcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gcztcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSBjO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAqXG4gICAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICAgKiAgICAgbWF0NC5yb3RhdGVaKGRlc3QsIGRlc3QsIHJhZCk7XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tWlJvdGF0aW9uKG91dCwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIHZhciBjID0gTWF0aC5jb3MocmFkKTsgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuXG4gICAgb3V0WzBdID0gYztcbiAgICBvdXRbMV0gPSBzO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAtcztcbiAgICBvdXRbNV0gPSBjO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgcXVhdGVybmlvbiByb3RhdGlvbiBhbmQgdmVjdG9yIHRyYW5zbGF0aW9uXG4gICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgKlxuICAgKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAgICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIHZlYyk7XG4gICAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gICAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gICAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7cXVhdDR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3ZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24ob3V0LCBxLCB2KSB7XG4gICAgLy8gUXVhdGVybmlvbiBtYXRoXG4gICAgdmFyIHggPSBxWzBdLFxuICAgICAgICB5ID0gcVsxXSxcbiAgICAgICAgeiA9IHFbMl0sXG4gICAgICAgIHcgPSBxWzNdO1xuICAgIHZhciB4MiA9IHggKyB4O1xuICAgIHZhciB5MiA9IHkgKyB5O1xuICAgIHZhciB6MiA9IHogKyB6O1xuICAgIHZhciB4eCA9IHggKiB4MjtcbiAgICB2YXIgeHkgPSB4ICogeTI7XG4gICAgdmFyIHh6ID0geCAqIHoyO1xuICAgIHZhciB5eSA9IHkgKiB5MjtcbiAgICB2YXIgeXogPSB5ICogejI7XG4gICAgdmFyIHp6ID0geiAqIHoyO1xuICAgIHZhciB3eCA9IHcgKiB4MjtcbiAgICB2YXIgd3kgPSB3ICogeTI7XG4gICAgdmFyIHd6ID0gdyAqIHoyO1xuICAgIG91dFswXSA9IDEgLSAoeXkgKyB6eik7XG4gICAgb3V0WzFdID0geHkgKyB3ejtcbiAgICBvdXRbMl0gPSB4eiAtIHd5O1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0geHkgLSB3ejtcbiAgICBvdXRbNV0gPSAxIC0gKHh4ICsgenopO1xuICAgIG91dFs2XSA9IHl6ICsgd3g7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSB4eiArIHd5O1xuICAgIG91dFs5XSA9IHl6IC0gd3g7XG4gICAgb3V0WzEwXSA9IDEgLSAoeHggKyB5eSk7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IHZbMF07XG4gICAgb3V0WzEzXSA9IHZbMV07XG4gICAgb3V0WzE0XSA9IHZbMl07XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBtYXQ0IGZyb20gYSBkdWFsIHF1YXQuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IE1hdHJpeFxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIER1YWwgUXVhdGVybmlvblxuICAgKiBAcmV0dXJucyB7bWF0NH0gbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tUXVhdDIob3V0LCBhKSB7XG4gICAgdmFyIHRyYW5zbGF0aW9uID0gbmV3IEFSUkFZX1RZUEUoMyk7XG4gICAgdmFyIGJ4ID0gLWFbMF0sXG4gICAgICAgIGJ5ID0gLWFbMV0sXG4gICAgICAgIGJ6ID0gLWFbMl0sXG4gICAgICAgIGJ3ID0gYVszXSxcbiAgICAgICAgYXggPSBhWzRdLFxuICAgICAgICBheSA9IGFbNV0sXG4gICAgICAgIGF6ID0gYVs2XSxcbiAgICAgICAgYXcgPSBhWzddO1xuICAgIHZhciBtYWduaXR1ZGUgPSBieCAqIGJ4ICsgYnkgKiBieSArIGJ6ICogYnogKyBidyAqIGJ3OyAvL09ubHkgc2NhbGUgaWYgaXQgbWFrZXMgc2Vuc2VcblxuICAgIGlmIChtYWduaXR1ZGUgPiAwKSB7XG4gICAgICB0cmFuc2xhdGlvblswXSA9IChheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5KSAqIDIgLyBtYWduaXR1ZGU7XG4gICAgICB0cmFuc2xhdGlvblsxXSA9IChheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6KSAqIDIgLyBtYWduaXR1ZGU7XG4gICAgICB0cmFuc2xhdGlvblsyXSA9IChheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4KSAqIDIgLyBtYWduaXR1ZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zbGF0aW9uWzBdID0gKGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnkpICogMjtcbiAgICAgIHRyYW5zbGF0aW9uWzFdID0gKGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYnopICogMjtcbiAgICAgIHRyYW5zbGF0aW9uWzJdID0gKGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYngpICogMjtcbiAgICB9XG5cbiAgICBmcm9tUm90YXRpb25UcmFuc2xhdGlvbihvdXQsIGEsIHRyYW5zbGF0aW9uKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiB2ZWN0b3IgY29tcG9uZW50IG9mIGEgdHJhbnNmb3JtYXRpb25cbiAgICogIG1hdHJpeC4gSWYgYSBtYXRyaXggaXMgYnVpbHQgd2l0aCBmcm9tUm90YXRpb25UcmFuc2xhdGlvbixcbiAgICogIHRoZSByZXR1cm5lZCB2ZWN0b3Igd2lsbCBiZSB0aGUgc2FtZSBhcyB0aGUgdHJhbnNsYXRpb24gdmVjdG9yXG4gICAqICBvcmlnaW5hbGx5IHN1cHBsaWVkLlxuICAgKiBAcGFyYW0gIHt2ZWMzfSBvdXQgVmVjdG9yIHRvIHJlY2VpdmUgdHJhbnNsYXRpb24gY29tcG9uZW50XG4gICAqIEBwYXJhbSAge21hdDR9IG1hdCBNYXRyaXggdG8gYmUgZGVjb21wb3NlZCAoaW5wdXQpXG4gICAqIEByZXR1cm4ge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRUcmFuc2xhdGlvbihvdXQsIG1hdCkge1xuICAgIG91dFswXSA9IG1hdFsxMl07XG4gICAgb3V0WzFdID0gbWF0WzEzXTtcbiAgICBvdXRbMl0gPSBtYXRbMTRdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjYWxpbmcgZmFjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uXG4gICAqICBtYXRyaXguIElmIGEgbWF0cml4IGlzIGJ1aWx0IHdpdGggZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZVxuICAgKiAgd2l0aCBhIG5vcm1hbGl6ZWQgUXVhdGVybmlvbiBwYXJhbXRlciwgdGhlIHJldHVybmVkIHZlY3RvciB3aWxsIGJlXG4gICAqICB0aGUgc2FtZSBhcyB0aGUgc2NhbGluZyB2ZWN0b3JcbiAgICogIG9yaWdpbmFsbHkgc3VwcGxpZWQuXG4gICAqIEBwYXJhbSAge3ZlYzN9IG91dCBWZWN0b3IgdG8gcmVjZWl2ZSBzY2FsaW5nIGZhY3RvciBjb21wb25lbnRcbiAgICogQHBhcmFtICB7bWF0NH0gbWF0IE1hdHJpeCB0byBiZSBkZWNvbXBvc2VkIChpbnB1dClcbiAgICogQHJldHVybiB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldFNjYWxpbmcob3V0LCBtYXQpIHtcbiAgICB2YXIgbTExID0gbWF0WzBdO1xuICAgIHZhciBtMTIgPSBtYXRbMV07XG4gICAgdmFyIG0xMyA9IG1hdFsyXTtcbiAgICB2YXIgbTIxID0gbWF0WzRdO1xuICAgIHZhciBtMjIgPSBtYXRbNV07XG4gICAgdmFyIG0yMyA9IG1hdFs2XTtcbiAgICB2YXIgbTMxID0gbWF0WzhdO1xuICAgIHZhciBtMzIgPSBtYXRbOV07XG4gICAgdmFyIG0zMyA9IG1hdFsxMF07XG4gICAgb3V0WzBdID0gTWF0aC5zcXJ0KG0xMSAqIG0xMSArIG0xMiAqIG0xMiArIG0xMyAqIG0xMyk7XG4gICAgb3V0WzFdID0gTWF0aC5zcXJ0KG0yMSAqIG0yMSArIG0yMiAqIG0yMiArIG0yMyAqIG0yMyk7XG4gICAgb3V0WzJdID0gTWF0aC5zcXJ0KG0zMSAqIG0zMSArIG0zMiAqIG0zMiArIG0zMyAqIG0zMyk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBhIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbmFsIGNvbXBvbmVudFxuICAgKiAgb2YgYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXguIElmIGEgbWF0cml4IGlzIGJ1aWx0IHdpdGhcbiAgICogIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uLCB0aGUgcmV0dXJuZWQgcXVhdGVybmlvbiB3aWxsIGJlIHRoZVxuICAgKiAgc2FtZSBhcyB0aGUgcXVhdGVybmlvbiBvcmlnaW5hbGx5IHN1cHBsaWVkLlxuICAgKiBAcGFyYW0ge3F1YXR9IG91dCBRdWF0ZXJuaW9uIHRvIHJlY2VpdmUgdGhlIHJvdGF0aW9uIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge21hdDR9IG1hdCBNYXRyaXggdG8gYmUgZGVjb21wb3NlZCAoaW5wdXQpXG4gICAqIEByZXR1cm4ge3F1YXR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRSb3RhdGlvbihvdXQsIG1hdCkge1xuICAgIC8vIEFsZ29yaXRobSB0YWtlbiBmcm9tIGh0dHA6Ly93d3cuZXVjbGlkZWFuc3BhY2UuY29tL21hdGhzL2dlb21ldHJ5L3JvdGF0aW9ucy9jb252ZXJzaW9ucy9tYXRyaXhUb1F1YXRlcm5pb24vaW5kZXguaHRtXG4gICAgdmFyIHRyYWNlID0gbWF0WzBdICsgbWF0WzVdICsgbWF0WzEwXTtcbiAgICB2YXIgUyA9IDA7XG5cbiAgICBpZiAodHJhY2UgPiAwKSB7XG4gICAgICBTID0gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKSAqIDI7XG4gICAgICBvdXRbM10gPSAwLjI1ICogUztcbiAgICAgIG91dFswXSA9IChtYXRbNl0gLSBtYXRbOV0pIC8gUztcbiAgICAgIG91dFsxXSA9IChtYXRbOF0gLSBtYXRbMl0pIC8gUztcbiAgICAgIG91dFsyXSA9IChtYXRbMV0gLSBtYXRbNF0pIC8gUztcbiAgICB9IGVsc2UgaWYgKG1hdFswXSA+IG1hdFs1XSAmJiBtYXRbMF0gPiBtYXRbMTBdKSB7XG4gICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1hdFswXSAtIG1hdFs1XSAtIG1hdFsxMF0pICogMjtcbiAgICAgIG91dFszXSA9IChtYXRbNl0gLSBtYXRbOV0pIC8gUztcbiAgICAgIG91dFswXSA9IDAuMjUgKiBTO1xuICAgICAgb3V0WzFdID0gKG1hdFsxXSArIG1hdFs0XSkgLyBTO1xuICAgICAgb3V0WzJdID0gKG1hdFs4XSArIG1hdFsyXSkgLyBTO1xuICAgIH0gZWxzZSBpZiAobWF0WzVdID4gbWF0WzEwXSkge1xuICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtYXRbNV0gLSBtYXRbMF0gLSBtYXRbMTBdKSAqIDI7XG4gICAgICBvdXRbM10gPSAobWF0WzhdIC0gbWF0WzJdKSAvIFM7XG4gICAgICBvdXRbMF0gPSAobWF0WzFdICsgbWF0WzRdKSAvIFM7XG4gICAgICBvdXRbMV0gPSAwLjI1ICogUztcbiAgICAgIG91dFsyXSA9IChtYXRbNl0gKyBtYXRbOV0pIC8gUztcbiAgICB9IGVsc2Uge1xuICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtYXRbMTBdIC0gbWF0WzBdIC0gbWF0WzVdKSAqIDI7XG4gICAgICBvdXRbM10gPSAobWF0WzFdIC0gbWF0WzRdKSAvIFM7XG4gICAgICBvdXRbMF0gPSAobWF0WzhdICsgbWF0WzJdKSAvIFM7XG4gICAgICBvdXRbMV0gPSAobWF0WzZdICsgbWF0WzldKSAvIFM7XG4gICAgICBvdXRbMl0gPSAwLjI1ICogUztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZVxuICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICpcbiAgICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gICAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCB2ZWMpO1xuICAgKiAgICAgbGV0IHF1YXRNYXQgPSBtYXQ0LmNyZWF0ZSgpO1xuICAgKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICAgKiAgICAgbWF0NC5tdWx0aXBseShkZXN0LCBxdWF0TWF0KTtcbiAgICogICAgIG1hdDQuc2NhbGUoZGVzdCwgc2NhbGUpXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7dmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBzIFNjYWxpbmcgdmVjdG9yXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZShvdXQsIHEsIHYsIHMpIHtcbiAgICAvLyBRdWF0ZXJuaW9uIG1hdGhcbiAgICB2YXIgeCA9IHFbMF0sXG4gICAgICAgIHkgPSBxWzFdLFxuICAgICAgICB6ID0gcVsyXSxcbiAgICAgICAgdyA9IHFbM107XG4gICAgdmFyIHgyID0geCArIHg7XG4gICAgdmFyIHkyID0geSArIHk7XG4gICAgdmFyIHoyID0geiArIHo7XG4gICAgdmFyIHh4ID0geCAqIHgyO1xuICAgIHZhciB4eSA9IHggKiB5MjtcbiAgICB2YXIgeHogPSB4ICogejI7XG4gICAgdmFyIHl5ID0geSAqIHkyO1xuICAgIHZhciB5eiA9IHkgKiB6MjtcbiAgICB2YXIgenogPSB6ICogejI7XG4gICAgdmFyIHd4ID0gdyAqIHgyO1xuICAgIHZhciB3eSA9IHcgKiB5MjtcbiAgICB2YXIgd3ogPSB3ICogejI7XG4gICAgdmFyIHN4ID0gc1swXTtcbiAgICB2YXIgc3kgPSBzWzFdO1xuICAgIHZhciBzeiA9IHNbMl07XG4gICAgb3V0WzBdID0gKDEgLSAoeXkgKyB6eikpICogc3g7XG4gICAgb3V0WzFdID0gKHh5ICsgd3opICogc3g7XG4gICAgb3V0WzJdID0gKHh6IC0gd3kpICogc3g7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAoeHkgLSB3eikgKiBzeTtcbiAgICBvdXRbNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcbiAgICBvdXRbNl0gPSAoeXogKyB3eCkgKiBzeTtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9ICh4eiArIHd5KSAqIHN6O1xuICAgIG91dFs5XSA9ICh5eiAtIHd4KSAqIHN6O1xuICAgIG91dFsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gdlswXTtcbiAgICBvdXRbMTNdID0gdlsxXTtcbiAgICBvdXRbMTRdID0gdlsyXTtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZSwgcm90YXRpbmcgYW5kIHNjYWxpbmcgYXJvdW5kIHRoZSBnaXZlbiBvcmlnaW5cbiAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAqXG4gICAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICAgKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAgICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG9yaWdpbik7XG4gICAqICAgICBsZXQgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gICAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gICAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xuICAgKiAgICAgbWF0NC5zY2FsZShkZXN0LCBzY2FsZSlcbiAgICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG5lZ2F0aXZlT3JpZ2luKTtcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAgICogQHBhcmFtIHt2ZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IHMgU2NhbGluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBvIFRoZSBvcmlnaW4gdmVjdG9yIGFyb3VuZCB3aGljaCB0byBzY2FsZSBhbmQgcm90YXRlXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZU9yaWdpbihvdXQsIHEsIHYsIHMsIG8pIHtcbiAgICAvLyBRdWF0ZXJuaW9uIG1hdGhcbiAgICB2YXIgeCA9IHFbMF0sXG4gICAgICAgIHkgPSBxWzFdLFxuICAgICAgICB6ID0gcVsyXSxcbiAgICAgICAgdyA9IHFbM107XG4gICAgdmFyIHgyID0geCArIHg7XG4gICAgdmFyIHkyID0geSArIHk7XG4gICAgdmFyIHoyID0geiArIHo7XG4gICAgdmFyIHh4ID0geCAqIHgyO1xuICAgIHZhciB4eSA9IHggKiB5MjtcbiAgICB2YXIgeHogPSB4ICogejI7XG4gICAgdmFyIHl5ID0geSAqIHkyO1xuICAgIHZhciB5eiA9IHkgKiB6MjtcbiAgICB2YXIgenogPSB6ICogejI7XG4gICAgdmFyIHd4ID0gdyAqIHgyO1xuICAgIHZhciB3eSA9IHcgKiB5MjtcbiAgICB2YXIgd3ogPSB3ICogejI7XG4gICAgdmFyIHN4ID0gc1swXTtcbiAgICB2YXIgc3kgPSBzWzFdO1xuICAgIHZhciBzeiA9IHNbMl07XG4gICAgdmFyIG94ID0gb1swXTtcbiAgICB2YXIgb3kgPSBvWzFdO1xuICAgIHZhciBveiA9IG9bMl07XG4gICAgdmFyIG91dDAgPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgICB2YXIgb3V0MSA9ICh4eSArIHd6KSAqIHN4O1xuICAgIHZhciBvdXQyID0gKHh6IC0gd3kpICogc3g7XG4gICAgdmFyIG91dDQgPSAoeHkgLSB3eikgKiBzeTtcbiAgICB2YXIgb3V0NSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xuICAgIHZhciBvdXQ2ID0gKHl6ICsgd3gpICogc3k7XG4gICAgdmFyIG91dDggPSAoeHogKyB3eSkgKiBzejtcbiAgICB2YXIgb3V0OSA9ICh5eiAtIHd4KSAqIHN6O1xuICAgIHZhciBvdXQxMCA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xuICAgIG91dFswXSA9IG91dDA7XG4gICAgb3V0WzFdID0gb3V0MTtcbiAgICBvdXRbMl0gPSBvdXQyO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gb3V0NDtcbiAgICBvdXRbNV0gPSBvdXQ1O1xuICAgIG91dFs2XSA9IG91dDY7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSBvdXQ4O1xuICAgIG91dFs5XSA9IG91dDk7XG4gICAgb3V0WzEwXSA9IG91dDEwO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdICsgb3ggLSAob3V0MCAqIG94ICsgb3V0NCAqIG95ICsgb3V0OCAqIG96KTtcbiAgICBvdXRbMTNdID0gdlsxXSArIG95IC0gKG91dDEgKiBveCArIG91dDUgKiBveSArIG91dDkgKiBveik7XG4gICAgb3V0WzE0XSA9IHZbMl0gKyBveiAtIChvdXQyICogb3ggKyBvdXQ2ICogb3kgKyBvdXQxMCAqIG96KTtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgNHg0IG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBxdWF0ZXJuaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtxdWF0fSBxIFF1YXRlcm5pb24gdG8gY3JlYXRlIG1hdHJpeCBmcm9tXG4gICAqXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVF1YXQkMShvdXQsIHEpIHtcbiAgICB2YXIgeCA9IHFbMF0sXG4gICAgICAgIHkgPSBxWzFdLFxuICAgICAgICB6ID0gcVsyXSxcbiAgICAgICAgdyA9IHFbM107XG4gICAgdmFyIHgyID0geCArIHg7XG4gICAgdmFyIHkyID0geSArIHk7XG4gICAgdmFyIHoyID0geiArIHo7XG4gICAgdmFyIHh4ID0geCAqIHgyO1xuICAgIHZhciB5eCA9IHkgKiB4MjtcbiAgICB2YXIgeXkgPSB5ICogeTI7XG4gICAgdmFyIHp4ID0geiAqIHgyO1xuICAgIHZhciB6eSA9IHogKiB5MjtcbiAgICB2YXIgenogPSB6ICogejI7XG4gICAgdmFyIHd4ID0gdyAqIHgyO1xuICAgIHZhciB3eSA9IHcgKiB5MjtcbiAgICB2YXIgd3ogPSB3ICogejI7XG4gICAgb3V0WzBdID0gMSAtIHl5IC0geno7XG4gICAgb3V0WzFdID0geXggKyB3ejtcbiAgICBvdXRbMl0gPSB6eCAtIHd5O1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0geXggLSB3ejtcbiAgICBvdXRbNV0gPSAxIC0geHggLSB6ejtcbiAgICBvdXRbNl0gPSB6eSArIHd4O1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0genggKyB3eTtcbiAgICBvdXRbOV0gPSB6eSAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0geHggLSB5eTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBmcnVzdHVtIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICAgKiBAcGFyYW0ge051bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICAgKiBAcGFyYW0ge051bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICAgKiBAcGFyYW0ge051bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICAgKiBAcGFyYW0ge051bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJ1c3R1bShvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpO1xuICAgIHZhciB0YiA9IDEgLyAodG9wIC0gYm90dG9tKTtcbiAgICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IG5lYXIgKiAyICogcmw7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSBuZWFyICogMiAqIHRiO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xuICAgIG91dFs5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XG4gICAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgIG91dFsxMV0gPSAtMTtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gZmFyICogbmVhciAqIDIgKiBuZjtcbiAgICBvdXRbMTVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHMuXG4gICAqIFBhc3NpbmcgbnVsbC91bmRlZmluZWQvbm8gdmFsdWUgZm9yIGZhciB3aWxsIGdlbmVyYXRlIGluZmluaXRlIHByb2plY3Rpb24gbWF0cml4LlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IEFzcGVjdCByYXRpby4gdHlwaWNhbGx5IHZpZXdwb3J0IHdpZHRoL2hlaWdodFxuICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtLCBjYW4gYmUgbnVsbCBvciBJbmZpbml0eVxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBlcnNwZWN0aXZlKG91dCwgZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgZiA9IDEuMCAvIE1hdGgudGFuKGZvdnkgLyAyKSxcbiAgICAgICAgbmY7XG4gICAgb3V0WzBdID0gZiAvIGFzcGVjdDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IGY7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTFdID0gLTE7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE1XSA9IDA7XG5cbiAgICBpZiAoZmFyICE9IG51bGwgJiYgZmFyICE9PSBJbmZpbml0eSkge1xuICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgICAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgb3V0WzE0XSA9IDIgKiBmYXIgKiBuZWFyICogbmY7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dFsxMF0gPSAtMTtcbiAgICAgIG91dFsxNF0gPSAtMiAqIG5lYXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZmllbGQgb2Ygdmlldy5cbiAgICogVGhpcyBpcyBwcmltYXJpbHkgdXNlZnVsIGZvciBnZW5lcmF0aW5nIHByb2plY3Rpb24gbWF0cmljZXMgdG8gYmUgdXNlZFxuICAgKiB3aXRoIHRoZSBzdGlsbCBleHBlcmllbWVudGFsIFdlYlZSIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICAgKiBAcGFyYW0ge09iamVjdH0gZm92IE9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiB1cERlZ3JlZXMsIGRvd25EZWdyZWVzLCBsZWZ0RGVncmVlcywgcmlnaHREZWdyZWVzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBwZXJzcGVjdGl2ZUZyb21GaWVsZE9mVmlldyhvdXQsIGZvdiwgbmVhciwgZmFyKSB7XG4gICAgdmFyIHVwVGFuID0gTWF0aC50YW4oZm92LnVwRGVncmVlcyAqIE1hdGguUEkgLyAxODAuMCk7XG4gICAgdmFyIGRvd25UYW4gPSBNYXRoLnRhbihmb3YuZG93bkRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwLjApO1xuICAgIHZhciBsZWZ0VGFuID0gTWF0aC50YW4oZm92LmxlZnREZWdyZWVzICogTWF0aC5QSSAvIDE4MC4wKTtcbiAgICB2YXIgcmlnaHRUYW4gPSBNYXRoLnRhbihmb3YucmlnaHREZWdyZWVzICogTWF0aC5QSSAvIDE4MC4wKTtcbiAgICB2YXIgeFNjYWxlID0gMi4wIC8gKGxlZnRUYW4gKyByaWdodFRhbik7XG4gICAgdmFyIHlTY2FsZSA9IDIuMCAvICh1cFRhbiArIGRvd25UYW4pO1xuICAgIG91dFswXSA9IHhTY2FsZTtcbiAgICBvdXRbMV0gPSAwLjA7XG4gICAgb3V0WzJdID0gMC4wO1xuICAgIG91dFszXSA9IDAuMDtcbiAgICBvdXRbNF0gPSAwLjA7XG4gICAgb3V0WzVdID0geVNjYWxlO1xuICAgIG91dFs2XSA9IDAuMDtcbiAgICBvdXRbN10gPSAwLjA7XG4gICAgb3V0WzhdID0gLSgobGVmdFRhbiAtIHJpZ2h0VGFuKSAqIHhTY2FsZSAqIDAuNSk7XG4gICAgb3V0WzldID0gKHVwVGFuIC0gZG93blRhbikgKiB5U2NhbGUgKiAwLjU7XG4gICAgb3V0WzEwXSA9IGZhciAvIChuZWFyIC0gZmFyKTtcbiAgICBvdXRbMTFdID0gLTEuMDtcbiAgICBvdXRbMTJdID0gMC4wO1xuICAgIG91dFsxM10gPSAwLjA7XG4gICAgb3V0WzE0XSA9IGZhciAqIG5lYXIgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzE1XSA9IDAuMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IExlZnQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAgICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IFJpZ2h0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b20gQm90dG9tIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBvcnRobyhvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpO1xuICAgIHZhciBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcbiAgICB2YXIgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IC0yICogbHI7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAtMiAqIGJ0O1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDIgKiBuZjtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gKGxlZnQgKyByaWdodCkgKiBscjtcbiAgICBvdXRbMTNdID0gKHRvcCArIGJvdHRvbSkgKiBidDtcbiAgICBvdXRbMTRdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgbG9vay1hdCBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZXllIHBvc2l0aW9uLCBmb2NhbCBwb2ludCwgYW5kIHVwIGF4aXMuXG4gICAqIElmIHlvdSB3YW50IGEgbWF0cml4IHRoYXQgYWN0dWFsbHkgbWFrZXMgYW4gb2JqZWN0IGxvb2sgYXQgYW5vdGhlciBvYmplY3QsIHlvdSBzaG91bGQgdXNlIHRhcmdldFRvIGluc3RlYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAgICogQHBhcmFtIHt2ZWMzfSBleWUgUG9zaXRpb24gb2YgdGhlIHZpZXdlclxuICAgKiBAcGFyYW0ge3ZlYzN9IGNlbnRlciBQb2ludCB0aGUgdmlld2VyIGlzIGxvb2tpbmcgYXRcbiAgICogQHBhcmFtIHt2ZWMzfSB1cCB2ZWMzIHBvaW50aW5nIHVwXG4gICAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbG9va0F0KG91dCwgZXllLCBjZW50ZXIsIHVwKSB7XG4gICAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbjtcbiAgICB2YXIgZXlleCA9IGV5ZVswXTtcbiAgICB2YXIgZXlleSA9IGV5ZVsxXTtcbiAgICB2YXIgZXlleiA9IGV5ZVsyXTtcbiAgICB2YXIgdXB4ID0gdXBbMF07XG4gICAgdmFyIHVweSA9IHVwWzFdO1xuICAgIHZhciB1cHogPSB1cFsyXTtcbiAgICB2YXIgY2VudGVyeCA9IGNlbnRlclswXTtcbiAgICB2YXIgY2VudGVyeSA9IGNlbnRlclsxXTtcbiAgICB2YXIgY2VudGVyeiA9IGNlbnRlclsyXTtcblxuICAgIGlmIChNYXRoLmFicyhleWV4IC0gY2VudGVyeCkgPCBFUFNJTE9OICYmIE1hdGguYWJzKGV5ZXkgLSBjZW50ZXJ5KSA8IEVQU0lMT04gJiYgTWF0aC5hYnMoZXlleiAtIGNlbnRlcnopIDwgRVBTSUxPTikge1xuICAgICAgcmV0dXJuIGlkZW50aXR5JDMob3V0KTtcbiAgICB9XG5cbiAgICB6MCA9IGV5ZXggLSBjZW50ZXJ4O1xuICAgIHoxID0gZXlleSAtIGNlbnRlcnk7XG4gICAgejIgPSBleWV6IC0gY2VudGVyejtcbiAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XG4gICAgejAgKj0gbGVuO1xuICAgIHoxICo9IGxlbjtcbiAgICB6MiAqPSBsZW47XG4gICAgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxO1xuICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG5cbiAgICBpZiAoIWxlbikge1xuICAgICAgeDAgPSAwO1xuICAgICAgeDEgPSAwO1xuICAgICAgeDIgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgeDAgKj0gbGVuO1xuICAgICAgeDEgKj0gbGVuO1xuICAgICAgeDIgKj0gbGVuO1xuICAgIH1cblxuICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7XG4gICAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjtcbiAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuXG4gICAgaWYgKCFsZW4pIHtcbiAgICAgIHkwID0gMDtcbiAgICAgIHkxID0gMDtcbiAgICAgIHkyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgIHkwICo9IGxlbjtcbiAgICAgIHkxICo9IGxlbjtcbiAgICAgIHkyICo9IGxlbjtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSB4MDtcbiAgICBvdXRbMV0gPSB5MDtcbiAgICBvdXRbMl0gPSB6MDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHgxO1xuICAgIG91dFs1XSA9IHkxO1xuICAgIG91dFs2XSA9IHoxO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geDI7XG4gICAgb3V0WzldID0geTI7XG4gICAgb3V0WzEwXSA9IHoyO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XG4gICAgb3V0WzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICBvdXRbMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIG1hdHJpeCB0aGF0IG1ha2VzIHNvbWV0aGluZyBsb29rIGF0IHNvbWV0aGluZyBlbHNlLlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gICAqIEBwYXJhbSB7dmVjM30gZXllIFBvc2l0aW9uIG9mIHRoZSB2aWV3ZXJcbiAgICogQHBhcmFtIHt2ZWMzfSBjZW50ZXIgUG9pbnQgdGhlIHZpZXdlciBpcyBsb29raW5nIGF0XG4gICAqIEBwYXJhbSB7dmVjM30gdXAgdmVjMyBwb2ludGluZyB1cFxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRhcmdldFRvKG91dCwgZXllLCB0YXJnZXQsIHVwKSB7XG4gICAgdmFyIGV5ZXggPSBleWVbMF0sXG4gICAgICAgIGV5ZXkgPSBleWVbMV0sXG4gICAgICAgIGV5ZXogPSBleWVbMl0sXG4gICAgICAgIHVweCA9IHVwWzBdLFxuICAgICAgICB1cHkgPSB1cFsxXSxcbiAgICAgICAgdXB6ID0gdXBbMl07XG4gICAgdmFyIHowID0gZXlleCAtIHRhcmdldFswXSxcbiAgICAgICAgejEgPSBleWV5IC0gdGFyZ2V0WzFdLFxuICAgICAgICB6MiA9IGV5ZXogLSB0YXJnZXRbMl07XG4gICAgdmFyIGxlbiA9IHowICogejAgKyB6MSAqIHoxICsgejIgKiB6MjtcblxuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XG4gICAgICB6MCAqPSBsZW47XG4gICAgICB6MSAqPSBsZW47XG4gICAgICB6MiAqPSBsZW47XG4gICAgfVxuXG4gICAgdmFyIHgwID0gdXB5ICogejIgLSB1cHogKiB6MSxcbiAgICAgICAgeDEgPSB1cHogKiB6MCAtIHVweCAqIHoyLFxuICAgICAgICB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgbGVuID0geDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyO1xuXG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgIHgwICo9IGxlbjtcbiAgICAgIHgxICo9IGxlbjtcbiAgICAgIHgyICo9IGxlbjtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSB4MDtcbiAgICBvdXRbMV0gPSB4MTtcbiAgICBvdXRbMl0gPSB4MjtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgIG91dFs1XSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgIG91dFs2XSA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gejA7XG4gICAgb3V0WzldID0gejE7XG4gICAgb3V0WzEwXSA9IHoyO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSBleWV4O1xuICAgIG91dFsxM10gPSBleWV5O1xuICAgIG91dFsxNF0gPSBleWV6O1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQ0XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gYSBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN0ciQzKGEpIHtcbiAgICByZXR1cm4gJ21hdDQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnLCAnICsgYVs0XSArICcsICcgKyBhWzVdICsgJywgJyArIGFbNl0gKyAnLCAnICsgYVs3XSArICcsICcgKyBhWzhdICsgJywgJyArIGFbOV0gKyAnLCAnICsgYVsxMF0gKyAnLCAnICsgYVsxMV0gKyAnLCAnICsgYVsxMl0gKyAnLCAnICsgYVsxM10gKyAnLCAnICsgYVsxNF0gKyAnLCAnICsgYVsxNV0gKyAnKSc7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgRnJvYmVuaXVzIG5vcm0gb2YgYSBtYXQ0XG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIGNhbGN1bGF0ZSBGcm9iZW5pdXMgbm9ybSBvZlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9iJDMoYSkge1xuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikgKyBNYXRoLnBvdyhhWzRdLCAyKSArIE1hdGgucG93KGFbNV0sIDIpICsgTWF0aC5wb3coYVs2XSwgMikgKyBNYXRoLnBvdyhhWzddLCAyKSArIE1hdGgucG93KGFbOF0sIDIpICsgTWF0aC5wb3coYVs5XSwgMikgKyBNYXRoLnBvdyhhWzEwXSwgMikgKyBNYXRoLnBvdyhhWzExXSwgMikgKyBNYXRoLnBvdyhhWzEyXSwgMikgKyBNYXRoLnBvdyhhWzEzXSwgMikgKyBNYXRoLnBvdyhhWzE0XSwgMikgKyBNYXRoLnBvdyhhWzE1XSwgMikpO1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byBtYXQ0J3NcbiAgICpcbiAgICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAgICogQHBhcmFtIHttYXQ0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7bWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBhZGQkMyhvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdICsgYlszXTtcbiAgICBvdXRbNF0gPSBhWzRdICsgYls0XTtcbiAgICBvdXRbNV0gPSBhWzVdICsgYls1XTtcbiAgICBvdXRbNl0gPSBhWzZdICsgYls2XTtcbiAgICBvdXRbN10gPSBhWzddICsgYls3XTtcbiAgICBvdXRbOF0gPSBhWzhdICsgYls4XTtcbiAgICBvdXRbOV0gPSBhWzldICsgYls5XTtcbiAgICBvdXRbMTBdID0gYVsxMF0gKyBiWzEwXTtcbiAgICBvdXRbMTFdID0gYVsxMV0gKyBiWzExXTtcbiAgICBvdXRbMTJdID0gYVsxMl0gKyBiWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM10gKyBiWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF0gKyBiWzE0XTtcbiAgICBvdXRbMTVdID0gYVsxNV0gKyBiWzE1XTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgbWF0cml4IGIgZnJvbSBtYXRyaXggYVxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN1YnRyYWN0JDMob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAtIGJbM107XG4gICAgb3V0WzRdID0gYVs0XSAtIGJbNF07XG4gICAgb3V0WzVdID0gYVs1XSAtIGJbNV07XG4gICAgb3V0WzZdID0gYVs2XSAtIGJbNl07XG4gICAgb3V0WzddID0gYVs3XSAtIGJbN107XG4gICAgb3V0WzhdID0gYVs4XSAtIGJbOF07XG4gICAgb3V0WzldID0gYVs5XSAtIGJbOV07XG4gICAgb3V0WzEwXSA9IGFbMTBdIC0gYlsxMF07XG4gICAgb3V0WzExXSA9IGFbMTFdIC0gYlsxMV07XG4gICAgb3V0WzEyXSA9IGFbMTJdIC0gYlsxMl07XG4gICAgb3V0WzEzXSA9IGFbMTNdIC0gYlsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdIC0gYlsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdIC0gYlsxNV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gICAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHNjYWxlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgbWF0cml4J3MgZWxlbWVudHMgYnlcbiAgICogQHJldHVybnMge21hdDR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseVNjYWxhciQzKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIG91dFs0XSA9IGFbNF0gKiBiO1xuICAgIG91dFs1XSA9IGFbNV0gKiBiO1xuICAgIG91dFs2XSA9IGFbNl0gKiBiO1xuICAgIG91dFs3XSA9IGFbN10gKiBiO1xuICAgIG91dFs4XSA9IGFbOF0gKiBiO1xuICAgIG91dFs5XSA9IGFbOV0gKiBiO1xuICAgIG91dFsxMF0gPSBhWzEwXSAqIGI7XG4gICAgb3V0WzExXSA9IGFbMTFdICogYjtcbiAgICBvdXRbMTJdID0gYVsxMl0gKiBiO1xuICAgIG91dFsxM10gPSBhWzEzXSAqIGI7XG4gICAgb3V0WzE0XSA9IGFbMTRdICogYjtcbiAgICBvdXRbMTVdID0gYVsxNV0gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIG1hdDQncyBhZnRlciBtdWx0aXBseWluZyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHttYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiJ3MgZWxlbWVudHMgYnkgYmVmb3JlIGFkZGluZ1xuICAgKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5U2NhbGFyQW5kQWRkJDMob3V0LCBhLCBiLCBzY2FsZSkge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdICogc2NhbGU7XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV0gKiBzY2FsZTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXSAqIHNjYWxlO1xuICAgIG91dFszXSA9IGFbM10gKyBiWzNdICogc2NhbGU7XG4gICAgb3V0WzRdID0gYVs0XSArIGJbNF0gKiBzY2FsZTtcbiAgICBvdXRbNV0gPSBhWzVdICsgYls1XSAqIHNjYWxlO1xuICAgIG91dFs2XSA9IGFbNl0gKyBiWzZdICogc2NhbGU7XG4gICAgb3V0WzddID0gYVs3XSArIGJbN10gKiBzY2FsZTtcbiAgICBvdXRbOF0gPSBhWzhdICsgYls4XSAqIHNjYWxlO1xuICAgIG91dFs5XSA9IGFbOV0gKyBiWzldICogc2NhbGU7XG4gICAgb3V0WzEwXSA9IGFbMTBdICsgYlsxMF0gKiBzY2FsZTtcbiAgICBvdXRbMTFdID0gYVsxMV0gKyBiWzExXSAqIHNjYWxlO1xuICAgIG91dFsxMl0gPSBhWzEyXSArIGJbMTJdICogc2NhbGU7XG4gICAgb3V0WzEzXSA9IGFbMTNdICsgYlsxM10gKiBzY2FsZTtcbiAgICBvdXRbMTRdID0gYVsxNF0gKyBiWzE0XSAqIHNjYWxlO1xuICAgIG91dFsxNV0gPSBhWzE1XSArIGJbMTVdICogc2NhbGU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbWF0cmljZXMgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICAgKlxuICAgKiBAcGFyYW0ge21hdDR9IGEgVGhlIGZpcnN0IG1hdHJpeC5cbiAgICogQHBhcmFtIHttYXQ0fSBiIFRoZSBzZWNvbmQgbWF0cml4LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWF0cmljZXMgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGV4YWN0RXF1YWxzJDMoYSwgYikge1xuICAgIHJldHVybiBhWzBdID09PSBiWzBdICYmIGFbMV0gPT09IGJbMV0gJiYgYVsyXSA9PT0gYlsyXSAmJiBhWzNdID09PSBiWzNdICYmIGFbNF0gPT09IGJbNF0gJiYgYVs1XSA9PT0gYls1XSAmJiBhWzZdID09PSBiWzZdICYmIGFbN10gPT09IGJbN10gJiYgYVs4XSA9PT0gYls4XSAmJiBhWzldID09PSBiWzldICYmIGFbMTBdID09PSBiWzEwXSAmJiBhWzExXSA9PT0gYlsxMV0gJiYgYVsxMl0gPT09IGJbMTJdICYmIGFbMTNdID09PSBiWzEzXSAmJiBhWzE0XSA9PT0gYlsxNF0gJiYgYVsxNV0gPT09IGJbMTVdO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBtYXRyaWNlcyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7bWF0NH0gYSBUaGUgZmlyc3QgbWF0cml4LlxuICAgKiBAcGFyYW0ge21hdDR9IGIgVGhlIHNlY29uZCBtYXRyaXguXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXF1YWxzJDQoYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM107XG4gICAgdmFyIGE0ID0gYVs0XSxcbiAgICAgICAgYTUgPSBhWzVdLFxuICAgICAgICBhNiA9IGFbNl0sXG4gICAgICAgIGE3ID0gYVs3XTtcbiAgICB2YXIgYTggPSBhWzhdLFxuICAgICAgICBhOSA9IGFbOV0sXG4gICAgICAgIGExMCA9IGFbMTBdLFxuICAgICAgICBhMTEgPSBhWzExXTtcbiAgICB2YXIgYTEyID0gYVsxMl0sXG4gICAgICAgIGExMyA9IGFbMTNdLFxuICAgICAgICBhMTQgPSBhWzE0XSxcbiAgICAgICAgYTE1ID0gYVsxNV07XG4gICAgdmFyIGIwID0gYlswXSxcbiAgICAgICAgYjEgPSBiWzFdLFxuICAgICAgICBiMiA9IGJbMl0sXG4gICAgICAgIGIzID0gYlszXTtcbiAgICB2YXIgYjQgPSBiWzRdLFxuICAgICAgICBiNSA9IGJbNV0sXG4gICAgICAgIGI2ID0gYls2XSxcbiAgICAgICAgYjcgPSBiWzddO1xuICAgIHZhciBiOCA9IGJbOF0sXG4gICAgICAgIGI5ID0gYls5XSxcbiAgICAgICAgYjEwID0gYlsxMF0sXG4gICAgICAgIGIxMSA9IGJbMTFdO1xuICAgIHZhciBiMTIgPSBiWzEyXSxcbiAgICAgICAgYjEzID0gYlsxM10sXG4gICAgICAgIGIxNCA9IGJbMTRdLFxuICAgICAgICBiMTUgPSBiWzE1XTtcbiAgICByZXR1cm4gTWF0aC5hYnMoYTAgLSBiMCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmIE1hdGguYWJzKGExIC0gYjEpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKSAmJiBNYXRoLmFicyhhMiAtIGIyKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMiksIE1hdGguYWJzKGIyKSkgJiYgTWF0aC5hYnMoYTMgLSBiMykgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTMpLCBNYXRoLmFicyhiMykpICYmIE1hdGguYWJzKGE0IC0gYjQpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE0KSwgTWF0aC5hYnMoYjQpKSAmJiBNYXRoLmFicyhhNSAtIGI1KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNSksIE1hdGguYWJzKGI1KSkgJiYgTWF0aC5hYnMoYTYgLSBiNikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTYpLCBNYXRoLmFicyhiNikpICYmIE1hdGguYWJzKGE3IC0gYjcpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE3KSwgTWF0aC5hYnMoYjcpKSAmJiBNYXRoLmFicyhhOCAtIGI4KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhOCksIE1hdGguYWJzKGI4KSkgJiYgTWF0aC5hYnMoYTkgLSBiOSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTkpLCBNYXRoLmFicyhiOSkpICYmIE1hdGguYWJzKGExMCAtIGIxMCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEwKSwgTWF0aC5hYnMoYjEwKSkgJiYgTWF0aC5hYnMoYTExIC0gYjExKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTEpLCBNYXRoLmFicyhiMTEpKSAmJiBNYXRoLmFicyhhMTIgLSBiMTIpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExMiksIE1hdGguYWJzKGIxMikpICYmIE1hdGguYWJzKGExMyAtIGIxMykgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEzKSwgTWF0aC5hYnMoYjEzKSkgJiYgTWF0aC5hYnMoYTE0IC0gYjE0KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMTQpLCBNYXRoLmFicyhiMTQpKSAmJiBNYXRoLmFicyhhMTUgLSBiMTUpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExNSksIE1hdGguYWJzKGIxNSkpO1xuICB9XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDQubXVsdGlwbHl9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbXVsJDMgPSBtdWx0aXBseSQzO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayBtYXQ0LnN1YnRyYWN0fVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHN1YiQzID0gc3VidHJhY3QkMztcblxuICB2YXIgbWF0NCA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQzLFxuICAgIGNsb25lOiBjbG9uZSQzLFxuICAgIGNvcHk6IGNvcHkkMyxcbiAgICBmcm9tVmFsdWVzOiBmcm9tVmFsdWVzJDMsXG4gICAgc2V0OiBzZXQkMyxcbiAgICBpZGVudGl0eTogaWRlbnRpdHkkMyxcbiAgICB0cmFuc3Bvc2U6IHRyYW5zcG9zZSQyLFxuICAgIGludmVydDogaW52ZXJ0JDMsXG4gICAgYWRqb2ludDogYWRqb2ludCQyLFxuICAgIGRldGVybWluYW50OiBkZXRlcm1pbmFudCQzLFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSQzLFxuICAgIHRyYW5zbGF0ZTogdHJhbnNsYXRlJDIsXG4gICAgc2NhbGU6IHNjYWxlJDMsXG4gICAgcm90YXRlOiByb3RhdGUkMyxcbiAgICByb3RhdGVYOiByb3RhdGVYLFxuICAgIHJvdGF0ZVk6IHJvdGF0ZVksXG4gICAgcm90YXRlWjogcm90YXRlWixcbiAgICBmcm9tVHJhbnNsYXRpb246IGZyb21UcmFuc2xhdGlvbiQyLFxuICAgIGZyb21TY2FsaW5nOiBmcm9tU2NhbGluZyQzLFxuICAgIGZyb21Sb3RhdGlvbjogZnJvbVJvdGF0aW9uJDMsXG4gICAgZnJvbVhSb3RhdGlvbjogZnJvbVhSb3RhdGlvbixcbiAgICBmcm9tWVJvdGF0aW9uOiBmcm9tWVJvdGF0aW9uLFxuICAgIGZyb21aUm90YXRpb246IGZyb21aUm90YXRpb24sXG4gICAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb246IGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uLFxuICAgIGZyb21RdWF0MjogZnJvbVF1YXQyLFxuICAgIGdldFRyYW5zbGF0aW9uOiBnZXRUcmFuc2xhdGlvbixcbiAgICBnZXRTY2FsaW5nOiBnZXRTY2FsaW5nLFxuICAgIGdldFJvdGF0aW9uOiBnZXRSb3RhdGlvbixcbiAgICBmcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlOiBmcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlLFxuICAgIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGVPcmlnaW46IGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGVPcmlnaW4sXG4gICAgZnJvbVF1YXQ6IGZyb21RdWF0JDEsXG4gICAgZnJ1c3R1bTogZnJ1c3R1bSxcbiAgICBwZXJzcGVjdGl2ZTogcGVyc3BlY3RpdmUsXG4gICAgcGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXc6IHBlcnNwZWN0aXZlRnJvbUZpZWxkT2ZWaWV3LFxuICAgIG9ydGhvOiBvcnRobyxcbiAgICBsb29rQXQ6IGxvb2tBdCxcbiAgICB0YXJnZXRUbzogdGFyZ2V0VG8sXG4gICAgc3RyOiBzdHIkMyxcbiAgICBmcm9iOiBmcm9iJDMsXG4gICAgYWRkOiBhZGQkMyxcbiAgICBzdWJ0cmFjdDogc3VidHJhY3QkMyxcbiAgICBtdWx0aXBseVNjYWxhcjogbXVsdGlwbHlTY2FsYXIkMyxcbiAgICBtdWx0aXBseVNjYWxhckFuZEFkZDogbXVsdGlwbHlTY2FsYXJBbmRBZGQkMyxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMkMyxcbiAgICBlcXVhbHM6IGVxdWFscyQ0LFxuICAgIG11bDogbXVsJDMsXG4gICAgc3ViOiBzdWIkM1xuICB9KTtcblxuICAvKipcbiAgICogMyBEaW1lbnNpb25hbCBWZWN0b3JcbiAgICogQG1vZHVsZSB2ZWMzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWMzXG4gICAqXG4gICAqIEByZXR1cm5zIHt2ZWMzfSBhIG5ldyAzRCB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlJDQoKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDMpO1xuXG4gICAgaWYgKEFSUkFZX1RZUEUgIT0gRmxvYXQzMkFycmF5KSB7XG4gICAgICBvdXRbMF0gPSAwO1xuICAgICAgb3V0WzFdID0gMDtcbiAgICAgIG91dFsyXSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB2ZWMzIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgdmVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gY2xvbmVcbiAgICogQHJldHVybnMge3ZlYzN9IGEgbmV3IDNEIHZlY3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBjbG9uZSQ0KGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEFSUkFZX1RZUEUoMyk7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgdmVjM1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAgICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAgICovXG5cbiAgZnVuY3Rpb24gbGVuZ3RoKGEpIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIHZhciB6ID0gYVsyXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdmVjMyBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAgICogQHJldHVybnMge3ZlYzN9IGEgbmV3IDNEIHZlY3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tVmFsdWVzJDQoeCwgeSwgeikge1xuICAgIHZhciBvdXQgPSBuZXcgQVJSQVlfVFlQRSgzKTtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgdmVjMyB0byBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgc291cmNlIHZlY3RvclxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvcHkkNChvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMzIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzZXQkNChvdXQsIHgsIHksIHopIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byB2ZWMzJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBhZGQkNChvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgdmVjdG9yIGIgZnJvbSB2ZWN0b3IgYVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN1YnRyYWN0JDQob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbGllcyB0d28gdmVjMydzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbXVsdGlwbHkkNChvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICogYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICogYlsyXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBEaXZpZGVzIHR3byB2ZWMzJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBkaXZpZGUob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAvIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAvIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAvIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTWF0aC5jZWlsIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjM1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGNlaWxcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBjZWlsKG91dCwgYSkge1xuICAgIG91dFswXSA9IE1hdGguY2VpbChhWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLmNlaWwoYVsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5jZWlsKGFbMl0pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE1hdGguZmxvb3IgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gZmxvb3JcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBmbG9vcihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBNYXRoLmZsb29yKGFbMF0pO1xuICAgIG91dFsxXSA9IE1hdGguZmxvb3IoYVsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5mbG9vcihhWzJdKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG9mIHR3byB2ZWMzJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtaW4ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5taW4oYVsyXSwgYlsyXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBvZiB0d28gdmVjMydzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbWF4KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE1hdGgucm91bmQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gcm91bmRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3VuZChvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBNYXRoLnJvdW5kKGFbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgucm91bmQoYVsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5yb3VuZChhWzJdKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTY2FsZXMgYSB2ZWMzIGJ5IGEgc2NhbGFyIG51bWJlclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICAgKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieVxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNjYWxlJDQob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGI7XG4gICAgb3V0WzFdID0gYVsxXSAqIGI7XG4gICAgb3V0WzJdID0gYVsyXSAqIGI7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQWRkcyB0d28gdmVjMydzIGFmdGVyIHNjYWxpbmcgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSB0aGUgYW1vdW50IHRvIHNjYWxlIGIgYnkgYmVmb3JlIGFkZGluZ1xuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNjYWxlQW5kQWRkKG91dCwgYSwgYiwgc2NhbGUpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl0gKiBzY2FsZTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMydzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgKi9cblxuICBmdW5jdGlvbiBkaXN0YW5jZShhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXTtcbiAgICB2YXIgeSA9IGJbMV0gLSBhWzFdO1xuICAgIHZhciB6ID0gYlsyXSAtIGFbMl07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICovXG5cbiAgZnVuY3Rpb24gc3F1YXJlZERpc3RhbmNlKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdO1xuICAgIHZhciB5ID0gYlsxXSAtIGFbMV07XG4gICAgdmFyIHogPSBiWzJdIC0gYVsyXTtcbiAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHZlYzNcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBjYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2ZcbiAgICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICAgKi9cblxuICBmdW5jdGlvbiBzcXVhcmVkTGVuZ3RoKGEpIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIHZhciB6ID0gYVsyXTtcbiAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6O1xuICB9XG4gIC8qKlxuICAgKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjM1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG5lZ2F0ZShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjM1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGludmVydFxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGludmVyc2Uob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gMS4wIC8gYVswXTtcbiAgICBvdXRbMV0gPSAxLjAgLyBhWzFdO1xuICAgIG91dFsyXSA9IDEuMCAvIGFbMl07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTm9ybWFsaXplIGEgdmVjM1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIG5vcm1hbGl6ZVxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIHZhciB6ID0gYVsyXTtcbiAgICB2YXIgbGVuID0geCAqIHggKyB5ICogeSArIHogKiB6O1xuXG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/XG4gICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XG4gICAgfVxuXG4gICAgb3V0WzBdID0gYVswXSAqIGxlbjtcbiAgICBvdXRbMV0gPSBhWzFdICogbGVuO1xuICAgIG91dFsyXSA9IGFbMl0gKiBsZW47XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXTtcbiAgfVxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNyb3NzKG91dCwgYSwgYikge1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXSxcbiAgICAgICAgYXogPSBhWzJdO1xuICAgIHZhciBieCA9IGJbMF0sXG4gICAgICAgIGJ5ID0gYlsxXSxcbiAgICAgICAgYnogPSBiWzJdO1xuICAgIG91dFswXSA9IGF5ICogYnogLSBheiAqIGJ5O1xuICAgIG91dFsxXSA9IGF6ICogYnggLSBheCAqIGJ6O1xuICAgIG91dFsyXSA9IGF4ICogYnkgLSBheSAqIGJ4O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjMydzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50LCBpbiB0aGUgcmFuZ2UgWzAtMV0sIGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBsZXJwKG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF07XG4gICAgdmFyIGF5ID0gYVsxXTtcbiAgICB2YXIgYXogPSBhWzJdO1xuICAgIG91dFswXSA9IGF4ICsgdCAqIChiWzBdIC0gYXgpO1xuICAgIG91dFsxXSA9IGF5ICsgdCAqIChiWzFdIC0gYXkpO1xuICAgIG91dFsyXSA9IGF6ICsgdCAqIChiWzJdIC0gYXopO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgaGVybWl0ZSBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYyB0aGUgdGhpcmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzN9IGQgdGhlIGZvdXJ0aCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50LCBpbiB0aGUgcmFuZ2UgWzAtMV0sIGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBoZXJtaXRlKG91dCwgYSwgYiwgYywgZCwgdCkge1xuICAgIHZhciBmYWN0b3JUaW1lczIgPSB0ICogdDtcbiAgICB2YXIgZmFjdG9yMSA9IGZhY3RvclRpbWVzMiAqICgyICogdCAtIDMpICsgMTtcbiAgICB2YXIgZmFjdG9yMiA9IGZhY3RvclRpbWVzMiAqICh0IC0gMikgKyB0O1xuICAgIHZhciBmYWN0b3IzID0gZmFjdG9yVGltZXMyICogKHQgLSAxKTtcbiAgICB2YXIgZmFjdG9yNCA9IGZhY3RvclRpbWVzMiAqICgzIC0gMiAqIHQpO1xuICAgIG91dFswXSA9IGFbMF0gKiBmYWN0b3IxICsgYlswXSAqIGZhY3RvcjIgKyBjWzBdICogZmFjdG9yMyArIGRbMF0gKiBmYWN0b3I0O1xuICAgIG91dFsxXSA9IGFbMV0gKiBmYWN0b3IxICsgYlsxXSAqIGZhY3RvcjIgKyBjWzFdICogZmFjdG9yMyArIGRbMV0gKiBmYWN0b3I0O1xuICAgIG91dFsyXSA9IGFbMl0gKiBmYWN0b3IxICsgYlsyXSAqIGZhY3RvcjIgKyBjWzJdICogZmFjdG9yMyArIGRbMl0gKiBmYWN0b3I0O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgYmV6aWVyIGludGVycG9sYXRpb24gd2l0aCB0d28gY29udHJvbCBwb2ludHNcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMzfSBjIHRoZSB0aGlyZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gZCB0aGUgZm91cnRoIG9wZXJhbmRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQsIGluIHRoZSByYW5nZSBbMC0xXSwgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJlemllcihvdXQsIGEsIGIsIGMsIGQsIHQpIHtcbiAgICB2YXIgaW52ZXJzZUZhY3RvciA9IDEgLSB0O1xuICAgIHZhciBpbnZlcnNlRmFjdG9yVGltZXNUd28gPSBpbnZlcnNlRmFjdG9yICogaW52ZXJzZUZhY3RvcjtcbiAgICB2YXIgZmFjdG9yVGltZXMyID0gdCAqIHQ7XG4gICAgdmFyIGZhY3RvcjEgPSBpbnZlcnNlRmFjdG9yVGltZXNUd28gKiBpbnZlcnNlRmFjdG9yO1xuICAgIHZhciBmYWN0b3IyID0gMyAqIHQgKiBpbnZlcnNlRmFjdG9yVGltZXNUd287XG4gICAgdmFyIGZhY3RvcjMgPSAzICogZmFjdG9yVGltZXMyICogaW52ZXJzZUZhY3RvcjtcbiAgICB2YXIgZmFjdG9yNCA9IGZhY3RvclRpbWVzMiAqIHQ7XG4gICAgb3V0WzBdID0gYVswXSAqIGZhY3RvcjEgKyBiWzBdICogZmFjdG9yMiArIGNbMF0gKiBmYWN0b3IzICsgZFswXSAqIGZhY3RvcjQ7XG4gICAgb3V0WzFdID0gYVsxXSAqIGZhY3RvcjEgKyBiWzFdICogZmFjdG9yMiArIGNbMV0gKiBmYWN0b3IzICsgZFsxXSAqIGZhY3RvcjQ7XG4gICAgb3V0WzJdID0gYVsyXSAqIGZhY3RvcjEgKyBiWzJdICogZmFjdG9yMiArIGNbMl0gKiBmYWN0b3IzICsgZFsyXSAqIGZhY3RvcjQ7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgcmFuZG9tIHZlY3RvciB3aXRoIHRoZSBnaXZlbiBzY2FsZVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXSBMZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3IuIElmIG9tbWl0dGVkLCBhIHVuaXQgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWRcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByYW5kb20ob3V0LCBzY2FsZSkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuICAgIHZhciByID0gUkFORE9NKCkgKiAyLjAgKiBNYXRoLlBJO1xuICAgIHZhciB6ID0gUkFORE9NKCkgKiAyLjAgLSAxLjA7XG4gICAgdmFyIHpTY2FsZSA9IE1hdGguc3FydCgxLjAgLSB6ICogeikgKiBzY2FsZTtcbiAgICBvdXRbMF0gPSBNYXRoLmNvcyhyKSAqIHpTY2FsZTtcbiAgICBvdXRbMV0gPSBNYXRoLnNpbihyKSAqIHpTY2FsZTtcbiAgICBvdXRbMl0gPSB6ICogc2NhbGU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMyB3aXRoIGEgbWF0NC5cbiAgICogNHRoIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMSdcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQ0KG91dCwgYSwgbSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdO1xuICAgIHZhciB3ID0gbVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdO1xuICAgIHcgPSB3IHx8IDEuMDtcbiAgICBvdXRbMF0gPSAobVswXSAqIHggKyBtWzRdICogeSArIG1bOF0gKiB6ICsgbVsxMl0pIC8gdztcbiAgICBvdXRbMV0gPSAobVsxXSAqIHggKyBtWzVdICogeSArIG1bOV0gKiB6ICsgbVsxM10pIC8gdztcbiAgICBvdXRbMl0gPSAobVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdKSAvIHc7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMyB3aXRoIGEgbWF0My5cbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7bWF0M30gbSB0aGUgM3gzIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDMob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl07XG4gICAgb3V0WzBdID0geCAqIG1bMF0gKyB5ICogbVszXSArIHogKiBtWzZdO1xuICAgIG91dFsxXSA9IHggKiBtWzFdICsgeSAqIG1bNF0gKyB6ICogbVs3XTtcbiAgICBvdXRbMl0gPSB4ICogbVsyXSArIHkgKiBtWzVdICsgeiAqIG1bOF07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMyB3aXRoIGEgcXVhdFxuICAgKiBDYW4gYWxzbyBiZSB1c2VkIGZvciBkdWFsIHF1YXRlcm5pb25zLiAoTXVsdGlwbHkgaXQgd2l0aCB0aGUgcmVhbCBwYXJ0KVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAgICogQHBhcmFtIHtxdWF0fSBxIHF1YXRlcm5pb24gdG8gdHJhbnNmb3JtIHdpdGhcbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiB0cmFuc2Zvcm1RdWF0KG91dCwgYSwgcSkge1xuICAgIC8vIGJlbmNobWFya3M6IGh0dHBzOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXRyYW5zZm9ybS12ZWMzLWltcGxlbWVudGF0aW9ucy1maXhlZFxuICAgIHZhciBxeCA9IHFbMF0sXG4gICAgICAgIHF5ID0gcVsxXSxcbiAgICAgICAgcXogPSBxWzJdLFxuICAgICAgICBxdyA9IHFbM107XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl07IC8vIHZhciBxdmVjID0gW3F4LCBxeSwgcXpdO1xuICAgIC8vIHZhciB1diA9IHZlYzMuY3Jvc3MoW10sIHF2ZWMsIGEpO1xuXG4gICAgdmFyIHV2eCA9IHF5ICogeiAtIHF6ICogeSxcbiAgICAgICAgdXZ5ID0gcXogKiB4IC0gcXggKiB6LFxuICAgICAgICB1dnogPSBxeCAqIHkgLSBxeSAqIHg7IC8vIHZhciB1dXYgPSB2ZWMzLmNyb3NzKFtdLCBxdmVjLCB1dik7XG5cbiAgICB2YXIgdXV2eCA9IHF5ICogdXZ6IC0gcXogKiB1dnksXG4gICAgICAgIHV1dnkgPSBxeiAqIHV2eCAtIHF4ICogdXZ6LFxuICAgICAgICB1dXZ6ID0gcXggKiB1dnkgLSBxeSAqIHV2eDsgLy8gdmVjMy5zY2FsZSh1diwgdXYsIDIgKiB3KTtcblxuICAgIHZhciB3MiA9IHF3ICogMjtcbiAgICB1dnggKj0gdzI7XG4gICAgdXZ5ICo9IHcyO1xuICAgIHV2eiAqPSB3MjsgLy8gdmVjMy5zY2FsZSh1dXYsIHV1diwgMik7XG5cbiAgICB1dXZ4ICo9IDI7XG4gICAgdXV2eSAqPSAyO1xuICAgIHV1dnogKj0gMjsgLy8gcmV0dXJuIHZlYzMuYWRkKG91dCwgYSwgdmVjMy5hZGQob3V0LCB1diwgdXV2KSk7XG5cbiAgICBvdXRbMF0gPSB4ICsgdXZ4ICsgdXV2eDtcbiAgICBvdXRbMV0gPSB5ICsgdXZ5ICsgdXV2eTtcbiAgICBvdXRbMl0gPSB6ICsgdXZ6ICsgdXV2ejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGUgYSAzRCB2ZWN0b3IgYXJvdW5kIHRoZSB4LWF4aXNcbiAgICogQHBhcmFtIHt2ZWMzfSBvdXQgVGhlIHJlY2VpdmluZyB2ZWMzXG4gICAqIEBwYXJhbSB7dmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAgICogQHBhcmFtIHt2ZWMzfSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjIFRoZSBhbmdsZSBvZiByb3RhdGlvblxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVgkMShvdXQsIGEsIGIsIGMpIHtcbiAgICB2YXIgcCA9IFtdLFxuICAgICAgICByID0gW107IC8vVHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cblxuICAgIHBbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBwWzFdID0gYVsxXSAtIGJbMV07XG4gICAgcFsyXSA9IGFbMl0gLSBiWzJdOyAvL3BlcmZvcm0gcm90YXRpb25cblxuICAgIHJbMF0gPSBwWzBdO1xuICAgIHJbMV0gPSBwWzFdICogTWF0aC5jb3MoYykgLSBwWzJdICogTWF0aC5zaW4oYyk7XG4gICAgclsyXSA9IHBbMV0gKiBNYXRoLnNpbihjKSArIHBbMl0gKiBNYXRoLmNvcyhjKTsgLy90cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuXG4gICAgb3V0WzBdID0gclswXSArIGJbMF07XG4gICAgb3V0WzFdID0gclsxXSArIGJbMV07XG4gICAgb3V0WzJdID0gclsyXSArIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgeS1heGlzXG4gICAqIEBwYXJhbSB7dmVjM30gb3V0IFRoZSByZWNlaXZpbmcgdmVjM1xuICAgKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIHZlYzMgcG9pbnQgdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7dmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgKiBAcGFyYW0ge051bWJlcn0gYyBUaGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQHJldHVybnMge3ZlYzN9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVZJDEob3V0LCBhLCBiLCBjKSB7XG4gICAgdmFyIHAgPSBbXSxcbiAgICAgICAgciA9IFtdOyAvL1RyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG5cbiAgICBwWzBdID0gYVswXSAtIGJbMF07XG4gICAgcFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgIHBbMl0gPSBhWzJdIC0gYlsyXTsgLy9wZXJmb3JtIHJvdGF0aW9uXG5cbiAgICByWzBdID0gcFsyXSAqIE1hdGguc2luKGMpICsgcFswXSAqIE1hdGguY29zKGMpO1xuICAgIHJbMV0gPSBwWzFdO1xuICAgIHJbMl0gPSBwWzJdICogTWF0aC5jb3MoYykgLSBwWzBdICogTWF0aC5zaW4oYyk7IC8vdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cblxuICAgIG91dFswXSA9IHJbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IHJbMV0gKyBiWzFdO1xuICAgIG91dFsyXSA9IHJbMl0gKyBiWzJdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJvdGF0ZSBhIDNEIHZlY3RvciBhcm91bmQgdGhlIHotYXhpc1xuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCBUaGUgcmVjZWl2aW5nIHZlYzNcbiAgICogQHBhcmFtIHt2ZWMzfSBhIFRoZSB2ZWMzIHBvaW50IHRvIHJvdGF0ZVxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgVGhlIG9yaWdpbiBvZiB0aGUgcm90YXRpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGMgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gICAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcm90YXRlWiQxKG91dCwgYSwgYiwgYykge1xuICAgIHZhciBwID0gW10sXG4gICAgICAgIHIgPSBbXTsgLy9UcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuXG4gICAgcFswXSA9IGFbMF0gLSBiWzBdO1xuICAgIHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICBwWzJdID0gYVsyXSAtIGJbMl07IC8vcGVyZm9ybSByb3RhdGlvblxuXG4gICAgclswXSA9IHBbMF0gKiBNYXRoLmNvcyhjKSAtIHBbMV0gKiBNYXRoLnNpbihjKTtcbiAgICByWzFdID0gcFswXSAqIE1hdGguc2luKGMpICsgcFsxXSAqIE1hdGguY29zKGMpO1xuICAgIHJbMl0gPSBwWzJdOyAvL3RyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG5cbiAgICBvdXRbMF0gPSByWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSByWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSByWzJdICsgYlsyXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIDNEIHZlY3RvcnNcbiAgICogQHBhcmFtIHt2ZWMzfSBhIFRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjM30gYiBUaGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIGFuZ2xlIGluIHJhZGlhbnNcbiAgICovXG5cbiAgZnVuY3Rpb24gYW5nbGUoYSwgYikge1xuICAgIHZhciB0ZW1wQSA9IGZyb21WYWx1ZXMkNChhWzBdLCBhWzFdLCBhWzJdKTtcbiAgICB2YXIgdGVtcEIgPSBmcm9tVmFsdWVzJDQoYlswXSwgYlsxXSwgYlsyXSk7XG4gICAgbm9ybWFsaXplKHRlbXBBLCB0ZW1wQSk7XG4gICAgbm9ybWFsaXplKHRlbXBCLCB0ZW1wQik7XG4gICAgdmFyIGNvc2luZSA9IGRvdCh0ZW1wQSwgdGVtcEIpO1xuXG4gICAgaWYgKGNvc2luZSA+IDEuMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChjb3NpbmUgPCAtMS4wKSB7XG4gICAgICByZXR1cm4gTWF0aC5QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGguYWNvcyhjb3NpbmUpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBzdHIkNChhKSB7XG4gICAgcmV0dXJuICd2ZWMzKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcpJztcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9ycyBoYXZlIGV4YWN0bHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24gKHdoZW4gY29tcGFyZWQgd2l0aCA9PT0pXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjM30gYSBUaGUgZmlyc3QgdmVjdG9yLlxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgVGhlIHNlY29uZCB2ZWN0b3IuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBleGFjdEVxdWFscyQ0KGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdICYmIGFbMl0gPT09IGJbMl07XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHZlY3RvcnMgaGF2ZSBhcHByb3hpbWF0ZWx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIGZpcnN0IHZlY3Rvci5cbiAgICogQHBhcmFtIHt2ZWMzfSBiIFRoZSBzZWNvbmQgdmVjdG9yLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmVjdG9ycyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXF1YWxzJDUoYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdO1xuICAgIHZhciBiMCA9IGJbMF0sXG4gICAgICAgIGIxID0gYlsxXSxcbiAgICAgICAgYjIgPSBiWzJdO1xuICAgIHJldHVybiBNYXRoLmFicyhhMCAtIGIwKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMCksIE1hdGguYWJzKGIwKSkgJiYgTWF0aC5hYnMoYTEgLSBiMSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEpLCBNYXRoLmFicyhiMSkpICYmIE1hdGguYWJzKGEyIC0gYjIpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEyKSwgTWF0aC5hYnMoYjIpKTtcbiAgfVxuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLnN1YnRyYWN0fVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHN1YiQ0ID0gc3VidHJhY3QkNDtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5tdWx0aXBseX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBtdWwkNCA9IG11bHRpcGx5JDQ7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuZGl2aWRlfVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIGRpdiA9IGRpdmlkZTtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5kaXN0YW5jZX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBkaXN0ID0gZGlzdGFuY2U7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuc3F1YXJlZERpc3RhbmNlfVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHNxckRpc3QgPSBzcXVhcmVkRGlzdGFuY2U7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMubGVuZ3RofVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIGxlbiA9IGxlbmd0aDtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5zcXVhcmVkTGVuZ3RofVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHNxckxlbiA9IHNxdWFyZWRMZW5ndGg7XG4gIC8qKlxuICAgKiBQZXJmb3JtIHNvbWUgb3BlcmF0aW9uIG92ZXIgYW4gYXJyYXkgb2YgdmVjM3MuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgTnVtYmVyIG9mIGVsZW1lbnRzIGJldHdlZW4gdGhlIHN0YXJ0IG9mIGVhY2ggdmVjMy4gSWYgMCBhc3N1bWVzIHRpZ2h0bHkgcGFja2VkXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWMzcyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB2ZWN0b3IgaW4gdGhlIGFycmF5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXJnXSBhZGRpdGlvbmFsIGFyZ3VtZW50IHRvIHBhc3MgdG8gZm5cbiAgICogQHJldHVybnMge0FycmF5fSBhXG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgZm9yRWFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmVjID0gY3JlYXRlJDQoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIHN0cmlkZSwgb2Zmc2V0LCBjb3VudCwgZm4sIGFyZykge1xuICAgICAgdmFyIGksIGw7XG5cbiAgICAgIGlmICghc3RyaWRlKSB7XG4gICAgICAgIHN0cmlkZSA9IDM7XG4gICAgICB9XG5cbiAgICAgIGlmICghb2Zmc2V0KSB7XG4gICAgICAgIG9mZnNldCA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb3VudCkge1xuICAgICAgICBsID0gTWF0aC5taW4oY291bnQgKiBzdHJpZGUgKyBvZmZzZXQsIGEubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGwgPSBhLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gb2Zmc2V0OyBpIDwgbDsgaSArPSBzdHJpZGUpIHtcbiAgICAgICAgdmVjWzBdID0gYVtpXTtcbiAgICAgICAgdmVjWzFdID0gYVtpICsgMV07XG4gICAgICAgIHZlY1syXSA9IGFbaSArIDJdO1xuICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgYVtpXSA9IHZlY1swXTtcbiAgICAgICAgYVtpICsgMV0gPSB2ZWNbMV07XG4gICAgICAgIGFbaSArIDJdID0gdmVjWzJdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYTtcbiAgICB9O1xuICB9KCk7XG5cbiAgdmFyIHZlYzMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgY3JlYXRlOiBjcmVhdGUkNCxcbiAgICBjbG9uZTogY2xvbmUkNCxcbiAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICBmcm9tVmFsdWVzOiBmcm9tVmFsdWVzJDQsXG4gICAgY29weTogY29weSQ0LFxuICAgIHNldDogc2V0JDQsXG4gICAgYWRkOiBhZGQkNCxcbiAgICBzdWJ0cmFjdDogc3VidHJhY3QkNCxcbiAgICBtdWx0aXBseTogbXVsdGlwbHkkNCxcbiAgICBkaXZpZGU6IGRpdmlkZSxcbiAgICBjZWlsOiBjZWlsLFxuICAgIGZsb29yOiBmbG9vcixcbiAgICBtaW46IG1pbixcbiAgICBtYXg6IG1heCxcbiAgICByb3VuZDogcm91bmQsXG4gICAgc2NhbGU6IHNjYWxlJDQsXG4gICAgc2NhbGVBbmRBZGQ6IHNjYWxlQW5kQWRkLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSxcbiAgICBzcXVhcmVkRGlzdGFuY2U6IHNxdWFyZWREaXN0YW5jZSxcbiAgICBzcXVhcmVkTGVuZ3RoOiBzcXVhcmVkTGVuZ3RoLFxuICAgIG5lZ2F0ZTogbmVnYXRlLFxuICAgIGludmVyc2U6IGludmVyc2UsXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUsXG4gICAgZG90OiBkb3QsXG4gICAgY3Jvc3M6IGNyb3NzLFxuICAgIGxlcnA6IGxlcnAsXG4gICAgaGVybWl0ZTogaGVybWl0ZSxcbiAgICBiZXppZXI6IGJlemllcixcbiAgICByYW5kb206IHJhbmRvbSxcbiAgICB0cmFuc2Zvcm1NYXQ0OiB0cmFuc2Zvcm1NYXQ0LFxuICAgIHRyYW5zZm9ybU1hdDM6IHRyYW5zZm9ybU1hdDMsXG4gICAgdHJhbnNmb3JtUXVhdDogdHJhbnNmb3JtUXVhdCxcbiAgICByb3RhdGVYOiByb3RhdGVYJDEsXG4gICAgcm90YXRlWTogcm90YXRlWSQxLFxuICAgIHJvdGF0ZVo6IHJvdGF0ZVokMSxcbiAgICBhbmdsZTogYW5nbGUsXG4gICAgc3RyOiBzdHIkNCxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMkNCxcbiAgICBlcXVhbHM6IGVxdWFscyQ1LFxuICAgIHN1Yjogc3ViJDQsXG4gICAgbXVsOiBtdWwkNCxcbiAgICBkaXY6IGRpdixcbiAgICBkaXN0OiBkaXN0LFxuICAgIHNxckRpc3Q6IHNxckRpc3QsXG4gICAgbGVuOiBsZW4sXG4gICAgc3FyTGVuOiBzcXJMZW4sXG4gICAgZm9yRWFjaDogZm9yRWFjaFxuICB9KTtcblxuICAvKipcbiAgICogNCBEaW1lbnNpb25hbCBWZWN0b3JcbiAgICogQG1vZHVsZSB2ZWM0XG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWM0XG4gICAqXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBhIG5ldyA0RCB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlJDUoKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDQpO1xuXG4gICAgaWYgKEFSUkFZX1RZUEUgIT0gRmxvYXQzMkFycmF5KSB7XG4gICAgICBvdXRbMF0gPSAwO1xuICAgICAgb3V0WzFdID0gMDtcbiAgICAgIG91dFsyXSA9IDA7XG4gICAgICBvdXRbM10gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdmVjNCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHZlY3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNsb25lXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBhIG5ldyA0RCB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUkNShhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB2ZWM0IGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0gdyBXIGNvbXBvbmVudFxuICAgKiBAcmV0dXJucyB7dmVjNH0gYSBuZXcgNEQgdmVjdG9yXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21WYWx1ZXMkNSh4LCB5LCB6LCB3KSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIG91dFszXSA9IHc7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHZlYzQgdG8gYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHNvdXJjZSB2ZWN0b3JcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBjb3B5JDUob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWM0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzZXQkNShvdXQsIHgsIHksIHosIHcpIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICBvdXRbM10gPSB3O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGFkZCQ1KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gKyBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyB2ZWN0b3IgYiBmcm9tIHZlY3RvciBhXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gc3VidHJhY3QkNShvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdIC0gYlszXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIHR3byB2ZWM0J3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBtdWx0aXBseSQ1KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gKiBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIERpdmlkZXMgdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGRpdmlkZSQxKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gLyBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gLyBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE1hdGguY2VpbCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBjZWlsXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY2VpbCQxKG91dCwgYSkge1xuICAgIG91dFswXSA9IE1hdGguY2VpbChhWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLmNlaWwoYVsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5jZWlsKGFbMl0pO1xuICAgIG91dFszXSA9IE1hdGguY2VpbChhWzNdKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBNYXRoLmZsb29yIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjNFxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGZsb29yXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZmxvb3IkMShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBNYXRoLmZsb29yKGFbMF0pO1xuICAgIG91dFsxXSA9IE1hdGguZmxvb3IoYVsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5mbG9vcihhWzJdKTtcbiAgICBvdXRbM10gPSBNYXRoLmZsb29yKGFbM10pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1pbmltdW0gb2YgdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG1pbiQxKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWluKGFbMl0sIGJbMl0pO1xuICAgIG91dFszXSA9IE1hdGgubWluKGFbM10sIGJbM10pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG1heCQxKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgIG91dFszXSA9IE1hdGgubWF4KGFbM10sIGJbM10pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE1hdGgucm91bmQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWM0XG4gICAqXG4gICAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gcm91bmRcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3VuZCQxKG91dCwgYSkge1xuICAgIG91dFswXSA9IE1hdGgucm91bmQoYVswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5yb3VuZChhWzFdKTtcbiAgICBvdXRbMl0gPSBNYXRoLnJvdW5kKGFbMl0pO1xuICAgIG91dFszXSA9IE1hdGgucm91bmQoYVszXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU2NhbGVzIGEgdmVjNCBieSBhIHNjYWxhciBudW1iZXJcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gc2NhbGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzY2FsZSQ1KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgdHdvIHZlYzQncyBhZnRlciBzY2FsaW5nIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciB2YWx1ZVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiIGJ5IGJlZm9yZSBhZGRpbmdcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzY2FsZUFuZEFkZCQxKG91dCwgYSwgYiwgc2NhbGUpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXSAqIHNjYWxlO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdICogc2NhbGU7XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl0gKiBzY2FsZTtcbiAgICBvdXRbM10gPSBhWzNdICsgYlszXSAqIHNjYWxlO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWM0J3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGRpc3RhbmNlJDEoYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF07XG4gICAgdmFyIHkgPSBiWzFdIC0gYVsxXTtcbiAgICB2YXIgeiA9IGJbMl0gLSBhWzJdO1xuICAgIHZhciB3ID0gYlszXSAtIGFbM107XG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICAgKi9cblxuICBmdW5jdGlvbiBzcXVhcmVkRGlzdGFuY2UkMShhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXTtcbiAgICB2YXIgeSA9IGJbMV0gLSBhWzFdO1xuICAgIHZhciB6ID0gYlsyXSAtIGFbMl07XG4gICAgdmFyIHcgPSBiWzNdIC0gYVszXTtcbiAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBjYWxjdWxhdGUgbGVuZ3RoIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGxlbmd0aCQxKGEpIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIHZhciB6ID0gYVsyXTtcbiAgICB2YXIgdyA9IGFbM107XG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdyk7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgdmVjNFxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGxlbmd0aCBvZiBhXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNxdWFyZWRMZW5ndGgkMShhKSB7XG4gICAgdmFyIHggPSBhWzBdO1xuICAgIHZhciB5ID0gYVsxXTtcbiAgICB2YXIgeiA9IGFbMl07XG4gICAgdmFyIHcgPSBhWzNdO1xuICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdztcbiAgfVxuICAvKipcbiAgICogTmVnYXRlcyB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBuZWdhdGVcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBuZWdhdGUkMShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICBvdXRbM10gPSAtYVszXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjNFxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGludmVydFxuICAgKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGludmVyc2UkMShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAxLjAgLyBhWzBdO1xuICAgIG91dFsxXSA9IDEuMCAvIGFbMV07XG4gICAgb3V0WzJdID0gMS4wIC8gYVsyXTtcbiAgICBvdXRbM10gPSAxLjAgLyBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSBhIHZlYzRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBub3JtYWxpemVcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBub3JtYWxpemUkMShvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIHZhciB6ID0gYVsyXTtcbiAgICB2YXIgdyA9IGFbM107XG4gICAgdmFyIGxlbiA9IHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3O1xuXG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSB4ICogbGVuO1xuICAgIG91dFsxXSA9IHkgKiBsZW47XG4gICAgb3V0WzJdID0geiAqIGxlbjtcbiAgICBvdXRbM10gPSB3ICogbGVuO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWM0J3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICAgKi9cblxuICBmdW5jdGlvbiBkb3QkMShhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXSArIGFbM10gKiBiWzNdO1xuICB9XG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHZlYzQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCwgaW4gdGhlIHJhbmdlIFswLTFdLCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbGVycCQxKG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF07XG4gICAgdmFyIGF5ID0gYVsxXTtcbiAgICB2YXIgYXogPSBhWzJdO1xuICAgIHZhciBhdyA9IGFbM107XG4gICAgb3V0WzBdID0gYXggKyB0ICogKGJbMF0gLSBheCk7XG4gICAgb3V0WzFdID0gYXkgKyB0ICogKGJbMV0gLSBheSk7XG4gICAgb3V0WzJdID0gYXogKyB0ICogKGJbMl0gLSBheik7XG4gICAgb3V0WzNdID0gYXcgKyB0ICogKGJbM10gLSBhdyk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgcmFuZG9tIHZlY3RvciB3aXRoIHRoZSBnaXZlbiBzY2FsZVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXSBMZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3IuIElmIG9tbWl0dGVkLCBhIHVuaXQgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWRcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByYW5kb20kMShvdXQsIHNjYWxlKSB7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7IC8vIE1hcnNhZ2xpYSwgR2VvcmdlLiBDaG9vc2luZyBhIFBvaW50IGZyb20gdGhlIFN1cmZhY2Ugb2YgYVxuICAgIC8vIFNwaGVyZS4gQW5uLiBNYXRoLiBTdGF0aXN0LiA0MyAoMTk3MiksIG5vLiAyLCA2NDUtLTY0Ni5cbiAgICAvLyBodHRwOi8vcHJvamVjdGV1Y2xpZC5vcmcvZXVjbGlkLmFvbXMvMTE3NzY5MjY0NDtcblxuICAgIHZhciB2MSwgdjIsIHYzLCB2NDtcbiAgICB2YXIgczEsIHMyO1xuXG4gICAgZG8ge1xuICAgICAgdjEgPSBSQU5ET00oKSAqIDIgLSAxO1xuICAgICAgdjIgPSBSQU5ET00oKSAqIDIgLSAxO1xuICAgICAgczEgPSB2MSAqIHYxICsgdjIgKiB2MjtcbiAgICB9IHdoaWxlIChzMSA+PSAxKTtcblxuICAgIGRvIHtcbiAgICAgIHYzID0gUkFORE9NKCkgKiAyIC0gMTtcbiAgICAgIHY0ID0gUkFORE9NKCkgKiAyIC0gMTtcbiAgICAgIHMyID0gdjMgKiB2MyArIHY0ICogdjQ7XG4gICAgfSB3aGlsZSAoczIgPj0gMSk7XG5cbiAgICB2YXIgZCA9IE1hdGguc3FydCgoMSAtIHMxKSAvIHMyKTtcbiAgICBvdXRbMF0gPSBzY2FsZSAqIHYxO1xuICAgIG91dFsxXSA9IHNjYWxlICogdjI7XG4gICAgb3V0WzJdID0gc2NhbGUgKiB2MyAqIGQ7XG4gICAgb3V0WzNdID0gc2NhbGUgKiB2NCAqIGQ7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjNCB3aXRoIGEgbWF0NC5cbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAgICogQHJldHVybnMge3ZlYzR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiB0cmFuc2Zvcm1NYXQ0JDEob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl0sXG4gICAgICAgIHcgPSBhWzNdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdICogeiArIG1bMTJdICogdztcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVs5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgb3V0WzJdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICBvdXRbM10gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIHF1YXRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7cXVhdH0gcSBxdWF0ZXJuaW9uIHRvIHRyYW5zZm9ybSB3aXRoXG4gICAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtUXVhdCQxKG91dCwgYSwgcSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdO1xuICAgIHZhciBxeCA9IHFbMF0sXG4gICAgICAgIHF5ID0gcVsxXSxcbiAgICAgICAgcXogPSBxWzJdLFxuICAgICAgICBxdyA9IHFbM107IC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXG5cbiAgICB2YXIgaXggPSBxdyAqIHggKyBxeSAqIHogLSBxeiAqIHk7XG4gICAgdmFyIGl5ID0gcXcgKiB5ICsgcXogKiB4IC0gcXggKiB6O1xuICAgIHZhciBpeiA9IHF3ICogeiArIHF4ICogeSAtIHF5ICogeDtcbiAgICB2YXIgaXcgPSAtcXggKiB4IC0gcXkgKiB5IC0gcXogKiB6OyAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XG5cbiAgICBvdXRbMF0gPSBpeCAqIHF3ICsgaXcgKiAtcXggKyBpeSAqIC1xeiAtIGl6ICogLXF5O1xuICAgIG91dFsxXSA9IGl5ICogcXcgKyBpdyAqIC1xeSArIGl6ICogLXF4IC0gaXggKiAtcXo7XG4gICAgb3V0WzJdID0gaXogKiBxdyArIGl3ICogLXF6ICsgaXggKiAtcXkgLSBpeSAqIC1xeDtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAgICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gc3RyJDUoYSkge1xuICAgIHJldHVybiAndmVjNCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcpJztcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9ycyBoYXZlIGV4YWN0bHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24gKHdoZW4gY29tcGFyZWQgd2l0aCA9PT0pXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjNH0gYSBUaGUgZmlyc3QgdmVjdG9yLlxuICAgKiBAcGFyYW0ge3ZlYzR9IGIgVGhlIHNlY29uZCB2ZWN0b3IuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBleGFjdEVxdWFscyQ1KGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdICYmIGFbMl0gPT09IGJbMl0gJiYgYVszXSA9PT0gYlszXTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9ycyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjNH0gYSBUaGUgZmlyc3QgdmVjdG9yLlxuICAgKiBAcGFyYW0ge3ZlYzR9IGIgVGhlIHNlY29uZCB2ZWN0b3IuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBlcXVhbHMkNihhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXTtcbiAgICB2YXIgYjAgPSBiWzBdLFxuICAgICAgICBiMSA9IGJbMV0sXG4gICAgICAgIGIyID0gYlsyXSxcbiAgICAgICAgYjMgPSBiWzNdO1xuICAgIHJldHVybiBNYXRoLmFicyhhMCAtIGIwKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMCksIE1hdGguYWJzKGIwKSkgJiYgTWF0aC5hYnMoYTEgLSBiMSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTEpLCBNYXRoLmFicyhiMSkpICYmIE1hdGguYWJzKGEyIC0gYjIpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEyKSwgTWF0aC5hYnMoYjIpKSAmJiBNYXRoLmFicyhhMyAtIGIzKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMyksIE1hdGguYWJzKGIzKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5zdWJ0cmFjdH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzdWIkNSA9IHN1YnRyYWN0JDU7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQubXVsdGlwbHl9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbXVsJDUgPSBtdWx0aXBseSQ1O1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LmRpdmlkZX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBkaXYkMSA9IGRpdmlkZSQxO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LmRpc3RhbmNlfVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIGRpc3QkMSA9IGRpc3RhbmNlJDE7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuc3F1YXJlZERpc3RhbmNlfVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHNxckRpc3QkMSA9IHNxdWFyZWREaXN0YW5jZSQxO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWM0Lmxlbmd0aH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBsZW4kMSA9IGxlbmd0aCQxO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LnNxdWFyZWRMZW5ndGh9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc3FyTGVuJDEgPSBzcXVhcmVkTGVuZ3RoJDE7XG4gIC8qKlxuICAgKiBQZXJmb3JtIHNvbWUgb3BlcmF0aW9uIG92ZXIgYW4gYXJyYXkgb2YgdmVjNHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgTnVtYmVyIG9mIGVsZW1lbnRzIGJldHdlZW4gdGhlIHN0YXJ0IG9mIGVhY2ggdmVjNC4gSWYgMCBhc3N1bWVzIHRpZ2h0bHkgcGFja2VkXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWM0cyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB2ZWN0b3IgaW4gdGhlIGFycmF5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXJnXSBhZGRpdGlvbmFsIGFyZ3VtZW50IHRvIHBhc3MgdG8gZm5cbiAgICogQHJldHVybnMge0FycmF5fSBhXG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgZm9yRWFjaCQxID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2ZWMgPSBjcmVhdGUkNSgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgc3RyaWRlLCBvZmZzZXQsIGNvdW50LCBmbiwgYXJnKSB7XG4gICAgICB2YXIgaSwgbDtcblxuICAgICAgaWYgKCFzdHJpZGUpIHtcbiAgICAgICAgc3RyaWRlID0gNDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgIGwgPSBNYXRoLm1pbihjb3VudCAqIHN0cmlkZSArIG9mZnNldCwgYS5sZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbCA9IGEubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSBvZmZzZXQ7IGkgPCBsOyBpICs9IHN0cmlkZSkge1xuICAgICAgICB2ZWNbMF0gPSBhW2ldO1xuICAgICAgICB2ZWNbMV0gPSBhW2kgKyAxXTtcbiAgICAgICAgdmVjWzJdID0gYVtpICsgMl07XG4gICAgICAgIHZlY1szXSA9IGFbaSArIDNdO1xuICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgYVtpXSA9IHZlY1swXTtcbiAgICAgICAgYVtpICsgMV0gPSB2ZWNbMV07XG4gICAgICAgIGFbaSArIDJdID0gdmVjWzJdO1xuICAgICAgICBhW2kgKyAzXSA9IHZlY1szXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbiAgfSgpO1xuXG4gIHZhciB2ZWM0ID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGNyZWF0ZTogY3JlYXRlJDUsXG4gICAgY2xvbmU6IGNsb25lJDUsXG4gICAgZnJvbVZhbHVlczogZnJvbVZhbHVlcyQ1LFxuICAgIGNvcHk6IGNvcHkkNSxcbiAgICBzZXQ6IHNldCQ1LFxuICAgIGFkZDogYWRkJDUsXG4gICAgc3VidHJhY3Q6IHN1YnRyYWN0JDUsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5JDUsXG4gICAgZGl2aWRlOiBkaXZpZGUkMSxcbiAgICBjZWlsOiBjZWlsJDEsXG4gICAgZmxvb3I6IGZsb29yJDEsXG4gICAgbWluOiBtaW4kMSxcbiAgICBtYXg6IG1heCQxLFxuICAgIHJvdW5kOiByb3VuZCQxLFxuICAgIHNjYWxlOiBzY2FsZSQ1LFxuICAgIHNjYWxlQW5kQWRkOiBzY2FsZUFuZEFkZCQxLFxuICAgIGRpc3RhbmNlOiBkaXN0YW5jZSQxLFxuICAgIHNxdWFyZWREaXN0YW5jZTogc3F1YXJlZERpc3RhbmNlJDEsXG4gICAgbGVuZ3RoOiBsZW5ndGgkMSxcbiAgICBzcXVhcmVkTGVuZ3RoOiBzcXVhcmVkTGVuZ3RoJDEsXG4gICAgbmVnYXRlOiBuZWdhdGUkMSxcbiAgICBpbnZlcnNlOiBpbnZlcnNlJDEsXG4gICAgbm9ybWFsaXplOiBub3JtYWxpemUkMSxcbiAgICBkb3Q6IGRvdCQxLFxuICAgIGxlcnA6IGxlcnAkMSxcbiAgICByYW5kb206IHJhbmRvbSQxLFxuICAgIHRyYW5zZm9ybU1hdDQ6IHRyYW5zZm9ybU1hdDQkMSxcbiAgICB0cmFuc2Zvcm1RdWF0OiB0cmFuc2Zvcm1RdWF0JDEsXG4gICAgc3RyOiBzdHIkNSxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMkNSxcbiAgICBlcXVhbHM6IGVxdWFscyQ2LFxuICAgIHN1Yjogc3ViJDUsXG4gICAgbXVsOiBtdWwkNSxcbiAgICBkaXY6IGRpdiQxLFxuICAgIGRpc3Q6IGRpc3QkMSxcbiAgICBzcXJEaXN0OiBzcXJEaXN0JDEsXG4gICAgbGVuOiBsZW4kMSxcbiAgICBzcXJMZW46IHNxckxlbiQxLFxuICAgIGZvckVhY2g6IGZvckVhY2gkMVxuICB9KTtcblxuICAvKipcbiAgICogUXVhdGVybmlvblxuICAgKiBAbW9kdWxlIHF1YXRcbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgcXVhdFxuICAgKlxuICAgKiBAcmV0dXJucyB7cXVhdH0gYSBuZXcgcXVhdGVybmlvblxuICAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGUkNigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEFSUkFZX1RZUEUoNCk7XG5cbiAgICBpZiAoQVJSQVlfVFlQRSAhPSBGbG9hdDMyQXJyYXkpIHtcbiAgICAgIG91dFswXSA9IDA7XG4gICAgICBvdXRbMV0gPSAwO1xuICAgICAgb3V0WzJdID0gMDtcbiAgICB9XG5cbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldCBhIHF1YXQgdG8gdGhlIGlkZW50aXR5IHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkkNChvdXQpIHtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldHMgYSBxdWF0IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFuZCByb3RhdGlvbiBheGlzLFxuICAgKiB0aGVuIHJldHVybnMgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3ZlYzN9IGF4aXMgdGhlIGF4aXMgYXJvdW5kIHdoaWNoIHRvIHJvdGF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSBpbiByYWRpYW5zXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICoqL1xuXG4gIGZ1bmN0aW9uIHNldEF4aXNBbmdsZShvdXQsIGF4aXMsIHJhZCkge1xuICAgIHJhZCA9IHJhZCAqIDAuNTtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgb3V0WzBdID0gcyAqIGF4aXNbMF07XG4gICAgb3V0WzFdID0gcyAqIGF4aXNbMV07XG4gICAgb3V0WzJdID0gcyAqIGF4aXNbMl07XG4gICAgb3V0WzNdID0gTWF0aC5jb3MocmFkKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3RhdGlvbiBheGlzIGFuZCBhbmdsZSBmb3IgYSBnaXZlblxuICAgKiAgcXVhdGVybmlvbi4gSWYgYSBxdWF0ZXJuaW9uIGlzIGNyZWF0ZWQgd2l0aFxuICAgKiAgc2V0QXhpc0FuZ2xlLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgc2FtZVxuICAgKiAgdmFsdWVzIGFzIHByb3ZpZGllZCBpbiB0aGUgb3JpZ2luYWwgcGFyYW1ldGVyIGxpc3RcbiAgICogIE9SIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHZhbHVlcy5cbiAgICogRXhhbXBsZTogVGhlIHF1YXRlcm5pb24gZm9ybWVkIGJ5IGF4aXMgWzAsIDAsIDFdIGFuZFxuICAgKiAgYW5nbGUgLTkwIGlzIHRoZSBzYW1lIGFzIHRoZSBxdWF0ZXJuaW9uIGZvcm1lZCBieVxuICAgKiAgWzAsIDAsIDFdIGFuZCAyNzAuIFRoaXMgbWV0aG9kIGZhdm9ycyB0aGUgbGF0dGVyLlxuICAgKiBAcGFyYW0gIHt2ZWMzfSBvdXRfYXhpcyAgVmVjdG9yIHJlY2VpdmluZyB0aGUgYXhpcyBvZiByb3RhdGlvblxuICAgKiBAcGFyYW0gIHtxdWF0fSBxICAgICBRdWF0ZXJuaW9uIHRvIGJlIGRlY29tcG9zZWRcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgQW5nbGUsIGluIHJhZGlhbnMsIG9mIHRoZSByb3RhdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRBeGlzQW5nbGUob3V0X2F4aXMsIHEpIHtcbiAgICB2YXIgcmFkID0gTWF0aC5hY29zKHFbM10pICogMi4wO1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkIC8gMi4wKTtcblxuICAgIGlmIChzID4gRVBTSUxPTikge1xuICAgICAgb3V0X2F4aXNbMF0gPSBxWzBdIC8gcztcbiAgICAgIG91dF9heGlzWzFdID0gcVsxXSAvIHM7XG4gICAgICBvdXRfYXhpc1syXSA9IHFbMl0gLyBzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBzIGlzIHplcm8sIHJldHVybiBhbnkgYXhpcyAobm8gcm90YXRpb24gLSBheGlzIGRvZXMgbm90IG1hdHRlcilcbiAgICAgIG91dF9heGlzWzBdID0gMTtcbiAgICAgIG91dF9heGlzWzFdID0gMDtcbiAgICAgIG91dF9heGlzWzJdID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFkO1xuICB9XG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIHR3byBxdWF0J3NcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbXVsdGlwbHkkNihvdXQsIGEsIGIpIHtcbiAgICB2YXIgYXggPSBhWzBdLFxuICAgICAgICBheSA9IGFbMV0sXG4gICAgICAgIGF6ID0gYVsyXSxcbiAgICAgICAgYXcgPSBhWzNdO1xuICAgIHZhciBieCA9IGJbMF0sXG4gICAgICAgIGJ5ID0gYlsxXSxcbiAgICAgICAgYnogPSBiWzJdLFxuICAgICAgICBidyA9IGJbM107XG4gICAgb3V0WzBdID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieTtcbiAgICBvdXRbMV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xuICAgIG91dFsyXSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYWJvdXQgdGhlIFggYXhpc1xuICAgKlxuICAgKiBAcGFyYW0ge3F1YXR9IG91dCBxdWF0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIHJvdGF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIGFuZ2xlIChpbiByYWRpYW5zKSB0byByb3RhdGVcbiAgICogQHJldHVybnMge3F1YXR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVYJDIob3V0LCBhLCByYWQpIHtcbiAgICByYWQgKj0gMC41O1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXSxcbiAgICAgICAgYXogPSBhWzJdLFxuICAgICAgICBhdyA9IGFbM107XG4gICAgdmFyIGJ4ID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYncgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGF4ICogYncgKyBhdyAqIGJ4O1xuICAgIG91dFsxXSA9IGF5ICogYncgKyBheiAqIGJ4O1xuICAgIG91dFsyXSA9IGF6ICogYncgLSBheSAqIGJ4O1xuICAgIG91dFszXSA9IGF3ICogYncgLSBheCAqIGJ4O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJvdGF0ZXMgYSBxdWF0ZXJuaW9uIGJ5IHRoZSBnaXZlbiBhbmdsZSBhYm91dCB0aGUgWSBheGlzXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHF1YXQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgYW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVkkMihvdXQsIGEsIHJhZCkge1xuICAgIHJhZCAqPSAwLjU7XG4gICAgdmFyIGF4ID0gYVswXSxcbiAgICAgICAgYXkgPSBhWzFdLFxuICAgICAgICBheiA9IGFbMl0sXG4gICAgICAgIGF3ID0gYVszXTtcbiAgICB2YXIgYnkgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBidyA9IE1hdGguY29zKHJhZCk7XG4gICAgb3V0WzBdID0gYXggKiBidyAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF3ICogYnk7XG4gICAgb3V0WzJdID0gYXogKiBidyArIGF4ICogYnk7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF5ICogYnk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFib3V0IHRoZSBaIGF4aXNcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgcXVhdCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byByb3RhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCBhbmdsZSAoaW4gcmFkaWFucykgdG8gcm90YXRlXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcm90YXRlWiQyKG91dCwgYSwgcmFkKSB7XG4gICAgcmFkICo9IDAuNTtcbiAgICB2YXIgYXggPSBhWzBdLFxuICAgICAgICBheSA9IGFbMV0sXG4gICAgICAgIGF6ID0gYVsyXSxcbiAgICAgICAgYXcgPSBhWzNdO1xuICAgIHZhciBieiA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGJ3ID0gTWF0aC5jb3MocmFkKTtcbiAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXkgKiBiejtcbiAgICBvdXRbMV0gPSBheSAqIGJ3IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBiejtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXogKiBiejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBXIGNvbXBvbmVudCBvZiBhIHF1YXQgZnJvbSB0aGUgWCwgWSwgYW5kIFogY29tcG9uZW50cy5cbiAgICogQXNzdW1lcyB0aGF0IHF1YXRlcm5pb24gaXMgMSB1bml0IGluIGxlbmd0aC5cbiAgICogQW55IGV4aXN0aW5nIFcgY29tcG9uZW50IHdpbGwgYmUgaWdub3JlZC5cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIGNhbGN1bGF0ZSBXIGNvbXBvbmVudCBvZlxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNhbGN1bGF0ZVcob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl07XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIG91dFsyXSA9IHo7XG4gICAgb3V0WzNdID0gTWF0aC5zcXJ0KE1hdGguYWJzKDEuMCAtIHggKiB4IC0geSAqIHkgLSB6ICogeikpO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHF1YXRcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50LCBpbiB0aGUgcmFuZ2UgWzAtMV0sIGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAgICogQHJldHVybnMge3F1YXR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzbGVycChvdXQsIGEsIGIsIHQpIHtcbiAgICAvLyBiZW5jaG1hcmtzOlxuICAgIC8vICAgIGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tc2xlcnAtaW1wbGVtZW50YXRpb25zXG4gICAgdmFyIGF4ID0gYVswXSxcbiAgICAgICAgYXkgPSBhWzFdLFxuICAgICAgICBheiA9IGFbMl0sXG4gICAgICAgIGF3ID0gYVszXTtcbiAgICB2YXIgYnggPSBiWzBdLFxuICAgICAgICBieSA9IGJbMV0sXG4gICAgICAgIGJ6ID0gYlsyXSxcbiAgICAgICAgYncgPSBiWzNdO1xuICAgIHZhciBvbWVnYSwgY29zb20sIHNpbm9tLCBzY2FsZTAsIHNjYWxlMTsgLy8gY2FsYyBjb3NpbmVcblxuICAgIGNvc29tID0gYXggKiBieCArIGF5ICogYnkgKyBheiAqIGJ6ICsgYXcgKiBidzsgLy8gYWRqdXN0IHNpZ25zIChpZiBuZWNlc3NhcnkpXG5cbiAgICBpZiAoY29zb20gPCAwLjApIHtcbiAgICAgIGNvc29tID0gLWNvc29tO1xuICAgICAgYnggPSAtYng7XG4gICAgICBieSA9IC1ieTtcbiAgICAgIGJ6ID0gLWJ6O1xuICAgICAgYncgPSAtYnc7XG4gICAgfSAvLyBjYWxjdWxhdGUgY29lZmZpY2llbnRzXG5cblxuICAgIGlmICgxLjAgLSBjb3NvbSA+IEVQU0lMT04pIHtcbiAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxuICAgICAgb21lZ2EgPSBNYXRoLmFjb3MoY29zb20pO1xuICAgICAgc2lub20gPSBNYXRoLnNpbihvbWVnYSk7XG4gICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcbiAgICAgIHNjYWxlMSA9IE1hdGguc2luKHQgKiBvbWVnYSkgLyBzaW5vbTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBxdWF0ZXJuaW9ucyBhcmUgdmVyeSBjbG9zZVxuICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxuICAgICAgc2NhbGUwID0gMS4wIC0gdDtcbiAgICAgIHNjYWxlMSA9IHQ7XG4gICAgfSAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXG5cblxuICAgIG91dFswXSA9IHNjYWxlMCAqIGF4ICsgc2NhbGUxICogYng7XG4gICAgb3V0WzFdID0gc2NhbGUwICogYXkgKyBzY2FsZTEgKiBieTtcbiAgICBvdXRbMl0gPSBzY2FsZTAgKiBheiArIHNjYWxlMSAqIGJ6O1xuICAgIG91dFszXSA9IHNjYWxlMCAqIGF3ICsgc2NhbGUxICogYnc7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgcmFuZG9tIHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcmFuZG9tJDIob3V0KSB7XG4gICAgLy8gSW1wbGVtZW50YXRpb24gb2YgaHR0cDovL3BsYW5uaW5nLmNzLnVpdWMuZWR1L25vZGUxOTguaHRtbFxuICAgIC8vIFRPRE86IENhbGxpbmcgcmFuZG9tIDMgdGltZXMgaXMgcHJvYmFibHkgbm90IHRoZSBmYXN0ZXN0IHNvbHV0aW9uXG4gICAgdmFyIHUxID0gUkFORE9NKCk7XG4gICAgdmFyIHUyID0gUkFORE9NKCk7XG4gICAgdmFyIHUzID0gUkFORE9NKCk7XG4gICAgdmFyIHNxcnQxTWludXNVMSA9IE1hdGguc3FydCgxIC0gdTEpO1xuICAgIHZhciBzcXJ0VTEgPSBNYXRoLnNxcnQodTEpO1xuICAgIG91dFswXSA9IHNxcnQxTWludXNVMSAqIE1hdGguc2luKDIuMCAqIE1hdGguUEkgKiB1Mik7XG4gICAgb3V0WzFdID0gc3FydDFNaW51c1UxICogTWF0aC5jb3MoMi4wICogTWF0aC5QSSAqIHUyKTtcbiAgICBvdXRbMl0gPSBzcXJ0VTEgKiBNYXRoLnNpbigyLjAgKiBNYXRoLlBJICogdTMpO1xuICAgIG91dFszXSA9IHNxcnRVMSAqIE1hdGguY29zKDIuMCAqIE1hdGguUEkgKiB1Myk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW52ZXJzZSBvZiBhIHF1YXRcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIGNhbGN1bGF0ZSBpbnZlcnNlIG9mXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJ0JDQob3V0LCBhKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdLFxuICAgICAgICBhMiA9IGFbMl0sXG4gICAgICAgIGEzID0gYVszXTtcbiAgICB2YXIgZG90JCQxID0gYTAgKiBhMCArIGExICogYTEgKyBhMiAqIGEyICsgYTMgKiBhMztcbiAgICB2YXIgaW52RG90ID0gZG90JCQxID8gMS4wIC8gZG90JCQxIDogMDsgLy8gVE9ETzogV291bGQgYmUgZmFzdGVyIHRvIHJldHVybiBbMCwwLDAsMF0gaW1tZWRpYXRlbHkgaWYgZG90ID09IDBcblxuICAgIG91dFswXSA9IC1hMCAqIGludkRvdDtcbiAgICBvdXRbMV0gPSAtYTEgKiBpbnZEb3Q7XG4gICAgb3V0WzJdID0gLWEyICogaW52RG90O1xuICAgIG91dFszXSA9IGEzICogaW52RG90O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNvbmp1Z2F0ZSBvZiBhIHF1YXRcbiAgICogSWYgdGhlIHF1YXRlcm5pb24gaXMgbm9ybWFsaXplZCwgdGhpcyBmdW5jdGlvbiBpcyBmYXN0ZXIgdGhhbiBxdWF0LmludmVyc2UgYW5kIHByb2R1Y2VzIHRoZSBzYW1lIHJlc3VsdC5cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIGNhbGN1bGF0ZSBjb25qdWdhdGUgb2ZcbiAgICogQHJldHVybnMge3F1YXR9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBjb25qdWdhdGUob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gLWFbMF07XG4gICAgb3V0WzFdID0gLWFbMV07XG4gICAgb3V0WzJdID0gLWFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiAzeDMgcm90YXRpb24gbWF0cml4LlxuICAgKlxuICAgKiBOT1RFOiBUaGUgcmVzdWx0YW50IHF1YXRlcm5pb24gaXMgbm90IG5vcm1hbGl6ZWQsIHNvIHlvdSBzaG91bGQgYmUgc3VyZVxuICAgKiB0byByZW5vcm1hbGl6ZSB0aGUgcXVhdGVybmlvbiB5b3Vyc2VsZiB3aGVyZSBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge21hdDN9IG0gcm90YXRpb24gbWF0cml4XG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21NYXQzKG91dCwgbSkge1xuICAgIC8vIEFsZ29yaXRobSBpbiBLZW4gU2hvZW1ha2UncyBhcnRpY2xlIGluIDE5ODcgU0lHR1JBUEggY291cnNlIG5vdGVzXG4gICAgLy8gYXJ0aWNsZSBcIlF1YXRlcm5pb24gQ2FsY3VsdXMgYW5kIEZhc3QgQW5pbWF0aW9uXCIuXG4gICAgdmFyIGZUcmFjZSA9IG1bMF0gKyBtWzRdICsgbVs4XTtcbiAgICB2YXIgZlJvb3Q7XG5cbiAgICBpZiAoZlRyYWNlID4gMC4wKSB7XG4gICAgICAvLyB8d3wgPiAxLzIsIG1heSBhcyB3ZWxsIGNob29zZSB3ID4gMS8yXG4gICAgICBmUm9vdCA9IE1hdGguc3FydChmVHJhY2UgKyAxLjApOyAvLyAyd1xuXG4gICAgICBvdXRbM10gPSAwLjUgKiBmUm9vdDtcbiAgICAgIGZSb290ID0gMC41IC8gZlJvb3Q7IC8vIDEvKDR3KVxuXG4gICAgICBvdXRbMF0gPSAobVs1XSAtIG1bN10pICogZlJvb3Q7XG4gICAgICBvdXRbMV0gPSAobVs2XSAtIG1bMl0pICogZlJvb3Q7XG4gICAgICBvdXRbMl0gPSAobVsxXSAtIG1bM10pICogZlJvb3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHx3fCA8PSAxLzJcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIGlmIChtWzRdID4gbVswXSkgaSA9IDE7XG4gICAgICBpZiAobVs4XSA+IG1baSAqIDMgKyBpXSkgaSA9IDI7XG4gICAgICB2YXIgaiA9IChpICsgMSkgJSAzO1xuICAgICAgdmFyIGsgPSAoaSArIDIpICUgMztcbiAgICAgIGZSb290ID0gTWF0aC5zcXJ0KG1baSAqIDMgKyBpXSAtIG1baiAqIDMgKyBqXSAtIG1bayAqIDMgKyBrXSArIDEuMCk7XG4gICAgICBvdXRbaV0gPSAwLjUgKiBmUm9vdDtcbiAgICAgIGZSb290ID0gMC41IC8gZlJvb3Q7XG4gICAgICBvdXRbM10gPSAobVtqICogMyArIGtdIC0gbVtrICogMyArIGpdKSAqIGZSb290O1xuICAgICAgb3V0W2pdID0gKG1baiAqIDMgKyBpXSArIG1baSAqIDMgKyBqXSkgKiBmUm9vdDtcbiAgICAgIG91dFtrXSA9IChtW2sgKiAzICsgaV0gKyBtW2kgKiAzICsga10pICogZlJvb3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIHF1YXRlcm5pb24gZnJvbSB0aGUgZ2l2ZW4gZXVsZXIgYW5nbGUgeCwgeSwgei5cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7eH0gQW5nbGUgdG8gcm90YXRlIGFyb3VuZCBYIGF4aXMgaW4gZGVncmVlcy5cbiAgICogQHBhcmFtIHt5fSBBbmdsZSB0byByb3RhdGUgYXJvdW5kIFkgYXhpcyBpbiBkZWdyZWVzLlxuICAgKiBAcGFyYW0ge3p9IEFuZ2xlIHRvIHJvdGF0ZSBhcm91bmQgWiBheGlzIGluIGRlZ3JlZXMuXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21FdWxlcihvdXQsIHgsIHksIHopIHtcbiAgICB2YXIgaGFsZlRvUmFkID0gMC41ICogTWF0aC5QSSAvIDE4MC4wO1xuICAgIHggKj0gaGFsZlRvUmFkO1xuICAgIHkgKj0gaGFsZlRvUmFkO1xuICAgIHogKj0gaGFsZlRvUmFkO1xuICAgIHZhciBzeCA9IE1hdGguc2luKHgpO1xuICAgIHZhciBjeCA9IE1hdGguY29zKHgpO1xuICAgIHZhciBzeSA9IE1hdGguc2luKHkpO1xuICAgIHZhciBjeSA9IE1hdGguY29zKHkpO1xuICAgIHZhciBzeiA9IE1hdGguc2luKHopO1xuICAgIHZhciBjeiA9IE1hdGguY29zKHopO1xuICAgIG91dFswXSA9IHN4ICogY3kgKiBjeiAtIGN4ICogc3kgKiBzejtcbiAgICBvdXRbMV0gPSBjeCAqIHN5ICogY3ogKyBzeCAqIGN5ICogc3o7XG4gICAgb3V0WzJdID0gY3ggKiBjeSAqIHN6IC0gc3ggKiBzeSAqIGN6O1xuICAgIG91dFszXSA9IGN4ICogY3kgKiBjeiArIHN4ICogc3kgKiBzejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcXVhdGVuaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB2ZWN0b3IgdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN0ciQ2KGEpIHtcbiAgICByZXR1cm4gJ3F1YXQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnKSc7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcXVhdCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBhIHF1YXRlcm5pb24gdG8gY2xvbmVcbiAgICogQHJldHVybnMge3F1YXR9IGEgbmV3IHF1YXRlcm5pb25cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBjbG9uZSQ2ID0gY2xvbmUkNTtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcXVhdCBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAgICogQHJldHVybnMge3F1YXR9IGEgbmV3IHF1YXRlcm5pb25cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBmcm9tVmFsdWVzJDYgPSBmcm9tVmFsdWVzJDU7XG4gIC8qKlxuICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgcXVhdCB0byBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHNvdXJjZSBxdWF0ZXJuaW9uXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBjb3B5JDYgPSBjb3B5JDU7XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBxdWF0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzZXQkNiA9IHNldCQ1O1xuICAvKipcbiAgICogQWRkcyB0d28gcXVhdCdzXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgYWRkJDYgPSBhZGQkNTtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgcXVhdC5tdWx0aXBseX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBtdWwkNiA9IG11bHRpcGx5JDY7XG4gIC8qKlxuICAgKiBTY2FsZXMgYSBxdWF0IGJ5IGEgc2NhbGFyIG51bWJlclxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICAgKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieVxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc2NhbGUkNiA9IHNjYWxlJDU7XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gcXVhdCdzXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRvdCBwcm9kdWN0IG9mIGEgYW5kIGJcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBkb3QkMiA9IGRvdCQxO1xuICAvKipcbiAgICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0J3NcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50LCBpbiB0aGUgcmFuZ2UgWzAtMV0sIGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAgICogQHJldHVybnMge3F1YXR9IG91dFxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIGxlcnAkMiA9IGxlcnAkMTtcbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHF1YXRcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBhIHZlY3RvciB0byBjYWxjdWxhdGUgbGVuZ3RoIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gICAqL1xuXG4gIHZhciBsZW5ndGgkMiA9IGxlbmd0aCQxO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayBxdWF0Lmxlbmd0aH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBsZW4kMiA9IGxlbmd0aCQyO1xuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSBxdWF0XG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzcXVhcmVkTGVuZ3RoJDIgPSBzcXVhcmVkTGVuZ3RoJDE7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHF1YXQuc3F1YXJlZExlbmd0aH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzcXJMZW4kMiA9IHNxdWFyZWRMZW5ndGgkMjtcbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSBhIHF1YXRcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0ZXJuaW9uIHRvIG5vcm1hbGl6ZVxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbm9ybWFsaXplJDIgPSBub3JtYWxpemUkMTtcbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHF1YXRlcm5pb25zIGhhdmUgZXhhY3RseSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBwb3NpdGlvbiAod2hlbiBjb21wYXJlZCB3aXRoID09PSlcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBhIFRoZSBmaXJzdCBxdWF0ZXJuaW9uLlxuICAgKiBAcGFyYW0ge3F1YXR9IGIgVGhlIHNlY29uZCBxdWF0ZXJuaW9uLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmVjdG9ycyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgdmFyIGV4YWN0RXF1YWxzJDYgPSBleGFjdEVxdWFscyQ1O1xuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgcXVhdGVybmlvbnMgaGF2ZSBhcHByb3hpbWF0ZWx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXR9IGEgVGhlIGZpcnN0IHZlY3Rvci5cbiAgICogQHBhcmFtIHtxdWF0fSBiIFRoZSBzZWNvbmQgdmVjdG9yLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmVjdG9ycyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgdmFyIGVxdWFscyQ3ID0gZXF1YWxzJDY7XG4gIC8qKlxuICAgKiBTZXRzIGEgcXVhdGVybmlvbiB0byByZXByZXNlbnQgdGhlIHNob3J0ZXN0IHJvdGF0aW9uIGZyb20gb25lXG4gICAqIHZlY3RvciB0byBhbm90aGVyLlxuICAgKlxuICAgKiBCb3RoIHZlY3RvcnMgYXJlIGFzc3VtZWQgdG8gYmUgdW5pdCBsZW5ndGguXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvbi5cbiAgICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBpbml0aWFsIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIGRlc3RpbmF0aW9uIHZlY3RvclxuICAgKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gICAqL1xuXG4gIHZhciByb3RhdGlvblRvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0bXB2ZWMzID0gY3JlYXRlJDQoKTtcbiAgICB2YXIgeFVuaXRWZWMzID0gZnJvbVZhbHVlcyQ0KDEsIDAsIDApO1xuICAgIHZhciB5VW5pdFZlYzMgPSBmcm9tVmFsdWVzJDQoMCwgMSwgMCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICAgIHZhciBkb3QkJDEgPSBkb3QoYSwgYik7XG5cbiAgICAgIGlmIChkb3QkJDEgPCAtMC45OTk5OTkpIHtcbiAgICAgICAgY3Jvc3ModG1wdmVjMywgeFVuaXRWZWMzLCBhKTtcbiAgICAgICAgaWYgKGxlbih0bXB2ZWMzKSA8IDAuMDAwMDAxKSBjcm9zcyh0bXB2ZWMzLCB5VW5pdFZlYzMsIGEpO1xuICAgICAgICBub3JtYWxpemUodG1wdmVjMywgdG1wdmVjMyk7XG4gICAgICAgIHNldEF4aXNBbmdsZShvdXQsIHRtcHZlYzMsIE1hdGguUEkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgfSBlbHNlIGlmIChkb3QkJDEgPiAwLjk5OTk5OSkge1xuICAgICAgICBvdXRbMF0gPSAwO1xuICAgICAgICBvdXRbMV0gPSAwO1xuICAgICAgICBvdXRbMl0gPSAwO1xuICAgICAgICBvdXRbM10gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3Jvc3ModG1wdmVjMywgYSwgYik7XG4gICAgICAgIG91dFswXSA9IHRtcHZlYzNbMF07XG4gICAgICAgIG91dFsxXSA9IHRtcHZlYzNbMV07XG4gICAgICAgIG91dFsyXSA9IHRtcHZlYzNbMl07XG4gICAgICAgIG91dFszXSA9IDEgKyBkb3QkJDE7XG4gICAgICAgIHJldHVybiBub3JtYWxpemUkMihvdXQsIG91dCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSgpO1xuICAvKipcbiAgICogUGVyZm9ybXMgYSBzcGhlcmljYWwgbGluZWFyIGludGVycG9sYXRpb24gd2l0aCB0d28gY29udHJvbCBwb2ludHNcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7cXVhdH0gYyB0aGUgdGhpcmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXR9IGQgdGhlIGZvdXJ0aCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50LCBpbiB0aGUgcmFuZ2UgWzAtMV0sIGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAgICogQHJldHVybnMge3F1YXR9IG91dFxuICAgKi9cblxuICB2YXIgc3FsZXJwID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZW1wMSA9IGNyZWF0ZSQ2KCk7XG4gICAgdmFyIHRlbXAyID0gY3JlYXRlJDYoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG91dCwgYSwgYiwgYywgZCwgdCkge1xuICAgICAgc2xlcnAodGVtcDEsIGEsIGQsIHQpO1xuICAgICAgc2xlcnAodGVtcDIsIGIsIGMsIHQpO1xuICAgICAgc2xlcnAob3V0LCB0ZW1wMSwgdGVtcDIsIDIgKiB0ICogKDEgLSB0KSk7XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gIH0oKTtcbiAgLyoqXG4gICAqIFNldHMgdGhlIHNwZWNpZmllZCBxdWF0ZXJuaW9uIHdpdGggdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqIGF4ZXMuIEVhY2ggYXhpcyBpcyBhIHZlYzMgYW5kIGlzIGV4cGVjdGVkIHRvIGJlIHVuaXQgbGVuZ3RoIGFuZFxuICAgKiBwZXJwZW5kaWN1bGFyIHRvIGFsbCBvdGhlciBzcGVjaWZpZWQgYXhlcy5cbiAgICpcbiAgICogQHBhcmFtIHt2ZWMzfSB2aWV3ICB0aGUgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgdmlld2luZyBkaXJlY3Rpb25cbiAgICogQHBhcmFtIHt2ZWMzfSByaWdodCB0aGUgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgbG9jYWwgXCJyaWdodFwiIGRpcmVjdGlvblxuICAgKiBAcGFyYW0ge3ZlYzN9IHVwICAgIHRoZSB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSBsb2NhbCBcInVwXCIgZGlyZWN0aW9uXG4gICAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAgICovXG5cbiAgdmFyIHNldEF4ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hdHIgPSBjcmVhdGUkMigpO1xuICAgIHJldHVybiBmdW5jdGlvbiAob3V0LCB2aWV3LCByaWdodCwgdXApIHtcbiAgICAgIG1hdHJbMF0gPSByaWdodFswXTtcbiAgICAgIG1hdHJbM10gPSByaWdodFsxXTtcbiAgICAgIG1hdHJbNl0gPSByaWdodFsyXTtcbiAgICAgIG1hdHJbMV0gPSB1cFswXTtcbiAgICAgIG1hdHJbNF0gPSB1cFsxXTtcbiAgICAgIG1hdHJbN10gPSB1cFsyXTtcbiAgICAgIG1hdHJbMl0gPSAtdmlld1swXTtcbiAgICAgIG1hdHJbNV0gPSAtdmlld1sxXTtcbiAgICAgIG1hdHJbOF0gPSAtdmlld1syXTtcbiAgICAgIHJldHVybiBub3JtYWxpemUkMihvdXQsIGZyb21NYXQzKG91dCwgbWF0cikpO1xuICAgIH07XG4gIH0oKTtcblxuICB2YXIgcXVhdCA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQ2LFxuICAgIGlkZW50aXR5OiBpZGVudGl0eSQ0LFxuICAgIHNldEF4aXNBbmdsZTogc2V0QXhpc0FuZ2xlLFxuICAgIGdldEF4aXNBbmdsZTogZ2V0QXhpc0FuZ2xlLFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSQ2LFxuICAgIHJvdGF0ZVg6IHJvdGF0ZVgkMixcbiAgICByb3RhdGVZOiByb3RhdGVZJDIsXG4gICAgcm90YXRlWjogcm90YXRlWiQyLFxuICAgIGNhbGN1bGF0ZVc6IGNhbGN1bGF0ZVcsXG4gICAgc2xlcnA6IHNsZXJwLFxuICAgIHJhbmRvbTogcmFuZG9tJDIsXG4gICAgaW52ZXJ0OiBpbnZlcnQkNCxcbiAgICBjb25qdWdhdGU6IGNvbmp1Z2F0ZSxcbiAgICBmcm9tTWF0MzogZnJvbU1hdDMsXG4gICAgZnJvbUV1bGVyOiBmcm9tRXVsZXIsXG4gICAgc3RyOiBzdHIkNixcbiAgICBjbG9uZTogY2xvbmUkNixcbiAgICBmcm9tVmFsdWVzOiBmcm9tVmFsdWVzJDYsXG4gICAgY29weTogY29weSQ2LFxuICAgIHNldDogc2V0JDYsXG4gICAgYWRkOiBhZGQkNixcbiAgICBtdWw6IG11bCQ2LFxuICAgIHNjYWxlOiBzY2FsZSQ2LFxuICAgIGRvdDogZG90JDIsXG4gICAgbGVycDogbGVycCQyLFxuICAgIGxlbmd0aDogbGVuZ3RoJDIsXG4gICAgbGVuOiBsZW4kMixcbiAgICBzcXVhcmVkTGVuZ3RoOiBzcXVhcmVkTGVuZ3RoJDIsXG4gICAgc3FyTGVuOiBzcXJMZW4kMixcbiAgICBub3JtYWxpemU6IG5vcm1hbGl6ZSQyLFxuICAgIGV4YWN0RXF1YWxzOiBleGFjdEVxdWFscyQ2LFxuICAgIGVxdWFsczogZXF1YWxzJDcsXG4gICAgcm90YXRpb25Ubzogcm90YXRpb25UbyxcbiAgICBzcWxlcnA6IHNxbGVycCxcbiAgICBzZXRBeGVzOiBzZXRBeGVzXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBEdWFsIFF1YXRlcm5pb248YnI+XG4gICAqIEZvcm1hdDogW3JlYWwsIGR1YWxdPGJyPlxuICAgKiBRdWF0ZXJuaW9uIGZvcm1hdDogWFlaVzxicj5cbiAgICogTWFrZSBzdXJlIHRvIGhhdmUgbm9ybWFsaXplZCBkdWFsIHF1YXRlcm5pb25zLCBvdGhlcndpc2UgdGhlIGZ1bmN0aW9ucyBtYXkgbm90IHdvcmsgYXMgaW50ZW5kZWQuPGJyPlxuICAgKiBAbW9kdWxlIHF1YXQyXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IGR1YWwgcXVhdFxuICAgKlxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IGEgbmV3IGR1YWwgcXVhdGVybmlvbiBbcmVhbCAtPiByb3RhdGlvbiwgZHVhbCAtPiB0cmFuc2xhdGlvbl1cbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlJDcoKSB7XG4gICAgdmFyIGRxID0gbmV3IEFSUkFZX1RZUEUoOCk7XG5cbiAgICBpZiAoQVJSQVlfVFlQRSAhPSBGbG9hdDMyQXJyYXkpIHtcbiAgICAgIGRxWzBdID0gMDtcbiAgICAgIGRxWzFdID0gMDtcbiAgICAgIGRxWzJdID0gMDtcbiAgICAgIGRxWzRdID0gMDtcbiAgICAgIGRxWzVdID0gMDtcbiAgICAgIGRxWzZdID0gMDtcbiAgICAgIGRxWzddID0gMDtcbiAgICB9XG5cbiAgICBkcVszXSA9IDE7XG4gICAgcmV0dXJuIGRxO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHF1YXQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBxdWF0ZXJuaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgZHVhbCBxdWF0ZXJuaW9uIHRvIGNsb25lXG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gbmV3IGR1YWwgcXVhdGVybmlvblxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUkNyhhKSB7XG4gICAgdmFyIGRxID0gbmV3IEFSUkFZX1RZUEUoOCk7XG4gICAgZHFbMF0gPSBhWzBdO1xuICAgIGRxWzFdID0gYVsxXTtcbiAgICBkcVsyXSA9IGFbMl07XG4gICAgZHFbM10gPSBhWzNdO1xuICAgIGRxWzRdID0gYVs0XTtcbiAgICBkcVs1XSA9IGFbNV07XG4gICAgZHFbNl0gPSBhWzZdO1xuICAgIGRxWzddID0gYVs3XTtcbiAgICByZXR1cm4gZHE7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZHVhbCBxdWF0IGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0geDEgWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxIFkgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB6MSBaIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0gdzEgVyBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyIFggY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MiBZIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0gejIgWiBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHcyIFcgY29tcG9uZW50XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gbmV3IGR1YWwgcXVhdGVybmlvblxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVZhbHVlcyQ3KHgxLCB5MSwgejEsIHcxLCB4MiwgeTIsIHoyLCB3Mikge1xuICAgIHZhciBkcSA9IG5ldyBBUlJBWV9UWVBFKDgpO1xuICAgIGRxWzBdID0geDE7XG4gICAgZHFbMV0gPSB5MTtcbiAgICBkcVsyXSA9IHoxO1xuICAgIGRxWzNdID0gdzE7XG4gICAgZHFbNF0gPSB4MjtcbiAgICBkcVs1XSA9IHkyO1xuICAgIGRxWzZdID0gejI7XG4gICAgZHFbN10gPSB3MjtcbiAgICByZXR1cm4gZHE7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZHVhbCBxdWF0IGZyb20gdGhlIGdpdmVuIHZhbHVlcyAocXVhdCBhbmQgdHJhbnNsYXRpb24pXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MSBYIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geTEgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHoxIFogY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3MSBXIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geDIgWCBjb21wb25lbnQgKHRyYW5zbGF0aW9uKVxuICAgKiBAcGFyYW0ge051bWJlcn0geTIgWSBjb21wb25lbnQgKHRyYW5zbGF0aW9uKVxuICAgKiBAcGFyYW0ge051bWJlcn0gejIgWiBjb21wb25lbnQgKHRyYW5zbGF0aW9uKVxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG5ldyBkdWFsIHF1YXRlcm5pb25cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uVmFsdWVzKHgxLCB5MSwgejEsIHcxLCB4MiwgeTIsIHoyKSB7XG4gICAgdmFyIGRxID0gbmV3IEFSUkFZX1RZUEUoOCk7XG4gICAgZHFbMF0gPSB4MTtcbiAgICBkcVsxXSA9IHkxO1xuICAgIGRxWzJdID0gejE7XG4gICAgZHFbM10gPSB3MTtcbiAgICB2YXIgYXggPSB4MiAqIDAuNSxcbiAgICAgICAgYXkgPSB5MiAqIDAuNSxcbiAgICAgICAgYXogPSB6MiAqIDAuNTtcbiAgICBkcVs0XSA9IGF4ICogdzEgKyBheSAqIHoxIC0gYXogKiB5MTtcbiAgICBkcVs1XSA9IGF5ICogdzEgKyBheiAqIHgxIC0gYXggKiB6MTtcbiAgICBkcVs2XSA9IGF6ICogdzEgKyBheCAqIHkxIC0gYXkgKiB4MTtcbiAgICBkcVs3XSA9IC1heCAqIHgxIC0gYXkgKiB5MSAtIGF6ICogejE7XG4gICAgcmV0dXJuIGRxO1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZHVhbCBxdWF0IGZyb20gYSBxdWF0ZXJuaW9uIGFuZCBhIHRyYW5zbGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGR1YWwgcXVhdGVybmlvbiByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge3F1YXR9IHEgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3ZlYzN9IHQgdHJhbmxhdGlvbiB2ZWN0b3JcbiAgICogQHJldHVybnMge3F1YXQyfSBkdWFsIHF1YXRlcm5pb24gcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uJDEob3V0LCBxLCB0KSB7XG4gICAgdmFyIGF4ID0gdFswXSAqIDAuNSxcbiAgICAgICAgYXkgPSB0WzFdICogMC41LFxuICAgICAgICBheiA9IHRbMl0gKiAwLjUsXG4gICAgICAgIGJ4ID0gcVswXSxcbiAgICAgICAgYnkgPSBxWzFdLFxuICAgICAgICBieiA9IHFbMl0sXG4gICAgICAgIGJ3ID0gcVszXTtcbiAgICBvdXRbMF0gPSBieDtcbiAgICBvdXRbMV0gPSBieTtcbiAgICBvdXRbMl0gPSBiejtcbiAgICBvdXRbM10gPSBidztcbiAgICBvdXRbNF0gPSBheCAqIGJ3ICsgYXkgKiBieiAtIGF6ICogYnk7XG4gICAgb3V0WzVdID0gYXkgKiBidyArIGF6ICogYnggLSBheCAqIGJ6O1xuICAgIG91dFs2XSA9IGF6ICogYncgKyBheCAqIGJ5IC0gYXkgKiBieDtcbiAgICBvdXRbN10gPSAtYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBkdWFsIHF1YXQgZnJvbSBhIHRyYW5zbGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGR1YWwgcXVhdGVybmlvbiByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAcGFyYW0ge3ZlYzN9IHQgdHJhbnNsYXRpb24gdmVjdG9yXG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gZHVhbCBxdWF0ZXJuaW9uIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tVHJhbnNsYXRpb24kMyhvdXQsIHQpIHtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIG91dFs0XSA9IHRbMF0gKiAwLjU7XG4gICAgb3V0WzVdID0gdFsxXSAqIDAuNTtcbiAgICBvdXRbNl0gPSB0WzJdICogMC41O1xuICAgIG91dFs3XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIGR1YWwgcXVhdCBmcm9tIGEgcXVhdGVybmlvblxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBkdWFsIHF1YXRlcm5pb24gcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAgICogQHBhcmFtIHtxdWF0fSBxIHRoZSBxdWF0ZXJuaW9uXG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gZHVhbCBxdWF0ZXJuaW9uIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBmcm9tUm90YXRpb24kNChvdXQsIHEpIHtcbiAgICBvdXRbMF0gPSBxWzBdO1xuICAgIG91dFsxXSA9IHFbMV07XG4gICAgb3V0WzJdID0gcVsyXTtcbiAgICBvdXRbM10gPSBxWzNdO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBkdWFsIHF1YXQgZnJvbSBhIG1hdHJpeCAoNHg0KVxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBvdXQgdGhlIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeFxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IGR1YWwgcXVhdCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbU1hdDQkMShvdXQsIGEpIHtcbiAgICAvL1RPRE8gT3B0aW1pemUgdGhpc1xuICAgIHZhciBvdXRlciA9IGNyZWF0ZSQ2KCk7XG4gICAgZ2V0Um90YXRpb24ob3V0ZXIsIGEpO1xuICAgIHZhciB0ID0gbmV3IEFSUkFZX1RZUEUoMyk7XG4gICAgZ2V0VHJhbnNsYXRpb24odCwgYSk7XG4gICAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24kMShvdXQsIG91dGVyLCB0KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgZHVhbCBxdWF0IHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgZHVhbCBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgdGhlIHNvdXJjZSBkdWFsIHF1YXRlcm5pb25cbiAgICogQHJldHVybnMge3F1YXQyfSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvcHkkNyhvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU2V0IGEgZHVhbCBxdWF0IHRvIHRoZSBpZGVudGl0eSBkdWFsIHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBpZGVudGl0eSQ1KG91dCkge1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBkdWFsIHF1YXQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MSBYIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geTEgWSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHoxIFogY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3MSBXIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0geDIgWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyIFkgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB6MiBaIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge051bWJlcn0gdzIgVyBjb21wb25lbnRcbiAgICogQHJldHVybnMge3F1YXQyfSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldCQ3KG91dCwgeDEsIHkxLCB6MSwgdzEsIHgyLCB5MiwgejIsIHcyKSB7XG4gICAgb3V0WzBdID0geDE7XG4gICAgb3V0WzFdID0geTE7XG4gICAgb3V0WzJdID0gejE7XG4gICAgb3V0WzNdID0gdzE7XG4gICAgb3V0WzRdID0geDI7XG4gICAgb3V0WzVdID0geTI7XG4gICAgb3V0WzZdID0gejI7XG4gICAgb3V0WzddID0gdzI7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2V0cyB0aGUgcmVhbCBwYXJ0IG9mIGEgZHVhbCBxdWF0XG4gICAqIEBwYXJhbSAge3F1YXR9IG91dCByZWFsIHBhcnRcbiAgICogQHBhcmFtICB7cXVhdDJ9IGEgRHVhbCBRdWF0ZXJuaW9uXG4gICAqIEByZXR1cm4ge3F1YXR9IHJlYWwgcGFydFxuICAgKi9cblxuICB2YXIgZ2V0UmVhbCA9IGNvcHkkNjtcbiAgLyoqXG4gICAqIEdldHMgdGhlIGR1YWwgcGFydCBvZiBhIGR1YWwgcXVhdFxuICAgKiBAcGFyYW0gIHtxdWF0fSBvdXQgZHVhbCBwYXJ0XG4gICAqIEBwYXJhbSAge3F1YXQyfSBhIER1YWwgUXVhdGVybmlvblxuICAgKiBAcmV0dXJuIHtxdWF0fSBkdWFsIHBhcnRcbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0RHVhbChvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzRdO1xuICAgIG91dFsxXSA9IGFbNV07XG4gICAgb3V0WzJdID0gYVs2XTtcbiAgICBvdXRbM10gPSBhWzddO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVhbCBjb21wb25lbnQgb2YgYSBkdWFsIHF1YXQgdG8gdGhlIGdpdmVuIHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXR9IHEgYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcmVhbCBwYXJ0XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc2V0UmVhbCA9IGNvcHkkNjtcbiAgLyoqXG4gICAqIFNldCB0aGUgZHVhbCBjb21wb25lbnQgb2YgYSBkdWFsIHF1YXQgdG8gdGhlIGdpdmVuIHF1YXRlcm5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXR9IHEgYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgZHVhbCBwYXJ0XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBzZXREdWFsKG91dCwgcSkge1xuICAgIG91dFs0XSA9IHFbMF07XG4gICAgb3V0WzVdID0gcVsxXTtcbiAgICBvdXRbNl0gPSBxWzJdO1xuICAgIG91dFs3XSA9IHFbM107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2V0cyB0aGUgdHJhbnNsYXRpb24gb2YgYSBub3JtYWxpemVkIGR1YWwgcXVhdFxuICAgKiBAcGFyYW0gIHt2ZWMzfSBvdXQgdHJhbnNsYXRpb25cbiAgICogQHBhcmFtICB7cXVhdDJ9IGEgRHVhbCBRdWF0ZXJuaW9uIHRvIGJlIGRlY29tcG9zZWRcbiAgICogQHJldHVybiB7dmVjM30gdHJhbnNsYXRpb25cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0VHJhbnNsYXRpb24kMShvdXQsIGEpIHtcbiAgICB2YXIgYXggPSBhWzRdLFxuICAgICAgICBheSA9IGFbNV0sXG4gICAgICAgIGF6ID0gYVs2XSxcbiAgICAgICAgYXcgPSBhWzddLFxuICAgICAgICBieCA9IC1hWzBdLFxuICAgICAgICBieSA9IC1hWzFdLFxuICAgICAgICBieiA9IC1hWzJdLFxuICAgICAgICBidyA9IGFbM107XG4gICAgb3V0WzBdID0gKGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnkpICogMjtcbiAgICBvdXRbMV0gPSAoYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBieikgKiAyO1xuICAgIG91dFsyXSA9IChheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4KSAqIDI7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNsYXRlcyBhIGR1YWwgcXVhdCBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHRoZSBkdWFsIHF1YXRlcm5pb24gdG8gdHJhbnNsYXRlXG4gICAqIEBwYXJhbSB7dmVjM30gdiB2ZWN0b3IgdG8gdHJhbnNsYXRlIGJ5XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZSQzKG91dCwgYSwgdikge1xuICAgIHZhciBheDEgPSBhWzBdLFxuICAgICAgICBheTEgPSBhWzFdLFxuICAgICAgICBhejEgPSBhWzJdLFxuICAgICAgICBhdzEgPSBhWzNdLFxuICAgICAgICBieDEgPSB2WzBdICogMC41LFxuICAgICAgICBieTEgPSB2WzFdICogMC41LFxuICAgICAgICBiejEgPSB2WzJdICogMC41LFxuICAgICAgICBheDIgPSBhWzRdLFxuICAgICAgICBheTIgPSBhWzVdLFxuICAgICAgICBhejIgPSBhWzZdLFxuICAgICAgICBhdzIgPSBhWzddO1xuICAgIG91dFswXSA9IGF4MTtcbiAgICBvdXRbMV0gPSBheTE7XG4gICAgb3V0WzJdID0gYXoxO1xuICAgIG91dFszXSA9IGF3MTtcbiAgICBvdXRbNF0gPSBhdzEgKiBieDEgKyBheTEgKiBiejEgLSBhejEgKiBieTEgKyBheDI7XG4gICAgb3V0WzVdID0gYXcxICogYnkxICsgYXoxICogYngxIC0gYXgxICogYnoxICsgYXkyO1xuICAgIG91dFs2XSA9IGF3MSAqIGJ6MSArIGF4MSAqIGJ5MSAtIGF5MSAqIGJ4MSArIGF6MjtcbiAgICBvdXRbN10gPSAtYXgxICogYngxIC0gYXkxICogYnkxIC0gYXoxICogYnoxICsgYXcyO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJvdGF0ZXMgYSBkdWFsIHF1YXQgYXJvdW5kIHRoZSBYIGF4aXNcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgZHVhbCBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgdGhlIGR1YWwgcXVhdGVybmlvbiB0byByb3RhdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCBob3cgZmFyIHNob3VsZCB0aGUgcm90YXRpb24gYmVcbiAgICogQHJldHVybnMge3F1YXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gcm90YXRlWCQzKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGJ4ID0gLWFbMF0sXG4gICAgICAgIGJ5ID0gLWFbMV0sXG4gICAgICAgIGJ6ID0gLWFbMl0sXG4gICAgICAgIGJ3ID0gYVszXSxcbiAgICAgICAgYXggPSBhWzRdLFxuICAgICAgICBheSA9IGFbNV0sXG4gICAgICAgIGF6ID0gYVs2XSxcbiAgICAgICAgYXcgPSBhWzddLFxuICAgICAgICBheDEgPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5LFxuICAgICAgICBheTEgPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6LFxuICAgICAgICBhejEgPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4LFxuICAgICAgICBhdzEgPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgIHJvdGF0ZVgkMihvdXQsIGEsIHJhZCk7XG4gICAgYnggPSBvdXRbMF07XG4gICAgYnkgPSBvdXRbMV07XG4gICAgYnogPSBvdXRbMl07XG4gICAgYncgPSBvdXRbM107XG4gICAgb3V0WzRdID0gYXgxICogYncgKyBhdzEgKiBieCArIGF5MSAqIGJ6IC0gYXoxICogYnk7XG4gICAgb3V0WzVdID0gYXkxICogYncgKyBhdzEgKiBieSArIGF6MSAqIGJ4IC0gYXgxICogYno7XG4gICAgb3V0WzZdID0gYXoxICogYncgKyBhdzEgKiBieiArIGF4MSAqIGJ5IC0gYXkxICogYng7XG4gICAgb3V0WzddID0gYXcxICogYncgLSBheDEgKiBieCAtIGF5MSAqIGJ5IC0gYXoxICogYno7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUm90YXRlcyBhIGR1YWwgcXVhdCBhcm91bmQgdGhlIFkgYXhpc1xuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBvdXQgdGhlIHJlY2VpdmluZyBkdWFsIHF1YXRlcm5pb25cbiAgICogQHBhcmFtIHtxdWF0Mn0gYSB0aGUgZHVhbCBxdWF0ZXJuaW9uIHRvIHJvdGF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIGhvdyBmYXIgc2hvdWxkIHRoZSByb3RhdGlvbiBiZVxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVZJDMob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYnggPSAtYVswXSxcbiAgICAgICAgYnkgPSAtYVsxXSxcbiAgICAgICAgYnogPSAtYVsyXSxcbiAgICAgICAgYncgPSBhWzNdLFxuICAgICAgICBheCA9IGFbNF0sXG4gICAgICAgIGF5ID0gYVs1XSxcbiAgICAgICAgYXogPSBhWzZdLFxuICAgICAgICBhdyA9IGFbN10sXG4gICAgICAgIGF4MSA9IGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnksXG4gICAgICAgIGF5MSA9IGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYnosXG4gICAgICAgIGF6MSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYngsXG4gICAgICAgIGF3MSA9IGF3ICogYncgLSBheCAqIGJ4IC0gYXkgKiBieSAtIGF6ICogYno7XG4gICAgcm90YXRlWSQyKG91dCwgYSwgcmFkKTtcbiAgICBieCA9IG91dFswXTtcbiAgICBieSA9IG91dFsxXTtcbiAgICBieiA9IG91dFsyXTtcbiAgICBidyA9IG91dFszXTtcbiAgICBvdXRbNF0gPSBheDEgKiBidyArIGF3MSAqIGJ4ICsgYXkxICogYnogLSBhejEgKiBieTtcbiAgICBvdXRbNV0gPSBheTEgKiBidyArIGF3MSAqIGJ5ICsgYXoxICogYnggLSBheDEgKiBiejtcbiAgICBvdXRbNl0gPSBhejEgKiBidyArIGF3MSAqIGJ6ICsgYXgxICogYnkgLSBheTEgKiBieDtcbiAgICBvdXRbN10gPSBhdzEgKiBidyAtIGF4MSAqIGJ4IC0gYXkxICogYnkgLSBhejEgKiBiejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgZHVhbCBxdWF0IGFyb3VuZCB0aGUgWiBheGlzXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHRoZSBkdWFsIHF1YXRlcm5pb24gdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgaG93IGZhciBzaG91bGQgdGhlIHJvdGF0aW9uIGJlXG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVokMyhvdXQsIGEsIHJhZCkge1xuICAgIHZhciBieCA9IC1hWzBdLFxuICAgICAgICBieSA9IC1hWzFdLFxuICAgICAgICBieiA9IC1hWzJdLFxuICAgICAgICBidyA9IGFbM10sXG4gICAgICAgIGF4ID0gYVs0XSxcbiAgICAgICAgYXkgPSBhWzVdLFxuICAgICAgICBheiA9IGFbNl0sXG4gICAgICAgIGF3ID0gYVs3XSxcbiAgICAgICAgYXgxID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieSxcbiAgICAgICAgYXkxID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBieixcbiAgICAgICAgYXoxID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieCxcbiAgICAgICAgYXcxID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcbiAgICByb3RhdGVaJDIob3V0LCBhLCByYWQpO1xuICAgIGJ4ID0gb3V0WzBdO1xuICAgIGJ5ID0gb3V0WzFdO1xuICAgIGJ6ID0gb3V0WzJdO1xuICAgIGJ3ID0gb3V0WzNdO1xuICAgIG91dFs0XSA9IGF4MSAqIGJ3ICsgYXcxICogYnggKyBheTEgKiBieiAtIGF6MSAqIGJ5O1xuICAgIG91dFs1XSA9IGF5MSAqIGJ3ICsgYXcxICogYnkgKyBhejEgKiBieCAtIGF4MSAqIGJ6O1xuICAgIG91dFs2XSA9IGF6MSAqIGJ3ICsgYXcxICogYnogKyBheDEgKiBieSAtIGF5MSAqIGJ4O1xuICAgIG91dFs3XSA9IGF3MSAqIGJ3IC0gYXgxICogYnggLSBheTEgKiBieSAtIGF6MSAqIGJ6O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJvdGF0ZXMgYSBkdWFsIHF1YXQgYnkgYSBnaXZlbiBxdWF0ZXJuaW9uIChhICogcSlcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgZHVhbCBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgdGhlIGR1YWwgcXVhdGVybmlvbiB0byByb3RhdGVcbiAgICogQHBhcmFtIHtxdWF0fSBxIHF1YXRlcm5pb24gdG8gcm90YXRlIGJ5XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZUJ5UXVhdEFwcGVuZChvdXQsIGEsIHEpIHtcbiAgICB2YXIgcXggPSBxWzBdLFxuICAgICAgICBxeSA9IHFbMV0sXG4gICAgICAgIHF6ID0gcVsyXSxcbiAgICAgICAgcXcgPSBxWzNdLFxuICAgICAgICBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXSxcbiAgICAgICAgYXogPSBhWzJdLFxuICAgICAgICBhdyA9IGFbM107XG4gICAgb3V0WzBdID0gYXggKiBxdyArIGF3ICogcXggKyBheSAqIHF6IC0gYXogKiBxeTtcbiAgICBvdXRbMV0gPSBheSAqIHF3ICsgYXcgKiBxeSArIGF6ICogcXggLSBheCAqIHF6O1xuICAgIG91dFsyXSA9IGF6ICogcXcgKyBhdyAqIHF6ICsgYXggKiBxeSAtIGF5ICogcXg7XG4gICAgb3V0WzNdID0gYXcgKiBxdyAtIGF4ICogcXggLSBheSAqIHF5IC0gYXogKiBxejtcbiAgICBheCA9IGFbNF07XG4gICAgYXkgPSBhWzVdO1xuICAgIGF6ID0gYVs2XTtcbiAgICBhdyA9IGFbN107XG4gICAgb3V0WzRdID0gYXggKiBxdyArIGF3ICogcXggKyBheSAqIHF6IC0gYXogKiBxeTtcbiAgICBvdXRbNV0gPSBheSAqIHF3ICsgYXcgKiBxeSArIGF6ICogcXggLSBheCAqIHF6O1xuICAgIG91dFs2XSA9IGF6ICogcXcgKyBhdyAqIHF6ICsgYXggKiBxeSAtIGF5ICogcXg7XG4gICAgb3V0WzddID0gYXcgKiBxdyAtIGF4ICogcXggLSBheSAqIHF5IC0gYXogKiBxejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSb3RhdGVzIGEgZHVhbCBxdWF0IGJ5IGEgZ2l2ZW4gcXVhdGVybmlvbiAocSAqIGEpXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXR9IHEgcXVhdGVybmlvbiB0byByb3RhdGUgYnlcbiAgICogQHBhcmFtIHtxdWF0Mn0gYSB0aGUgZHVhbCBxdWF0ZXJuaW9uIHRvIHJvdGF0ZVxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGVCeVF1YXRQcmVwZW5kKG91dCwgcSwgYSkge1xuICAgIHZhciBxeCA9IHFbMF0sXG4gICAgICAgIHF5ID0gcVsxXSxcbiAgICAgICAgcXogPSBxWzJdLFxuICAgICAgICBxdyA9IHFbM10sXG4gICAgICAgIGJ4ID0gYVswXSxcbiAgICAgICAgYnkgPSBhWzFdLFxuICAgICAgICBieiA9IGFbMl0sXG4gICAgICAgIGJ3ID0gYVszXTtcbiAgICBvdXRbMF0gPSBxeCAqIGJ3ICsgcXcgKiBieCArIHF5ICogYnogLSBxeiAqIGJ5O1xuICAgIG91dFsxXSA9IHF5ICogYncgKyBxdyAqIGJ5ICsgcXogKiBieCAtIHF4ICogYno7XG4gICAgb3V0WzJdID0gcXogKiBidyArIHF3ICogYnogKyBxeCAqIGJ5IC0gcXkgKiBieDtcbiAgICBvdXRbM10gPSBxdyAqIGJ3IC0gcXggKiBieCAtIHF5ICogYnkgLSBxeiAqIGJ6O1xuICAgIGJ4ID0gYVs0XTtcbiAgICBieSA9IGFbNV07XG4gICAgYnogPSBhWzZdO1xuICAgIGJ3ID0gYVs3XTtcbiAgICBvdXRbNF0gPSBxeCAqIGJ3ICsgcXcgKiBieCArIHF5ICogYnogLSBxeiAqIGJ5O1xuICAgIG91dFs1XSA9IHF5ICogYncgKyBxdyAqIGJ5ICsgcXogKiBieCAtIHF4ICogYno7XG4gICAgb3V0WzZdID0gcXogKiBidyArIHF3ICogYnogKyBxeCAqIGJ5IC0gcXkgKiBieDtcbiAgICBvdXRbN10gPSBxdyAqIGJ3IC0gcXggKiBieCAtIHF5ICogYnkgLSBxeiAqIGJ6O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJvdGF0ZXMgYSBkdWFsIHF1YXQgYXJvdW5kIGEgZ2l2ZW4gYXhpcy4gRG9lcyB0aGUgbm9ybWFsaXNhdGlvbiBhdXRvbWF0aWNhbGx5XG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHRoZSBkdWFsIHF1YXRlcm5pb24gdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7dmVjM30gYXhpcyB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgaG93IGZhciB0aGUgcm90YXRpb24gc2hvdWxkIGJlXG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZUFyb3VuZEF4aXMob3V0LCBhLCBheGlzLCByYWQpIHtcbiAgICAvL1NwZWNpYWwgY2FzZSBmb3IgcmFkID0gMFxuICAgIGlmIChNYXRoLmFicyhyYWQpIDwgRVBTSUxPTikge1xuICAgICAgcmV0dXJuIGNvcHkkNyhvdXQsIGEpO1xuICAgIH1cblxuICAgIHZhciBheGlzTGVuZ3RoID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XG4gICAgcmFkID0gcmFkICogMC41O1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICB2YXIgYnggPSBzICogYXhpc1swXSAvIGF4aXNMZW5ndGg7XG4gICAgdmFyIGJ5ID0gcyAqIGF4aXNbMV0gLyBheGlzTGVuZ3RoO1xuICAgIHZhciBieiA9IHMgKiBheGlzWzJdIC8gYXhpc0xlbmd0aDtcbiAgICB2YXIgYncgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHZhciBheDEgPSBhWzBdLFxuICAgICAgICBheTEgPSBhWzFdLFxuICAgICAgICBhejEgPSBhWzJdLFxuICAgICAgICBhdzEgPSBhWzNdO1xuICAgIG91dFswXSA9IGF4MSAqIGJ3ICsgYXcxICogYnggKyBheTEgKiBieiAtIGF6MSAqIGJ5O1xuICAgIG91dFsxXSA9IGF5MSAqIGJ3ICsgYXcxICogYnkgKyBhejEgKiBieCAtIGF4MSAqIGJ6O1xuICAgIG91dFsyXSA9IGF6MSAqIGJ3ICsgYXcxICogYnogKyBheDEgKiBieSAtIGF5MSAqIGJ4O1xuICAgIG91dFszXSA9IGF3MSAqIGJ3IC0gYXgxICogYnggLSBheTEgKiBieSAtIGF6MSAqIGJ6O1xuICAgIHZhciBheCA9IGFbNF0sXG4gICAgICAgIGF5ID0gYVs1XSxcbiAgICAgICAgYXogPSBhWzZdLFxuICAgICAgICBhdyA9IGFbN107XG4gICAgb3V0WzRdID0gYXggKiBidyArIGF3ICogYnggKyBheSAqIGJ6IC0gYXogKiBieTtcbiAgICBvdXRbNV0gPSBheSAqIGJ3ICsgYXcgKiBieSArIGF6ICogYnggLSBheCAqIGJ6O1xuICAgIG91dFs2XSA9IGF6ICogYncgKyBhdyAqIGJ6ICsgYXggKiBieSAtIGF5ICogYng7XG4gICAgb3V0WzddID0gYXcgKiBidyAtIGF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBiejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byBkdWFsIHF1YXQnc1xuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBvdXQgdGhlIHJlY2VpdmluZyBkdWFsIHF1YXRlcm5pb25cbiAgICogQHBhcmFtIHtxdWF0Mn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3F1YXQyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgZnVuY3Rpb24gYWRkJDcob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSArIGJbM107XG4gICAgb3V0WzRdID0gYVs0XSArIGJbNF07XG4gICAgb3V0WzVdID0gYVs1XSArIGJbNV07XG4gICAgb3V0WzZdID0gYVs2XSArIGJbNl07XG4gICAgb3V0WzddID0gYVs3XSArIGJbN107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTXVsdGlwbGllcyB0d28gZHVhbCBxdWF0J3NcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgZHVhbCBxdWF0ZXJuaW9uXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHtxdWF0Mn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3F1YXQyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbXVsdGlwbHkkNyhvdXQsIGEsIGIpIHtcbiAgICB2YXIgYXgwID0gYVswXSxcbiAgICAgICAgYXkwID0gYVsxXSxcbiAgICAgICAgYXowID0gYVsyXSxcbiAgICAgICAgYXcwID0gYVszXSxcbiAgICAgICAgYngxID0gYls0XSxcbiAgICAgICAgYnkxID0gYls1XSxcbiAgICAgICAgYnoxID0gYls2XSxcbiAgICAgICAgYncxID0gYls3XSxcbiAgICAgICAgYXgxID0gYVs0XSxcbiAgICAgICAgYXkxID0gYVs1XSxcbiAgICAgICAgYXoxID0gYVs2XSxcbiAgICAgICAgYXcxID0gYVs3XSxcbiAgICAgICAgYngwID0gYlswXSxcbiAgICAgICAgYnkwID0gYlsxXSxcbiAgICAgICAgYnowID0gYlsyXSxcbiAgICAgICAgYncwID0gYlszXTtcbiAgICBvdXRbMF0gPSBheDAgKiBidzAgKyBhdzAgKiBieDAgKyBheTAgKiBiejAgLSBhejAgKiBieTA7XG4gICAgb3V0WzFdID0gYXkwICogYncwICsgYXcwICogYnkwICsgYXowICogYngwIC0gYXgwICogYnowO1xuICAgIG91dFsyXSA9IGF6MCAqIGJ3MCArIGF3MCAqIGJ6MCArIGF4MCAqIGJ5MCAtIGF5MCAqIGJ4MDtcbiAgICBvdXRbM10gPSBhdzAgKiBidzAgLSBheDAgKiBieDAgLSBheTAgKiBieTAgLSBhejAgKiBiejA7XG4gICAgb3V0WzRdID0gYXgwICogYncxICsgYXcwICogYngxICsgYXkwICogYnoxIC0gYXowICogYnkxICsgYXgxICogYncwICsgYXcxICogYngwICsgYXkxICogYnowIC0gYXoxICogYnkwO1xuICAgIG91dFs1XSA9IGF5MCAqIGJ3MSArIGF3MCAqIGJ5MSArIGF6MCAqIGJ4MSAtIGF4MCAqIGJ6MSArIGF5MSAqIGJ3MCArIGF3MSAqIGJ5MCArIGF6MSAqIGJ4MCAtIGF4MSAqIGJ6MDtcbiAgICBvdXRbNl0gPSBhejAgKiBidzEgKyBhdzAgKiBiejEgKyBheDAgKiBieTEgLSBheTAgKiBieDEgKyBhejEgKiBidzAgKyBhdzEgKiBiejAgKyBheDEgKiBieTAgLSBheTEgKiBieDA7XG4gICAgb3V0WzddID0gYXcwICogYncxIC0gYXgwICogYngxIC0gYXkwICogYnkxIC0gYXowICogYnoxICsgYXcxICogYncwIC0gYXgxICogYngwIC0gYXkxICogYnkwIC0gYXoxICogYnowO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgcXVhdDIubXVsdGlwbHl9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbXVsJDcgPSBtdWx0aXBseSQ3O1xuICAvKipcbiAgICogU2NhbGVzIGEgZHVhbCBxdWF0IGJ5IGEgc2NhbGFyIG51bWJlclxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBvdXQgdGhlIHJlY2VpdmluZyBkdWFsIHF1YXRcbiAgICogQHBhcmFtIHtxdWF0Mn0gYSB0aGUgZHVhbCBxdWF0IHRvIHNjYWxlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgZHVhbCBxdWF0IGJ5XG4gICAqIEByZXR1cm5zIHtxdWF0Mn0gb3V0XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBzY2FsZSQ3KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIG91dFs0XSA9IGFbNF0gKiBiO1xuICAgIG91dFs1XSA9IGFbNV0gKiBiO1xuICAgIG91dFs2XSA9IGFbNl0gKiBiO1xuICAgIG91dFs3XSA9IGFbN10gKiBiO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBkdWFsIHF1YXQncyAoVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSByZWFsIHBhcnRzKVxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRvdCBwcm9kdWN0IG9mIGEgYW5kIGJcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBkb3QkMyA9IGRvdCQyO1xuICAvKipcbiAgICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBkdWFsIHF1YXRzJ3NcbiAgICogTk9URTogVGhlIHJlc3VsdGluZyBkdWFsIHF1YXRlcm5pb25zIHdvbid0IGFsd2F5cyBiZSBub3JtYWxpemVkIChUaGUgZXJyb3IgaXMgbW9zdCBub3RpY2VhYmxlIHdoZW4gdCA9IDAuNSlcbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgZHVhbCBxdWF0XG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHtxdWF0Mn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQsIGluIHRoZSByYW5nZSBbMC0xXSwgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBsZXJwJDMob3V0LCBhLCBiLCB0KSB7XG4gICAgdmFyIG10ID0gMSAtIHQ7XG4gICAgaWYgKGRvdCQzKGEsIGIpIDwgMCkgdCA9IC10O1xuICAgIG91dFswXSA9IGFbMF0gKiBtdCArIGJbMF0gKiB0O1xuICAgIG91dFsxXSA9IGFbMV0gKiBtdCArIGJbMV0gKiB0O1xuICAgIG91dFsyXSA9IGFbMl0gKiBtdCArIGJbMl0gKiB0O1xuICAgIG91dFszXSA9IGFbM10gKiBtdCArIGJbM10gKiB0O1xuICAgIG91dFs0XSA9IGFbNF0gKiBtdCArIGJbNF0gKiB0O1xuICAgIG91dFs1XSA9IGFbNV0gKiBtdCArIGJbNV0gKiB0O1xuICAgIG91dFs2XSA9IGFbNl0gKiBtdCArIGJbNl0gKiB0O1xuICAgIG91dFs3XSA9IGFbN10gKiBtdCArIGJbN10gKiB0O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGludmVyc2Ugb2YgYSBkdWFsIHF1YXQuIElmIHRoZXkgYXJlIG5vcm1hbGl6ZWQsIGNvbmp1Z2F0ZSBpcyBjaGVhcGVyXG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIGR1YWwgcXVhdCB0byBjYWxjdWxhdGUgaW52ZXJzZSBvZlxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBpbnZlcnQkNShvdXQsIGEpIHtcbiAgICB2YXIgc3FsZW4gPSBzcXVhcmVkTGVuZ3RoJDMoYSk7XG4gICAgb3V0WzBdID0gLWFbMF0gLyBzcWxlbjtcbiAgICBvdXRbMV0gPSAtYVsxXSAvIHNxbGVuO1xuICAgIG91dFsyXSA9IC1hWzJdIC8gc3FsZW47XG4gICAgb3V0WzNdID0gYVszXSAvIHNxbGVuO1xuICAgIG91dFs0XSA9IC1hWzRdIC8gc3FsZW47XG4gICAgb3V0WzVdID0gLWFbNV0gLyBzcWxlbjtcbiAgICBvdXRbNl0gPSAtYVs2XSAvIHNxbGVuO1xuICAgIG91dFs3XSA9IGFbN10gLyBzcWxlbjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBjb25qdWdhdGUgb2YgYSBkdWFsIHF1YXRcbiAgICogSWYgdGhlIGR1YWwgcXVhdGVybmlvbiBpcyBub3JtYWxpemVkLCB0aGlzIGZ1bmN0aW9uIGlzIGZhc3RlciB0aGFuIHF1YXQyLmludmVyc2UgYW5kIHByb2R1Y2VzIHRoZSBzYW1lIHJlc3VsdC5cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHF1YXQgdG8gY2FsY3VsYXRlIGNvbmp1Z2F0ZSBvZlxuICAgKiBAcmV0dXJucyB7cXVhdDJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBjb25qdWdhdGUkMShvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IC1hWzRdO1xuICAgIG91dFs1XSA9IC1hWzVdO1xuICAgIG91dFs2XSA9IC1hWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgZHVhbCBxdWF0XG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgZHVhbCBxdWF0IHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAgICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBsZW5ndGgkMyA9IGxlbmd0aCQyO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayBxdWF0Mi5sZW5ndGh9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgbGVuJDMgPSBsZW5ndGgkMztcbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgZHVhbCBxdWF0XG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGEgZHVhbCBxdWF0IHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGxlbmd0aCBvZiBhXG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc3F1YXJlZExlbmd0aCQzID0gc3F1YXJlZExlbmd0aCQyO1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayBxdWF0Mi5zcXVhcmVkTGVuZ3RofVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHNxckxlbiQzID0gc3F1YXJlZExlbmd0aCQzO1xuICAvKipcbiAgICogTm9ybWFsaXplIGEgZHVhbCBxdWF0XG4gICAqXG4gICAqIEBwYXJhbSB7cXVhdDJ9IG91dCB0aGUgcmVjZWl2aW5nIGR1YWwgcXVhdGVybmlvblxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIGR1YWwgcXVhdGVybmlvbiB0byBub3JtYWxpemVcbiAgICogQHJldHVybnMge3F1YXQyfSBvdXRcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSQzKG91dCwgYSkge1xuICAgIHZhciBtYWduaXR1ZGUgPSBzcXVhcmVkTGVuZ3RoJDMoYSk7XG5cbiAgICBpZiAobWFnbml0dWRlID4gMCkge1xuICAgICAgbWFnbml0dWRlID0gTWF0aC5zcXJ0KG1hZ25pdHVkZSk7XG4gICAgICB2YXIgYTAgPSBhWzBdIC8gbWFnbml0dWRlO1xuICAgICAgdmFyIGExID0gYVsxXSAvIG1hZ25pdHVkZTtcbiAgICAgIHZhciBhMiA9IGFbMl0gLyBtYWduaXR1ZGU7XG4gICAgICB2YXIgYTMgPSBhWzNdIC8gbWFnbml0dWRlO1xuICAgICAgdmFyIGIwID0gYVs0XTtcbiAgICAgIHZhciBiMSA9IGFbNV07XG4gICAgICB2YXIgYjIgPSBhWzZdO1xuICAgICAgdmFyIGIzID0gYVs3XTtcbiAgICAgIHZhciBhX2RvdF9iID0gYTAgKiBiMCArIGExICogYjEgKyBhMiAqIGIyICsgYTMgKiBiMztcbiAgICAgIG91dFswXSA9IGEwO1xuICAgICAgb3V0WzFdID0gYTE7XG4gICAgICBvdXRbMl0gPSBhMjtcbiAgICAgIG91dFszXSA9IGEzO1xuICAgICAgb3V0WzRdID0gKGIwIC0gYTAgKiBhX2RvdF9iKSAvIG1hZ25pdHVkZTtcbiAgICAgIG91dFs1XSA9IChiMSAtIGExICogYV9kb3RfYikgLyBtYWduaXR1ZGU7XG4gICAgICBvdXRbNl0gPSAoYjIgLSBhMiAqIGFfZG90X2IpIC8gbWFnbml0dWRlO1xuICAgICAgb3V0WzddID0gKGIzIC0gYTMgKiBhX2RvdF9iKSAvIG1hZ25pdHVkZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgZHVhbCBxdWF0ZW5pb25cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gYSBkdWFsIHF1YXRlcm5pb24gdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZHVhbCBxdWF0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN0ciQ3KGEpIHtcbiAgICByZXR1cm4gJ3F1YXQyKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJywgJyArIGFbNF0gKyAnLCAnICsgYVs1XSArICcsICcgKyBhWzZdICsgJywgJyArIGFbN10gKyAnKSc7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGR1YWwgcXVhdGVybmlvbnMgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICAgKlxuICAgKiBAcGFyYW0ge3F1YXQyfSBhIHRoZSBmaXJzdCBkdWFsIHF1YXRlcm5pb24uXG4gICAqIEBwYXJhbSB7cXVhdDJ9IGIgdGhlIHNlY29uZCBkdWFsIHF1YXRlcm5pb24uXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIHRoZSBkdWFsIHF1YXRlcm5pb25zIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBleGFjdEVxdWFscyQ3KGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSA9PT0gYlswXSAmJiBhWzFdID09PSBiWzFdICYmIGFbMl0gPT09IGJbMl0gJiYgYVszXSA9PT0gYlszXSAmJiBhWzRdID09PSBiWzRdICYmIGFbNV0gPT09IGJbNV0gJiYgYVs2XSA9PT0gYls2XSAmJiBhWzddID09PSBiWzddO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBkdWFsIHF1YXRlcm5pb25zIGhhdmUgYXBwcm94aW1hdGVseSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBwb3NpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtxdWF0Mn0gYSB0aGUgZmlyc3QgZHVhbCBxdWF0LlxuICAgKiBAcGFyYW0ge3F1YXQyfSBiIHRoZSBzZWNvbmQgZHVhbCBxdWF0LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgZHVhbCBxdWF0cyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXF1YWxzJDgoYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sXG4gICAgICAgIGExID0gYVsxXSxcbiAgICAgICAgYTIgPSBhWzJdLFxuICAgICAgICBhMyA9IGFbM10sXG4gICAgICAgIGE0ID0gYVs0XSxcbiAgICAgICAgYTUgPSBhWzVdLFxuICAgICAgICBhNiA9IGFbNl0sXG4gICAgICAgIGE3ID0gYVs3XTtcbiAgICB2YXIgYjAgPSBiWzBdLFxuICAgICAgICBiMSA9IGJbMV0sXG4gICAgICAgIGIyID0gYlsyXSxcbiAgICAgICAgYjMgPSBiWzNdLFxuICAgICAgICBiNCA9IGJbNF0sXG4gICAgICAgIGI1ID0gYls1XSxcbiAgICAgICAgYjYgPSBiWzZdLFxuICAgICAgICBiNyA9IGJbN107XG4gICAgcmV0dXJuIE1hdGguYWJzKGEwIC0gYjApIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEwKSwgTWF0aC5hYnMoYjApKSAmJiBNYXRoLmFicyhhMSAtIGIxKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMSksIE1hdGguYWJzKGIxKSkgJiYgTWF0aC5hYnMoYTIgLSBiMikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpICYmIE1hdGguYWJzKGEzIC0gYjMpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEzKSwgTWF0aC5hYnMoYjMpKSAmJiBNYXRoLmFicyhhNCAtIGI0KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNCksIE1hdGguYWJzKGI0KSkgJiYgTWF0aC5hYnMoYTUgLSBiNSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTUpLCBNYXRoLmFicyhiNSkpICYmIE1hdGguYWJzKGE2IC0gYjYpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE2KSwgTWF0aC5hYnMoYjYpKSAmJiBNYXRoLmFicyhhNyAtIGI3KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNyksIE1hdGguYWJzKGI3KSk7XG4gIH1cblxuICB2YXIgcXVhdDIgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgY3JlYXRlOiBjcmVhdGUkNyxcbiAgICBjbG9uZTogY2xvbmUkNyxcbiAgICBmcm9tVmFsdWVzOiBmcm9tVmFsdWVzJDcsXG4gICAgZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25WYWx1ZXM6IGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uVmFsdWVzLFxuICAgIGZyb21Sb3RhdGlvblRyYW5zbGF0aW9uOiBmcm9tUm90YXRpb25UcmFuc2xhdGlvbiQxLFxuICAgIGZyb21UcmFuc2xhdGlvbjogZnJvbVRyYW5zbGF0aW9uJDMsXG4gICAgZnJvbVJvdGF0aW9uOiBmcm9tUm90YXRpb24kNCxcbiAgICBmcm9tTWF0NDogZnJvbU1hdDQkMSxcbiAgICBjb3B5OiBjb3B5JDcsXG4gICAgaWRlbnRpdHk6IGlkZW50aXR5JDUsXG4gICAgc2V0OiBzZXQkNyxcbiAgICBnZXRSZWFsOiBnZXRSZWFsLFxuICAgIGdldER1YWw6IGdldER1YWwsXG4gICAgc2V0UmVhbDogc2V0UmVhbCxcbiAgICBzZXREdWFsOiBzZXREdWFsLFxuICAgIGdldFRyYW5zbGF0aW9uOiBnZXRUcmFuc2xhdGlvbiQxLFxuICAgIHRyYW5zbGF0ZTogdHJhbnNsYXRlJDMsXG4gICAgcm90YXRlWDogcm90YXRlWCQzLFxuICAgIHJvdGF0ZVk6IHJvdGF0ZVkkMyxcbiAgICByb3RhdGVaOiByb3RhdGVaJDMsXG4gICAgcm90YXRlQnlRdWF0QXBwZW5kOiByb3RhdGVCeVF1YXRBcHBlbmQsXG4gICAgcm90YXRlQnlRdWF0UHJlcGVuZDogcm90YXRlQnlRdWF0UHJlcGVuZCxcbiAgICByb3RhdGVBcm91bmRBeGlzOiByb3RhdGVBcm91bmRBeGlzLFxuICAgIGFkZDogYWRkJDcsXG4gICAgbXVsdGlwbHk6IG11bHRpcGx5JDcsXG4gICAgbXVsOiBtdWwkNyxcbiAgICBzY2FsZTogc2NhbGUkNyxcbiAgICBkb3Q6IGRvdCQzLFxuICAgIGxlcnA6IGxlcnAkMyxcbiAgICBpbnZlcnQ6IGludmVydCQ1LFxuICAgIGNvbmp1Z2F0ZTogY29uanVnYXRlJDEsXG4gICAgbGVuZ3RoOiBsZW5ndGgkMyxcbiAgICBsZW46IGxlbiQzLFxuICAgIHNxdWFyZWRMZW5ndGg6IHNxdWFyZWRMZW5ndGgkMyxcbiAgICBzcXJMZW46IHNxckxlbiQzLFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplJDMsXG4gICAgc3RyOiBzdHIkNyxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMkNyxcbiAgICBlcXVhbHM6IGVxdWFscyQ4XG4gIH0pO1xuXG4gIC8qKlxuICAgKiAyIERpbWVuc2lvbmFsIFZlY3RvclxuICAgKiBAbW9kdWxlIHZlYzJcbiAgICovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcsIGVtcHR5IHZlYzJcbiAgICpcbiAgICogQHJldHVybnMge3ZlYzJ9IGEgbmV3IDJEIHZlY3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGUkOCgpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEFSUkFZX1RZUEUoMik7XG5cbiAgICBpZiAoQVJSQVlfVFlQRSAhPSBGbG9hdDMyQXJyYXkpIHtcbiAgICAgIG91dFswXSA9IDA7XG4gICAgICBvdXRbMV0gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdmVjMiBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHZlY3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNsb25lXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBhIG5ldyAyRCB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xvbmUkOChhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBBUlJBWV9UWVBFKDIpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHZlYzIgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gICAqIEByZXR1cm5zIHt2ZWMyfSBhIG5ldyAyRCB2ZWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gZnJvbVZhbHVlcyQ4KHgsIHkpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEFSUkFZX1RZUEUoMik7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSB2ZWMyIHRvIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBzb3VyY2UgdmVjdG9yXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gY29weSQ4KG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMyIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAgICogQHJldHVybnMge3ZlYzJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzZXQkOChvdXQsIHgsIHkpIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogQWRkcyB0d28gdmVjMidzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gYWRkJDgob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogU3VidHJhY3RzIHZlY3RvciBiIGZyb20gdmVjdG9yIGFcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge3ZlYzJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBzdWJ0cmFjdCQ2KG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLSBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgdHdvIHZlYzInc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG11bHRpcGx5JDgob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogRGl2aWRlcyB0d28gdmVjMidzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZGl2aWRlJDIob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAvIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAvIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTWF0aC5jZWlsIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNlaWxcbiAgICogQHJldHVybnMge3ZlYzJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiBjZWlsJDIob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gTWF0aC5jZWlsKGFbMF0pO1xuICAgIG91dFsxXSA9IE1hdGguY2VpbChhWzFdKTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBNYXRoLmZsb29yIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGZsb29yXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gZmxvb3IkMihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBNYXRoLmZsb29yKGFbMF0pO1xuICAgIG91dFsxXSA9IE1hdGguZmxvb3IoYVsxXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gdmVjMidzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbWluJDIob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBvZiB0d28gdmVjMidzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbWF4JDIob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogTWF0aC5yb3VuZCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzJcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHZlY3RvciB0byByb3VuZFxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJvdW5kJDIob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gTWF0aC5yb3VuZChhWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLnJvdW5kKGFbMV0pO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFNjYWxlcyBhIHZlYzIgYnkgYSBzY2FsYXIgbnVtYmVyXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHNjYWxlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgdmVjdG9yIGJ5XG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gc2NhbGUkOChvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYjtcbiAgICBvdXRbMV0gPSBhWzFdICogYjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBBZGRzIHR3byB2ZWMyJ3MgYWZ0ZXIgc2NhbGluZyB0aGUgc2Vjb25kIG9wZXJhbmQgYnkgYSBzY2FsYXIgdmFsdWVcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIHRoZSBhbW91bnQgdG8gc2NhbGUgYiBieSBiZWZvcmUgYWRkaW5nXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gc2NhbGVBbmRBZGQkMihvdXQsIGEsIGIsIHNjYWxlKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF0gKiBzY2FsZTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXSAqIHNjYWxlO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMyJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGRpc3RhbmNlJDIoYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMyJ3NcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gICAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAgICovXG5cbiAgZnVuY3Rpb24gc3F1YXJlZERpc3RhbmNlJDIoYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXTtcbiAgICByZXR1cm4geCAqIHggKyB5ICogeTtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAgICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAgICovXG5cbiAgZnVuY3Rpb24gbGVuZ3RoJDQoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgfVxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSB2ZWMyXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAgICovXG5cbiAgZnVuY3Rpb24gc3F1YXJlZExlbmd0aCQ0KGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIHJldHVybiB4ICogeCArIHkgKiB5O1xuICB9XG4gIC8qKlxuICAgKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIG5lZ2F0ZSQyKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMyXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gaW52ZXJ0XG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gaW52ZXJzZSQyKG91dCwgYSkge1xuICAgIG91dFswXSA9IDEuMCAvIGFbMF07XG4gICAgb3V0WzFdID0gMS4wIC8gYVsxXTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBOb3JtYWxpemUgYSB2ZWMyXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gbm9ybWFsaXplXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplJDQob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICB2YXIgbGVuID0geCAqIHggKyB5ICogeTtcblxuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAvL1RPRE86IGV2YWx1YXRlIHVzZSBvZiBnbG1faW52c3FydCBoZXJlP1xuICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgIH1cblxuICAgIG91dFswXSA9IGFbMF0gKiBsZW47XG4gICAgb3V0WzFdID0gYVsxXSAqIGxlbjtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjMidzXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRvdCBwcm9kdWN0IG9mIGEgYW5kIGJcbiAgICovXG5cbiAgZnVuY3Rpb24gZG90JDQoYSwgYikge1xuICAgIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xuICB9XG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjMidzXG4gICAqIE5vdGUgdGhhdCB0aGUgY3Jvc3MgcHJvZHVjdCBtdXN0IGJ5IGRlZmluaXRpb24gcHJvZHVjZSBhIDNEIHZlY3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNyb3NzJDEob3V0LCBhLCBiKSB7XG4gICAgdmFyIHogPSBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xuICAgIG91dFswXSA9IG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHZlYzInc1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAgICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCwgaW4gdGhlIHJhbmdlIFswLTFdLCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gbGVycCQ0KG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSByYW5kb20gdmVjdG9yIHdpdGggdGhlIGdpdmVuIHNjYWxlXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdIExlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3Rvci4gSWYgb21taXR0ZWQsIGEgdW5pdCB2ZWN0b3Igd2lsbCBiZSByZXR1cm5lZFxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJhbmRvbSQzKG91dCwgc2NhbGUpIHtcbiAgICBzY2FsZSA9IHNjYWxlIHx8IDEuMDtcbiAgICB2YXIgciA9IFJBTkRPTSgpICogMi4wICogTWF0aC5QSTtcbiAgICBvdXRbMF0gPSBNYXRoLmNvcyhyKSAqIHNjYWxlO1xuICAgIG91dFsxXSA9IE1hdGguc2luKHIpICogc2NhbGU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0MlxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAgICogQHBhcmFtIHttYXQyfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDIob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBtWzBdICogeCArIG1bMl0gKiB5O1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVszXSAqIHk7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0MmRcbiAgICpcbiAgICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHt2ZWMyfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7bWF0MmR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0MmQob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBtWzBdICogeCArIG1bMl0gKiB5ICsgbVs0XTtcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bM10gKiB5ICsgbVs1XTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQzXG4gICAqIDNyZCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICAgKiBAcGFyYW0ge21hdDN9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gICAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0MyQxKG91dCwgYSwgbSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV07XG4gICAgb3V0WzBdID0gbVswXSAqIHggKyBtWzNdICogeSArIG1bNl07XG4gICAgb3V0WzFdID0gbVsxXSAqIHggKyBtWzRdICogeSArIG1bN107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0NFxuICAgKiAzcmQgdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcwJ1xuICAgKiA0dGggdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAgICogQHBhcmFtIHttYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybU1hdDQkMihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF07XG4gICAgdmFyIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzEyXTtcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsxM107XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogUm90YXRlIGEgMkQgdmVjdG9yXG4gICAqIEBwYXJhbSB7dmVjMn0gb3V0IFRoZSByZWNlaXZpbmcgdmVjMlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgVGhlIHZlYzIgcG9pbnQgdG8gcm90YXRlXG4gICAqIEBwYXJhbSB7dmVjMn0gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICAgKiBAcGFyYW0ge051bWJlcn0gYyBUaGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQHJldHVybnMge3ZlYzJ9IG91dFxuICAgKi9cblxuICBmdW5jdGlvbiByb3RhdGUkNChvdXQsIGEsIGIsIGMpIHtcbiAgICAvL1RyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgdmFyIHAwID0gYVswXSAtIGJbMF0sXG4gICAgICAgIHAxID0gYVsxXSAtIGJbMV0sXG4gICAgICAgIHNpbkMgPSBNYXRoLnNpbihjKSxcbiAgICAgICAgY29zQyA9IE1hdGguY29zKGMpOyAvL3BlcmZvcm0gcm90YXRpb24gYW5kIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG5cbiAgICBvdXRbMF0gPSBwMCAqIGNvc0MgLSBwMSAqIHNpbkMgKyBiWzBdO1xuICAgIG91dFsxXSA9IHAwICogc2luQyArIHAxICogY29zQyArIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICAvKipcbiAgICogR2V0IHRoZSBhbmdsZSBiZXR3ZWVuIHR3byAyRCB2ZWN0b3JzXG4gICAqIEBwYXJhbSB7dmVjMn0gYSBUaGUgZmlyc3Qgb3BlcmFuZFxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgVGhlIHNlY29uZCBvcGVyYW5kXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBhbmdsZSBpbiByYWRpYW5zXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGFuZ2xlJDEoYSwgYikge1xuICAgIHZhciB4MSA9IGFbMF0sXG4gICAgICAgIHkxID0gYVsxXSxcbiAgICAgICAgeDIgPSBiWzBdLFxuICAgICAgICB5MiA9IGJbMV07XG4gICAgdmFyIGxlbjEgPSB4MSAqIHgxICsgeTEgKiB5MTtcblxuICAgIGlmIChsZW4xID4gMCkge1xuICAgICAgLy9UT0RPOiBldmFsdWF0ZSB1c2Ugb2YgZ2xtX2ludnNxcnQgaGVyZT9cbiAgICAgIGxlbjEgPSAxIC8gTWF0aC5zcXJ0KGxlbjEpO1xuICAgIH1cblxuICAgIHZhciBsZW4yID0geDIgKiB4MiArIHkyICogeTI7XG5cbiAgICBpZiAobGVuMiA+IDApIHtcbiAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/XG4gICAgICBsZW4yID0gMSAvIE1hdGguc3FydChsZW4yKTtcbiAgICB9XG5cbiAgICB2YXIgY29zaW5lID0gKHgxICogeDIgKyB5MSAqIHkyKSAqIGxlbjEgKiBsZW4yO1xuXG4gICAgaWYgKGNvc2luZSA+IDEuMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChjb3NpbmUgPCAtMS4wKSB7XG4gICAgICByZXR1cm4gTWF0aC5QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGguYWNvcyhjb3NpbmUpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICAgKi9cblxuICBmdW5jdGlvbiBzdHIkOChhKSB7XG4gICAgcmV0dXJuICd2ZWMyKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnKSc7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHZlY3RvcnMgZXhhY3RseSBoYXZlIHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICAgKlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGEgVGhlIGZpcnN0IHZlY3Rvci5cbiAgICogQHBhcmFtIHt2ZWMyfSBiIFRoZSBzZWNvbmQgdmVjdG9yLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmVjdG9ycyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gZXhhY3RFcXVhbHMkOChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gPT09IGJbMF0gJiYgYVsxXSA9PT0gYlsxXTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdmVjdG9ycyBoYXZlIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7dmVjMn0gYSBUaGUgZmlyc3QgdmVjdG9yLlxuICAgKiBAcGFyYW0ge3ZlYzJ9IGIgVGhlIHNlY29uZCB2ZWN0b3IuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cblxuICBmdW5jdGlvbiBlcXVhbHMkOShhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSxcbiAgICAgICAgYTEgPSBhWzFdO1xuICAgIHZhciBiMCA9IGJbMF0sXG4gICAgICAgIGIxID0gYlsxXTtcbiAgICByZXR1cm4gTWF0aC5hYnMoYTAgLSBiMCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmIE1hdGguYWJzKGExIC0gYjEpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKTtcbiAgfVxuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLmxlbmd0aH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBsZW4kNCA9IGxlbmd0aCQ0O1xuICAvKipcbiAgICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLnN1YnRyYWN0fVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIHN1YiQ2ID0gc3VidHJhY3QkNjtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5tdWx0aXBseX1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBtdWwkOCA9IG11bHRpcGx5JDg7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuZGl2aWRlfVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG5cbiAgdmFyIGRpdiQyID0gZGl2aWRlJDI7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuZGlzdGFuY2V9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgZGlzdCQyID0gZGlzdGFuY2UkMjtcbiAgLyoqXG4gICAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5zcXVhcmVkRGlzdGFuY2V9XG4gICAqIEBmdW5jdGlvblxuICAgKi9cblxuICB2YXIgc3FyRGlzdCQyID0gc3F1YXJlZERpc3RhbmNlJDI7XG4gIC8qKlxuICAgKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3F1YXJlZExlbmd0aH1cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBzcXJMZW4kNCA9IHNxdWFyZWRMZW5ndGgkNDtcbiAgLyoqXG4gICAqIFBlcmZvcm0gc29tZSBvcGVyYXRpb24gb3ZlciBhbiBhcnJheSBvZiB2ZWMycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gYSB0aGUgYXJyYXkgb2YgdmVjdG9ycyB0byBpdGVyYXRlIG92ZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSBOdW1iZXIgb2YgZWxlbWVudHMgYmV0d2VlbiB0aGUgc3RhcnQgb2YgZWFjaCB2ZWMyLiBJZiAwIGFzc3VtZXMgdGlnaHRseSBwYWNrZWRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIHZlYzJzIHRvIGl0ZXJhdGUgb3Zlci4gSWYgMCBpdGVyYXRlcyBvdmVyIGVudGlyZSBhcnJheVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHZlY3RvciBpbiB0aGUgYXJyYXlcbiAgICogQHBhcmFtIHtPYmplY3R9IFthcmddIGFkZGl0aW9uYWwgYXJndW1lbnQgdG8gcGFzcyB0byBmblxuICAgKiBAcmV0dXJucyB7QXJyYXl9IGFcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuXG4gIHZhciBmb3JFYWNoJDIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZlYyA9IGNyZWF0ZSQ4KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBzdHJpZGUsIG9mZnNldCwgY291bnQsIGZuLCBhcmcpIHtcbiAgICAgIHZhciBpLCBsO1xuXG4gICAgICBpZiAoIXN0cmlkZSkge1xuICAgICAgICBzdHJpZGUgPSAyO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9mZnNldCkge1xuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgbCA9IE1hdGgubWluKGNvdW50ICogc3RyaWRlICsgb2Zmc2V0LCBhLmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsID0gYS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IG9mZnNldDsgaSA8IGw7IGkgKz0gc3RyaWRlKSB7XG4gICAgICAgIHZlY1swXSA9IGFbaV07XG4gICAgICAgIHZlY1sxXSA9IGFbaSArIDFdO1xuICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgYVtpXSA9IHZlY1swXTtcbiAgICAgICAgYVtpICsgMV0gPSB2ZWNbMV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhO1xuICAgIH07XG4gIH0oKTtcblxuICB2YXIgdmVjMiA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBjcmVhdGU6IGNyZWF0ZSQ4LFxuICAgIGNsb25lOiBjbG9uZSQ4LFxuICAgIGZyb21WYWx1ZXM6IGZyb21WYWx1ZXMkOCxcbiAgICBjb3B5OiBjb3B5JDgsXG4gICAgc2V0OiBzZXQkOCxcbiAgICBhZGQ6IGFkZCQ4LFxuICAgIHN1YnRyYWN0OiBzdWJ0cmFjdCQ2LFxuICAgIG11bHRpcGx5OiBtdWx0aXBseSQ4LFxuICAgIGRpdmlkZTogZGl2aWRlJDIsXG4gICAgY2VpbDogY2VpbCQyLFxuICAgIGZsb29yOiBmbG9vciQyLFxuICAgIG1pbjogbWluJDIsXG4gICAgbWF4OiBtYXgkMixcbiAgICByb3VuZDogcm91bmQkMixcbiAgICBzY2FsZTogc2NhbGUkOCxcbiAgICBzY2FsZUFuZEFkZDogc2NhbGVBbmRBZGQkMixcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UkMixcbiAgICBzcXVhcmVkRGlzdGFuY2U6IHNxdWFyZWREaXN0YW5jZSQyLFxuICAgIGxlbmd0aDogbGVuZ3RoJDQsXG4gICAgc3F1YXJlZExlbmd0aDogc3F1YXJlZExlbmd0aCQ0LFxuICAgIG5lZ2F0ZTogbmVnYXRlJDIsXG4gICAgaW52ZXJzZTogaW52ZXJzZSQyLFxuICAgIG5vcm1hbGl6ZTogbm9ybWFsaXplJDQsXG4gICAgZG90OiBkb3QkNCxcbiAgICBjcm9zczogY3Jvc3MkMSxcbiAgICBsZXJwOiBsZXJwJDQsXG4gICAgcmFuZG9tOiByYW5kb20kMyxcbiAgICB0cmFuc2Zvcm1NYXQyOiB0cmFuc2Zvcm1NYXQyLFxuICAgIHRyYW5zZm9ybU1hdDJkOiB0cmFuc2Zvcm1NYXQyZCxcbiAgICB0cmFuc2Zvcm1NYXQzOiB0cmFuc2Zvcm1NYXQzJDEsXG4gICAgdHJhbnNmb3JtTWF0NDogdHJhbnNmb3JtTWF0NCQyLFxuICAgIHJvdGF0ZTogcm90YXRlJDQsXG4gICAgYW5nbGU6IGFuZ2xlJDEsXG4gICAgc3RyOiBzdHIkOCxcbiAgICBleGFjdEVxdWFsczogZXhhY3RFcXVhbHMkOCxcbiAgICBlcXVhbHM6IGVxdWFscyQ5LFxuICAgIGxlbjogbGVuJDQsXG4gICAgc3ViOiBzdWIkNixcbiAgICBtdWw6IG11bCQ4LFxuICAgIGRpdjogZGl2JDIsXG4gICAgZGlzdDogZGlzdCQyLFxuICAgIHNxckRpc3Q6IHNxckRpc3QkMixcbiAgICBzcXJMZW46IHNxckxlbiQ0LFxuICAgIGZvckVhY2g6IGZvckVhY2gkMlxuICB9KTtcblxuICBleHBvcnRzLmdsTWF0cml4ID0gY29tbW9uO1xuICBleHBvcnRzLm1hdDIgPSBtYXQyO1xuICBleHBvcnRzLm1hdDJkID0gbWF0MmQ7XG4gIGV4cG9ydHMubWF0MyA9IG1hdDM7XG4gIGV4cG9ydHMubWF0NCA9IG1hdDQ7XG4gIGV4cG9ydHMucXVhdCA9IHF1YXQ7XG4gIGV4cG9ydHMucXVhdDIgPSBxdWF0MjtcbiAgZXhwb3J0cy52ZWMyID0gdmVjMjtcbiAgZXhwb3J0cy52ZWMzID0gdmVjMztcbiAgZXhwb3J0cy52ZWM0ID0gdmVjNDtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiaW1wb3J0IHttYXQ0fSBmcm9tIFwiLi9nbC1tYXRyaXhcIjtcclxuXHJcbm1haW4oKTtcclxuXHJcbi8vXHJcbi8vIEluaXRpYWxpemUgYSBzaGFkZXIgcHJvZ3JhbSwgc28gV2ViR0wga25vd3MgaG93IHRvIGRyYXcgb3VyIGRhdGFcclxuLy9cclxuZnVuY3Rpb24gaW5pdFNoYWRlclByb2dyYW0oZ2wsIHZzU291cmNlLCBmc1NvdXJjZSkge1xyXG5cdGNvbnN0IHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzU291cmNlKTtcclxuXHRjb25zdCBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNTb3VyY2UpO1xyXG5cclxuXHQvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcblxyXG5cdGNvbnN0IHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcblx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuXHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHJcblx0Ly8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuXHJcblx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG5cdFx0YWxlcnQoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJyArIGdsLmdldFByb2dyYW1JbmZvTG9nKHNoYWRlclByb2dyYW0pKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNoYWRlclByb2dyYW07XHJcbn1cclxuXHJcbi8vXHJcbi8vIGNyZWF0ZXMgYSBzaGFkZXIgb2YgdGhlIGdpdmVuIHR5cGUsIHVwbG9hZHMgdGhlIHNvdXJjZSBhbmRcclxuLy8gY29tcGlsZXMgaXQuXHJcbi8vXHJcbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2wsIHR5cGUsIHNvdXJjZSkge1xyXG5cdGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuXHJcblx0Ly8gU2VuZCB0aGUgc291cmNlIHRvIHRoZSBzaGFkZXIgb2JqZWN0XHJcblxyXG5cdGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcblxyXG5cdC8vIENvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcblxyXG5cdGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuXHJcblx0Ly8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG5cclxuXHRpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG5cdFx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJyArIGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcblx0XHRnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHNoYWRlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdEJ1ZmZlcnMoZ2wpIHtcclxuXHJcblx0Y29uc3QgcG9zaXRpb25zID0gW1xyXG5cdFx0MTAuMCwgIDEwLjAsICAwLFxyXG5cdFx0MTM4LjAsICAxMC4wLCAwLFxyXG5cdFx0MTAuMCwgMTM4LjAsICAwLFxyXG5cdFx0MTM4LjAsIDEzOC4wLCAwLFxyXG5cdF07XHJcblxyXG5cdGNvbnN0IGNvbG9ycyA9IFtcclxuXHRcdDEuMCwgIDEuMCwgIDEuMCwgIDEuMCwgICAgLy8gd2hpdGVcclxuXHRcdDEuMCwgIDAuMCwgIDAuMCwgIDEuMCwgICAgLy8gcmVkXHJcblx0XHQwLjAsICAxLjAsICAwLjAsICAxLjAsICAgIC8vIGdyZWVuXHJcblx0XHQwLjAsICAwLjAsICAxLjAsICAxLjAsICAgIC8vIGJsdWVcclxuXHRdO1xyXG5cclxuXHRjb25zdCB0ZXh0dXJlQ29vcmRpbmF0ZXMgPSBbXHJcblx0XHQvLyBGcm9udFxyXG5cdFx0MC4wLCAgMC4wLFxyXG5cdFx0MS4wLCAgMC4wLFxyXG5cdFx0MS4wLCAgMS4wLFxyXG5cdFx0MC4wLCAgMS4wLFxyXG5cdF07XHJcblxyXG5cdC8vIE5vdyBwYXNzIHRoZSBsaXN0IG9mIHBvc2l0aW9ucyBpbnRvIFdlYkdMIHRvIGJ1aWxkIHRoZVxyXG5cdC8vIHNoYXBlLiBXZSBkbyB0aGlzIGJ5IGNyZWF0aW5nIGEgRmxvYXQzMkFycmF5IGZyb20gdGhlXHJcblx0Ly8gSmF2YVNjcmlwdCBhcnJheSwgdGhlbiB1c2UgaXQgdG8gZmlsbCB0aGUgY3VycmVudCBidWZmZXIuXHJcblx0Y29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLFxyXG5cdFx0bmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG5cdFx0Z2wuU1RBVElDX0RSQVcpO1xyXG5cclxuXHRjb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuXHRjb25zdCB0ZXh0dXJlQ29vcmRCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGV4dHVyZUNvb3JkQnVmZmVyKTtcclxuXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0ZXh0dXJlQ29vcmRpbmF0ZXMpLCBnbC5TVEFUSUNfRFJBVyk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRwb3NpdGlvbjogcG9zaXRpb25CdWZmZXIsXHJcblx0XHRjb2xvcjogY29sb3JCdWZmZXIsXHJcblx0XHR0ZXh0dXJlQ29vcmQ6IHRleHR1cmVDb29yZEJ1ZmZlclxyXG5cdH07XHJcbn1cclxuXHJcbi8vXHJcbi8vIEluaXRpYWxpemUgYSB0ZXh0dXJlIGFuZCBsb2FkIGFuIGltYWdlLlxyXG4vLyBXaGVuIHRoZSBpbWFnZSBmaW5pc2hlZCBsb2FkaW5nIGNvcHkgaXQgaW50byB0aGUgdGV4dHVyZS5cclxuLy9cclxuZnVuY3Rpb24gbG9hZFRleHR1cmUoZ2wsIHVybCwgZG9uZSkge1xyXG5cdGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSk7XHJcblxyXG5cdC8vIEJlY2F1c2UgaW1hZ2VzIGhhdmUgdG8gYmUgZG93bmxvYWQgb3ZlciB0aGUgaW50ZXJuZXRcclxuXHQvLyB0aGV5IG1pZ2h0IHRha2UgYSBtb21lbnQgdW50aWwgdGhleSBhcmUgcmVhZHkuXHJcblx0Ly8gVW50aWwgdGhlbiBwdXQgYSBzaW5nbGUgcGl4ZWwgaW4gdGhlIHRleHR1cmUgc28gd2UgY2FuXHJcblx0Ly8gdXNlIGl0IGltbWVkaWF0ZWx5LiBXaGVuIHRoZSBpbWFnZSBoYXMgZmluaXNoZWQgZG93bmxvYWRpbmdcclxuXHQvLyB3ZSdsbCB1cGRhdGUgdGhlIHRleHR1cmUgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGltYWdlLlxyXG5cdGNvbnN0IGxldmVsID0gMDtcclxuXHRjb25zdCBpbnRlcm5hbEZvcm1hdCA9IGdsLlJHQkE7XHJcblx0Y29uc3Qgd2lkdGggPSAxO1xyXG5cdGNvbnN0IGhlaWdodCA9IDE7XHJcblx0Y29uc3QgYm9yZGVyID0gMDtcclxuXHRjb25zdCBzcmNGb3JtYXQgPSBnbC5SR0JBO1xyXG5cdGNvbnN0IHNyY1R5cGUgPSBnbC5VTlNJR05FRF9CWVRFO1xyXG5cdGNvbnN0IHBpeGVsID0gbmV3IFVpbnQ4QXJyYXkoWzAsIDAsIDI1NSwgMjU1XSk7ICAvLyBvcGFxdWUgYmx1ZVxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxyXG5cdFx0d2lkdGgsIGhlaWdodCwgYm9yZGVyLCBzcmNGb3JtYXQsIHNyY1R5cGUsXHJcblx0XHRwaXhlbCk7XHJcblxyXG5cdGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0aW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcclxuXHRcdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgbGV2ZWwsIGludGVybmFsRm9ybWF0LFxyXG5cdFx0XHRzcmNGb3JtYXQsIHNyY1R5cGUsIGltYWdlKTtcclxuXHJcblx0XHQvLyBXZWJHTDEgaGFzIGRpZmZlcmVudCByZXF1aXJlbWVudHMgZm9yIHBvd2VyIG9mIDIgaW1hZ2VzXHJcblx0XHQvLyB2cyBub24gcG93ZXIgb2YgMiBpbWFnZXMgc28gY2hlY2sgaWYgdGhlIGltYWdlIGlzIGFcclxuXHRcdC8vIHBvd2VyIG9mIDIgaW4gYm90aCBkaW1lbnNpb25zLlxyXG5cdFx0aWYgKGlzUG93ZXJPZjIoaW1hZ2Uud2lkdGgpICYmIGlzUG93ZXJPZjIoaW1hZ2UuaGVpZ2h0KSkge1xyXG5cdFx0XHQvLyBZZXMsIGl0J3MgYSBwb3dlciBvZiAyLiBHZW5lcmF0ZSBtaXBzLlxyXG5cdFx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIE5vLCBpdCdzIG5vdCBhIHBvd2VyIG9mIDIuIFR1cm4gb2YgbWlwcyBhbmQgc2V0XHJcblx0XHRcdC8vIHdyYXBwaW5nIHRvIGNsYW1wIHRvIGVkZ2VcclxuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuXHRcdH1cclxuXHRcdGlmIChkb25lKSBkb25lKHRleHR1cmUpO1xyXG5cdH07XHJcblx0aW1hZ2Uuc3JjID0gdXJsO1xyXG5cclxuXHRyZXR1cm4gdGV4dHVyZTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNQb3dlck9mMih2YWx1ZSkge1xyXG5cdHJldHVybiAodmFsdWUgJiAodmFsdWUgLSAxKSkgPT09IDA7XHJcbn1cclxuXHJcbi8vXHJcbi8vIHN0YXJ0IGhlcmVcclxuLy9cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsQ2FudmFzXCIpO1xyXG4gIC8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcbiAgLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcblx0Y29uc3QgdnNTb3VyY2UgPSBgXHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhVmVydGV4UG9zaXRpb247XHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xyXG5cclxuICAgIHVuaWZvcm0gbWF0NCB1TW9kZWxWaWV3TWF0cml4O1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xyXG5cclxuICAgIHZhcnlpbmcgaGlnaHAgdmVjMiB2VGV4dHVyZUNvb3JkO1xyXG5cclxuICAgIHZvaWQgbWFpbih2b2lkKSB7XHJcbiAgICAgIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1TW9kZWxWaWV3TWF0cml4ICogYVZlcnRleFBvc2l0aW9uO1xyXG4gICAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcclxuICAgIH1cclxuICBgO1xyXG5cdGNvbnN0IGZzU291cmNlID0gYFxyXG4gICAgdmFyeWluZyBoaWdocCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XHJcblxyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XHJcblxyXG4gICAgdm9pZCBtYWluKHZvaWQpIHtcclxuICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcclxuICAgIH1cclxuICBgO1xyXG5cclxuICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG4gIGlmIChnbCA9PT0gbnVsbCkge1xyXG4gICAgYWxlcnQoXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG9yIG1hY2hpbmUgbWF5IG5vdCBzdXBwb3J0IGl0LlwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG5cdGNvbnN0IHNoYWRlclByb2dyYW0gPSBpbml0U2hhZGVyUHJvZ3JhbShnbCwgdnNTb3VyY2UsIGZzU291cmNlKTtcclxuXHRjb25zdCBwcm9ncmFtSW5mbyA9IHtcclxuXHRcdHByb2dyYW06IHNoYWRlclByb2dyYW0sXHJcblx0XHRhdHRyaWJMb2NhdGlvbnM6IHtcclxuXHRcdFx0dmVydGV4UG9zaXRpb246IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sICdhVmVydGV4UG9zaXRpb24nKSxcclxuXHRcdFx0dGV4dHVyZUNvb3JkOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCAnYVRleHR1cmVDb29yZCcpLFxyXG5cdFx0fSxcclxuXHRcdHVuaWZvcm1Mb2NhdGlvbnM6IHtcclxuXHRcdFx0cHJvamVjdGlvbk1hdHJpeDogZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sICd1UHJvamVjdGlvbk1hdHJpeCcpLFxyXG5cdFx0XHRtb2RlbFZpZXdNYXRyaXg6IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCAndU1vZGVsVmlld01hdHJpeCcpLFxyXG5cdFx0XHR1U2FtcGxlcjogZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sICd1U2FtcGxlcicpLFxyXG5cdFx0fSxcclxuXHR9O1xyXG5cclxuXHRjb25zdCB0ZXh0dXJlID0gbG9hZFRleHR1cmUoZ2wsICdjdWJlLnBuZycpO1xyXG5cdGNvbnN0IGJ1ZmZlcnMgPSBpbml0QnVmZmVycyhnbCk7XHJcblxyXG4gIC8vIFNldCBjbGVhciBjb2xvciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbiAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC41LCAxLjApO1xyXG5cdGdsLmNsZWFyRGVwdGgoMS4wKTsgICAgICAgICAgICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmdcclxuXHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7ICAgICAgICAgICAvLyBFbmFibGUgZGVwdGggdGVzdGluZ1xyXG5cdGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpOyAgICAgICAgICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xyXG5cclxuXHQvLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHJcblx0Ly8gQ3JlYXRlIGEgcGVyc3BlY3RpdmUgbWF0cml4LCBhIHNwZWNpYWwgbWF0cml4IHRoYXQgaXNcclxuXHQvLyB1c2VkIHRvIHNpbXVsYXRlIHRoZSBkaXN0b3J0aW9uIG9mIHBlcnNwZWN0aXZlIGluIGEgY2FtZXJhLlxyXG5cdC8vIE91ciBmaWVsZCBvZiB2aWV3IGlzIDQ1IGRlZ3JlZXMsIHdpdGggYSB3aWR0aC9oZWlnaHRcclxuXHQvLyByYXRpbyB0aGF0IG1hdGNoZXMgdGhlIGRpc3BsYXkgc2l6ZSBvZiB0aGUgY2FudmFzXHJcblx0Ly8gYW5kIHdlIG9ubHkgd2FudCB0byBzZWUgb2JqZWN0cyBiZXR3ZWVuIDAuMSB1bml0c1xyXG5cdC8vIGFuZCAxMDAgdW5pdHMgYXdheSBmcm9tIHRoZSBjYW1lcmEuXHJcblxyXG5cdGNvbnN0IHByb2plY3Rpb25NYXRyaXggPSBtYXQ0LmNyZWF0ZSgpO1xyXG5cdC8vIG5vdGU6IGdsbWF0cml4LmpzIGFsd2F5cyBoYXMgdGhlIGZpcnN0IGFyZ3VtZW50XHJcblx0Ly8gYXMgdGhlIGRlc3RpbmF0aW9uIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cclxuXHRtYXQ0Lm9ydGhvKHByb2plY3Rpb25NYXRyaXgsIDAuMCwgMzIwLjAsIDI0MC4wLCAwLjAsIDAuMSwgMTAwKTtcclxuXHJcblx0Y29uc3QgbW9kZWxWaWV3TWF0cml4ID0gbWF0NC5jcmVhdGUoKTtcclxuXHRtYXQ0LnRyYW5zbGF0ZShtb2RlbFZpZXdNYXRyaXgsXHJcblx0XHRtb2RlbFZpZXdNYXRyaXgsXHJcblx0XHRbLTAuMCwgMC4wLCAtMC4xXSk7XHJcblxyXG5cdC8vIFRlbGwgV2ViR0wgaG93IHRvIHB1bGwgb3V0IHRoZSBwb3NpdGlvbnMgZnJvbSB0aGUgcG9zaXRpb25cclxuXHQvLyBidWZmZXIgaW50byB0aGUgdmVydGV4UG9zaXRpb24gYXR0cmlidXRlLlxyXG5cdHtcclxuXHRcdGNvbnN0IG51bUNvbXBvbmVudHMgPSAzOyAgLy8gcHVsbCBvdXQgMiB2YWx1ZXMgcGVyIGl0ZXJhdGlvblxyXG5cdFx0Y29uc3QgdHlwZSA9IGdsLkZMT0FUOyAgICAvLyB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIDMyYml0IGZsb2F0c1xyXG5cdFx0Y29uc3Qgbm9ybWFsaXplID0gZmFsc2U7ICAvLyBkb24ndCBub3JtYWxpemVcclxuXHRcdGNvbnN0IHN0cmlkZSA9IDA7ICAgICAgICAgLy8gaG93IG1hbnkgYnl0ZXMgdG8gZ2V0IGZyb20gb25lIHNldCBvZiB2YWx1ZXMgdG8gdGhlIG5leHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXHJcblx0XHRjb25zdCBvZmZzZXQgPSAwOyAgICAgICAgIC8vIGhvdyBtYW55IGJ5dGVzIGluc2lkZSB0aGUgYnVmZmVyIHRvIHN0YXJ0IGZyb21cclxuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXJzLnBvc2l0aW9uKTtcclxuXHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcblx0XHRcdHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbixcclxuXHRcdFx0bnVtQ29tcG9uZW50cyxcclxuXHRcdFx0dHlwZSxcclxuXHRcdFx0bm9ybWFsaXplLFxyXG5cdFx0XHRzdHJpZGUsXHJcblx0XHRcdG9mZnNldCk7XHJcblx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShcclxuXHRcdFx0cHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uKTtcclxuXHR9XHJcblxyXG5cdC8vIHRlbGwgd2ViZ2wgaG93IHRvIHB1bGwgb3V0IHRoZSB0ZXh0dXJlIGNvb3JkaW5hdGVzIGZyb20gYnVmZmVyXHJcblx0e1xyXG5cdFx0Y29uc3QgbnVtID0gMjsgLy8gZXZlcnkgY29vcmRpbmF0ZSBjb21wb3NlZCBvZiAyIHZhbHVlc1xyXG5cdFx0Y29uc3QgdHlwZSA9IGdsLkZMT0FUOyAvLyB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIDMyIGJpdCBmbG9hdFxyXG5cdFx0Y29uc3Qgbm9ybWFsaXplID0gZmFsc2U7IC8vIGRvbid0IG5vcm1hbGl6ZVxyXG5cdFx0Y29uc3Qgc3RyaWRlID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgdG8gZ2V0IGZyb20gb25lIHNldCB0byB0aGUgbmV4dFxyXG5cdFx0Y29uc3Qgb2Zmc2V0ID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgaW5zaWRlIHRoZSBidWZmZXIgdG8gc3RhcnQgZnJvbVxyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcnMudGV4dHVyZUNvb3JkKTtcclxuXHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnRleHR1cmVDb29yZCwgbnVtLCB0eXBlLCBub3JtYWxpemUsIHN0cmlkZSwgb2Zmc2V0KTtcclxuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy50ZXh0dXJlQ29vcmQpO1xyXG5cclxuXHRcdC8vIFRlbGwgV2ViR0wgd2Ugd2FudCB0byBhZmZlY3QgdGV4dHVyZSB1bml0IDBcclxuXHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cclxuXHRcdC8vIEJpbmQgdGhlIHRleHR1cmUgdG8gdGV4dHVyZSB1bml0IDBcclxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleHR1cmUpO1xyXG5cclxuXHRcdC8vIFRlbGwgdGhlIHNoYWRlciB3ZSBib3VuZCB0aGUgdGV4dHVyZSB0byB0ZXh0dXJlIHVuaXQgMFxyXG5cdFx0Z2wudW5pZm9ybTFpKHByb2dyYW1JbmZvLnVuaWZvcm1Mb2NhdGlvbnMudVNhbXBsZXIsIDApO1xyXG5cdH1cclxuXHJcblx0Ly8gVGVsbCBXZWJHTCB0byB1c2Ugb3VyIHByb2dyYW0gd2hlbiBkcmF3aW5nXHJcblx0Z2wudXNlUHJvZ3JhbShwcm9ncmFtSW5mby5wcm9ncmFtKTtcclxuXHJcblx0Ly8gU2V0IHRoZSBzaGFkZXIgdW5pZm9ybXNcclxuXHRnbC51bmlmb3JtTWF0cml4NGZ2KFxyXG5cdFx0cHJvZ3JhbUluZm8udW5pZm9ybUxvY2F0aW9ucy5wcm9qZWN0aW9uTWF0cml4LFxyXG5cdFx0ZmFsc2UsXHJcblx0XHRwcm9qZWN0aW9uTWF0cml4KTtcclxuXHRnbC51bmlmb3JtTWF0cml4NGZ2KFxyXG5cdFx0cHJvZ3JhbUluZm8udW5pZm9ybUxvY2F0aW9ucy5tb2RlbFZpZXdNYXRyaXgsXHJcblx0XHRmYWxzZSxcclxuXHRcdG1vZGVsVmlld01hdHJpeCk7XHJcblxyXG5cdHtcclxuXHRcdGNvbnN0IG9mZnNldCA9IDA7XHJcblx0XHRjb25zdCB2ZXJ0ZXhDb3VudCA9IDQ7XHJcblx0XHRnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCBvZmZzZXQsIHZlcnRleENvdW50KTtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==