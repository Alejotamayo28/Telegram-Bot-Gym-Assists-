import { sum } from "../example/index";

/*
 Identificar las funciones que tienes la funcion principal
 
 Mockear las funciones -> jest.mock(`ruta`, () => ({ nombreFuncion: jest:fn()}))

 Describe
  crear constante ctx con utilityType Partial del generico Context


*/


describe("sum function", () => {
  it("should return the sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
