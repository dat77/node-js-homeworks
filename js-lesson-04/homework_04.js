// Ланцюг математичних операцій з Promises.
// Дано число 5.
// Кожна операція повинна бути в окремому промісі, і ці проміси слід з'єднати ланцюгом.
// Спочатку подвоїти його, потім додати 10.

const value = 5;

// проміси тут
const double = ( aValue ) => new Promise( (resolve) => { resolve( aValue * 2 ); })
const addTen = ( aValue ) => new Promise( (resolve) => { resolve( aValue + 10 ); })

double(value)
    .then(addTen)
    .then((result) => {
        console.log(result); // 20
    });