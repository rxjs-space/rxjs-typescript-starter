import { Observable, TestScheduler } from 'rxjs';

describe('Observable.interval', () => {
  it('should emit the first value at timeFrame x (x is the interval)', () => {
    const scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
    const values = {a: 0, b: 1, c: 2, d: 3}
    const expectedStream = '--a-b-c-(d|)'
    const $ToTest$ = Observable.interval(20, scheduler).take(4)
    scheduler.expectObservable($ToTest$).toBe(expectedStream, values)
    scheduler.flush();
  })
})