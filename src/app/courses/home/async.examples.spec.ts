import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Async Testing Examples', () => {

  it('Mixing promises and setTimeout()', fakeAsync(() => {
    let counter = 0;
    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => counter++, 1000);
      });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it('Testing observables', fakeAsync(() => {
    let test = false;
    // const test$ = of(test);
    // test$.subscribe(() => test = true);
    // expect(test).toBe(true);
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => test = true);
    tick(1000);
    expect(test).toBe(true);
  }));
})
;
