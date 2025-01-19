
// adapted from https://stackoverflow.com/a/47593316/778272

export default class PRNG {

    next;

    constructor(seed = (Math.random()*2**32)>>>0) {
        let a = seed;
        this.next = function mulberry32() {
            // mulberry32 PRNG
            a += 0x6D2B79F5;
            let t = a;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
}
