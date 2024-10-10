// Переписати цю функцію створивши рекурсивну функцію

const arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

console.log('--------------------');

function recursiveIteration(array, index = 0) {
    // Ваш код тут
    console.log(array[index]);
    if (index < array.length - 1) {
        recursiveIteration(array, ++index);
    }
}
recursiveIteration( arr );
