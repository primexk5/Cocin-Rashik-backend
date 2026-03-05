
/**
 * Coerce a value to a plain string.
 * Returns undefined when the value is absent, null, or not a scalar.
 * Never lets objects or arrays through.
 *
 * @param {*} value
 * @param {number} [maxLen=1000]
 * @returns {string|undefined}
 */
function toStr(value, maxLen = 1000) {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'object') return undefined; // reject objects / arrays
    const str = String(value).trim();
    if (str.length === 0) return undefined;
    return str.slice(0, maxLen);
}

/**
 * Coerce a value to a safe integer.
 * Returns undefined when the value is missing or not a valid integer.
 *
 * @param {*} value
 * @param {number} [min]
 * @param {number} [max]
 * @returns {number|undefined}
 */
function toInt(value, min, max) {
    if (value === undefined || value === null) return undefined;
    const n = Number(value);
    if (!Number.isInteger(n)) return undefined;
    if (min !== undefined && n < min) return undefined;
    if (max !== undefined && n > max) return undefined;
    return n;
}

/**
 * Validate a route :id param. Returns the integer id or null.
 *
 * @param {string|undefined} raw
 * @returns {number|null}
 */
function parseId(raw) {
    const id = toInt(raw, 1);
    return id !== undefined ? id : null;
}

module.exports = { toStr, toInt, parseId };
