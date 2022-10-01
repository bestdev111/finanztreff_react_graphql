export function createChunk(arr: any[], perChunk: number) {
    if (!arr) return [];
    return arr.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, []);
}

export function splitArray(arr: any[], count: number) {
    const newArr: any[] = []
    for (let c = 0; c < count; c++) {
        newArr.push([])
    }
    for (let i = 0; i < arr.length; i++) {
        const mod = i % count
        newArr[mod].push(arr[i]);
    }
    return newArr
}

