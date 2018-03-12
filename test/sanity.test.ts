import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../src/App";

chai.use(chaiHttp);
const expect: Chai.ExpectStatic = chai.expect;

describe("baseRoute", () => {

  it("should be html", () => {
    return chai.request(app).get("/")
    .then(res => {
      expect(res.type).to.eql("text/html");
    });
  });
});