// Дано ціле число x. Поверніть true, якщо число є паліндромом, і false в іншому випадку.

const isPalindrom = ( n ) => {
    if ( n < 0) return false
    if ( n === 0) return true
    let reverse = ''
    let remainder = n
    while ( remainder > 0 ) {
        reverse += remainder % 10
        remainder = Math.trunc(remainder / 10)
    }
    return reverse === n.toString()
}
console.log( isPalindrom( 3445443 ) )
console.log( isPalindrom( -3445443 ) )
console.log( isPalindrom( 0 ) )