import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  test('formats numbers less than 1,000', () => {
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(99.9)).toBe('99.9');
    expect(formatNumber(5.25)).toBe('5.3');
  });

  test('formats numbers in the thousands', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(9999)).toBe('9,999');
  });

  test('formats numbers in the millions', () => {
    expect(formatNumber(1_000_000)).toBe('1 Million');
    expect(formatNumber(2_500_000)).toBe('2.5 Million');
  });

  test('formats numbers in the billions', () => {
    expect(formatNumber(1_000_000_000)).toBe('1 Billion');
    expect(formatNumber(3_600_000_000)).toBe('3.6 Billion');
  });

  test('formats numbers in the trillions', () => {
    expect(formatNumber(1_000_000_000_000)).toBe('1 Trillion');
    expect(formatNumber(5_432_000_000_000)).toBe('5.432 Trillion');
  });
});
