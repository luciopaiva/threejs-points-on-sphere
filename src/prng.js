
// Adapted from https://stackoverflow.com/a/47593316/778272
// Interesting read: https://github.com/bryc/code/blob/master/jshash/PRNGs.md

export default class PRNG {

    #a;
    #seed;

    constructor(seed = (Math.random()*2**32)>>>0) {
        this.#seed = seed;
        this.reset();
    }

    next() {
        // mulberry32 PRNG
        this.#a += 0x6D2B79F5;
        let t = this.#a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    reset() {
        this.#a = this.#seed;
    }
}
