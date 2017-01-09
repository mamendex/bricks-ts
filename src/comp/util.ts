/**
 * Utils
 * Generic functions
 */

/**
 * Sleep for @param ms microseconds (using setTimeout)
 * usage:
 *     await sleep(500)
 */
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}