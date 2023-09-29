export const calculateSinclair = (total: number, bw: number): number => {
    return Math.floor(Math.pow(10, 0.722762521*Math.pow(Math.log10(bw/193.609), 2))*total*100) / 100
}