import assert from "node:assert/strict";
import test from "node:test";
import { exhibits, nearestExhibit } from "./content.ts";

test("the entrance does not open an exhibit prematurely", () => {
  assert.equal(nearestExhibit(0, -2, 3), null);
});

test("every exhibit can be approached from the floor", () => {
  for (const item of exhibits) {
    assert.equal(nearestExhibit(item.position[0], -2, item.position[2] + 2.5), item.id);
  }
});

test("an elevated visitor does not trigger an exhibit underneath them", () => {
  assert.equal(nearestExhibit(-6, 3, -3), null);
  assert.equal(nearestExhibit(-6, -2, -3), "about");
});

test("the prompt drops away beyond interaction range", () => {
  assert.equal(nearestExhibit(-6, -2, 0.59), "about");
  assert.equal(nearestExhibit(-6, -2, 0.61), null);
  assert.equal(nearestExhibit(NaN, -2, -3), null);
});
