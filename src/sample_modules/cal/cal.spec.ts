import { add } from './cal';

describe('calculation', () => {
  it('should add', () => {
    expect(add(1,1)).toEqual(2);
  })
})