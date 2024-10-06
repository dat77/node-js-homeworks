// Напишіть функцію delay(ms), яка повертає проміс, що виконується через ms мілісекунд.

function delay(ms) {
    return new Promise((resolve) => {
        // Ваш код
        setTimeout( () => { resolve ( ms / 1000 ) }, ms )
    });
}

// Виклик функції
delay(1500).then((value) => console.log(`Пройшло ${value} секунди`));
