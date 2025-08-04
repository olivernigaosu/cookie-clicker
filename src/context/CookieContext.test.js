import React from 'react';
import { render, act } from '@testing-library/react';
import { CookieProvider, CookieContext } from './CookieContext';

let contextValues;

beforeEach(() => { // render CookieProvider before each test
  render(
    <CookieProvider>
      <CookieContext.Consumer>
        {(value) => {
          contextValues = value;
          return null;
        }}
      </CookieContext.Consumer>
    </CookieProvider>
  );
});

test('increment adds cookies based on clickPower and multiplier', () => {
  act(() => {
    contextValues.increment(1);
  });

  expect(contextValues.cookies).toBe(1);
  expect(contextValues.allTimeCookies).toBe(1);
});

test('purchaseUpgrade for click doubles clickPower and increases cost', () => {
  act(() => {
    contextValues.setCookies(1000); // set cookies to afford upgrade
  });

  act(() => {
    contextValues.purchaseUpgrade('click');
  })

  expect(contextValues.clickPower).toBe(2);
  expect(contextValues.shopItems.click.count).toBe(1);
  expect(contextValues.shopItems.click.cost).toBe(500); // 50 * 10
});

test('purchaseUpgrade for auto1 increases autoClickRate', () => {
  act(() => {
    contextValues.setCookies(100);
  });

  act(() => {
    contextValues.purchaseUpgrade('auto1');
  })

  expect(contextValues.autoClickRate).toBe(1);
  expect(contextValues.shopItems.auto1.count).toBe(1);
});

test('purchaseUpgrade for multiplier increases productionMultiplier', () => {
  act(() => {
    contextValues.setCookies(100);
  });

  act(() => {
    contextValues.purchaseUpgrade('multiplier');
  })

  expect(contextValues.productionMultiplier).toBeCloseTo(1.02);
  expect(contextValues.shopItems.multiplier.count).toBe(1);
});

test('clearSave resets all values', () => {
  act(() => {
    contextValues.setCookies(999);
    contextValues.setAllTimeCookies(999);
    contextValues.setClickPower(999);
    contextValues.setAutoClickRate(999);
    contextValues.setProductionMultiplier(999);
    contextValues.setShopItems({
      auto1: { emoji: '👵', name: 'Lazy Grandma', count: 5, baseCost: 10, cost: 10 },
      click: { emoji: '👆', name: 'Click Multiplier', count: 2, baseCost: 50, cost: 100 },
      multiplier: { emoji: '📈', name: 'Production Multiplier', count: 2, baseCost: 100, cost: 150 },
    });

    contextValues.clearSave();
  });

  expect(contextValues.cookies).toBe(0);
  expect(contextValues.allTimeCookies).toBe(0);
  expect(contextValues.clickPower).toBe(1);
  expect(contextValues.autoClickRate).toBe(0);
  expect(contextValues.productionMultiplier).toBe(1);
  expect(contextValues.shopItems.auto1.count).toBe(0);
});
