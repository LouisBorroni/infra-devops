import { getDistance } from "./getDistance";

describe("getDistance", () => {
  it("retourne 0 si les deux points sont identiques", () => {
    const point = { lat: 48.8566, lng: 2.3522 };
    expect(getDistance(point, point)).toBeCloseTo(0);
  });

  it("calcule correctement la distance Paris → Londres (~343 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const london = { lat: 51.5074, lng: -0.1278 };
    expect(getDistance(paris, london)).toBeCloseTo(999, 0);
  });
});
