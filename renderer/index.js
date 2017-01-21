var d3 = require("d3"),
    patterns = require("./patterns.js"),
    textWrapper = require("./text-wrapper.js");

module.exports = function(t) {

  var renderer = {},
      backgroundImage,
      wrapText,
      theme;

  renderer.backgroundImage = function(_) {
    if (!arguments.length) return backgroundImage;
    backgroundImage = _;
    return this;
  };

  renderer.theme = function(_) {
    if (!arguments.length) return theme;

    theme = _;

    // Default colors
    theme.backgroundColor = theme.backgroundColor || "#fff";
    theme.waveColor = theme.waveColor || theme.foregroundColor || "#000";
    theme.captionColor = theme.captionColor || theme.foregroundColor || "#000";

    // Default wave dimensions
    if (typeof theme.waveTop !== "number") theme.waveTop = 0;
    if (typeof theme.waveBottom !== "number") theme.waveBottom = theme.height;
    if (typeof theme.waveLeft !== "number") theme.waveLeft = 0;
    if (typeof theme.waveRight !== "number") theme.waveRight = theme.width;

    wrapText = textWrapper(theme);

    return this;
  };

  // Draw the frame
  renderer.drawFrame = function(context, options){

    context.patternQuality = "best";

    // Draw the background image and/or background color
    context.clearRect(0, 0, theme.width, theme.height);

    context.fillStyle = theme.backgroundColor;
    context.fillRect(0, 0, theme.width, theme.height);

    if (backgroundImage) {
      width = backgroundImage.width;
      maxWidth = theme.width;
      height = backgroundImage.height;
      maxHeight = theme.height;
      aspectW = width / maxWidth;
      aspectH = height / maxHeight;

      if (aspectW > aspectH) {
        width = maxWidth;
        height = height / aspectW;
      }
      else {
        height = maxHeight;
        width = width / aspectH;
      }
      leftMargin = Math.max(0,(maxWidth - width)/2);
      topMargin = Math.max(0,(maxHeight - height)/2);
      
      context.drawImage(backgroundImage, leftMargin, topMargin, width, height);
    }

    patterns[theme.pattern || "wave"](context, options.waveform, theme);

    // Write the caption
    if (options.caption) {
      wrapText(context, options.caption);
    }

    return this;

  };

  if (t) {
    renderer.theme(t);
  }

  return renderer;

}
