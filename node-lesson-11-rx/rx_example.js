// Переписати вкладений .subscribe на mergeMap().
// В результаті .subscribe має викликатися один раз

import { of, interval } from 'rxjs';
import { mergeMap, take, delay } from 'rxjs/operators';
const firstObservable = of('Перший потік');
const secondObservable = () => interval(1000).pipe(take(3));
// Вкладений subscribe
firstObservable.subscribe(data1 => {
    // secondObservable().subscribe(data2 => {
    //     console.log('Вкладений subscribe:', data2);
    // });

    secondObservable().pipe(
        mergeMap(data2 => of(`Вкладений subscribe new: ${data2}`))
    ).forEach(res => console.log(res));

});