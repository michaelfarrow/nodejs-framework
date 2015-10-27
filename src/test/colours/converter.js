var converter = require("../../app/converter");
    // querystring = require("querystring");

describe("Color Code Converter", function() {
  describe("RGB to Hex conversion", function() {
    it("converts the basic colors", function() {
      var redHex   = converter.rgbToHex(255, 0, 0);
      var greenHex = converter.rgbToHex(0, 255, 0);
      var blueHex  = converter.rgbToHex(0, 0, 255);

      expect(redHex).to.equal("ff0000");
      expect(greenHex).to.equal("00ff00");
      expect(blueHex).to.equal("0000ff");
    });

    it("doesn't convert values < 0", function() {
      var redHex   = converter.rgbToHex(-1, 0, 0);
      var greenHex = converter.rgbToHex(0, -1, 0);
      var blueHex  = converter.rgbToHex(0, 0, -1);

      expect(redHex).to.be.null;
      expect(greenHex).to.be.null;
      expect(blueHex).to.be.null
    });

    it("doesn't convert values > 255", function() {
      var redHex   = converter.rgbToHex(256, 0, 0);
      var greenHex = converter.rgbToHex(0, 256, 0);
      var blueHex  = converter.rgbToHex(0, 0, 256);

      expect(redHex).to.be.null;
      expect(greenHex).to.be.null;
      expect(blueHex).to.be.null
    });

    it("doesn't convert ascii strings", function() {
      var hex1 = converter.rgbToHex("test", "0", 0);
      var hex2 = converter.rgbToHex(0, "two", 0);
      var hex3 = converter.rgbToHex(0, "2", 0);

      expect(hex1).to.be.null;
      expect(hex2).to.be.null;
      expect(hex3).to.equal("000200");;
    });
  });

  describe("Hex to RGB conversion", function() {
    it("converts the basic colors", function() {
      var red   = converter.hexToRgb("ff0000");
      var green = converter.hexToRgb("00ff00");
      var blue  = converter.hexToRgb("0000ff");

      expect(red).to.deep.equal([255, 0, 0]);
      expect(green).to.deep.equal([0, 255, 0]);
      expect(blue).to.deep.equal([0, 0, 255]);
    });

    it("is valid with or without leading hash", function() {
      var hexWithHash = converter.hexToRgb("efefef");
      var hexWithoutHash = converter.hexToRgb("#efefef");

      expect(hexWithHash).to.deep.equal(hexWithoutHash);
    });
  });

});

describe("Color Code Converter API", function() {

  describe("RGB to Hex conversion", function() {

    var url = "http://node:8080/rgbToHex?red=255&green=255&blue=255";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns the color in hex", function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal("ffffff");
        done();
      });
    });

  });

  describe("Hex to RGB conversion", function() {
    var url = "http://node:8080/hexToRgb?hex=00ff00";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns the color in RGB", function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal("[0,255,0]");
        done();
      });
    });
  });

});