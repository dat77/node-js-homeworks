// Дано додатнє ціле число n. Знайдіть всі числа в діапазоні [1, n] включно,
// які діляться на 3, 5 або 7. Поверніть масив цих чисел.

const getMultiplesOf_3_5_7 = ( n ) => {
    let resultArray = []
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 || i % 5 === 0 || i % 7 === 0) {
            resultArray.push(i)
        }
    }
    return resultArray
}
console.log( getMultiplesOf_3_5_7( 50 ) )