/* global describe, chai, it $ */

var expect = chai.expect;

describe("login", function() {

  "use strict";

  it("has a username textbox", function() {
    expect($("input#username").length).to.equal(1);
    expect($("label[for='username']").length).to.equal(1);
  });

  it("has a password textbox", function() {
    expect($("input#password[type='password']").length).to.equal(1);
    expect($("label[for='password']").length).to.equal(1);
  });

  it("has one button", function() {
    expect($("button").length).to.equal(1);
  });

});
