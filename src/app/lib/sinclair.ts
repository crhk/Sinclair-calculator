import type { Sex } from '../data/types'

const coefficients = {
    M: {
        ratio: 0.722762521,
        maxBw: 193.609
    },
    F: {
        ratio: 0.787004341,
        maxBw: 153.757
    }
}

export const calculateSinclair = (total: number, bw: number, sex: Sex): number => {
    const result = Math.floor(Math.pow(10, coefficients[sex].ratio*Math.pow(Math.log10(bw/coefficients[sex].maxBw), 2))*total*100) / 100
    return isNaN(result) ? 0 : result
}