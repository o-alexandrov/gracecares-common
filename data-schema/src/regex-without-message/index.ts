export const onlySpaces = /^\s+$/

/**
 * Based on @see https://gist.github.com/robyng/e4ff8614395719e0a3547be58e5a9c43
 *   - (https?:\/\/)? - optional http:// or https:// prefix
 *   - [\da-z.-]+ - one or multi level domain name
 *   - \.[a-z.]{2,6} - ends with . (single dot) followed by 2 to 6 letters (current TLDs have 2-6 letters; ex. ".com", ".info", ".museum")
 *   - ([\w.~%+/-]*) - optional path (series of characters including slashes)
 *   - ([?#][\w~+?=#%&:/-]+)? - optional query string or hash
 *
 * Regex must not have ^ and $ because we want to find links in the middle of the text
 */
export const httpLink =
  /(https?:\/\/)?[\da-z.-]+\.[a-z.]{2,6}([\w.~%+/-]*)([?#][\w~+?=#%&:/-]+)?/i

export const httpProtocol = /^(https?:\/\/)?/i

export const httpProtocolOrOptionalEnding = /(^https?:\/\/|\/$)/gi
