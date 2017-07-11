function getProperties(obj, properties) {
  let output = {};

  for (let property of properties) {
    let getter;

    switch(property) {
      case 'width':
        getter = getWidth;
        break;
      case 'height':
        getter = getHeight;
        break;
      case 'x':
        getter = getX;
        break;
      case 'y':
        getter = getY;
        break;
      case 'rotation':
        getter = getRotation;
        break;
      case 'shadows':
        getter = getShadows;
        break;
      case 'innerShadows':
        getter = getInnerShadows;
        break;
      case 'borders':
        getter = getBorders;
        break;
      case 'fills':
        getter = getFills;
        break;
      case 'isVisible':
        getter = getVisible;
        break;

      default:
        console.log('Property: "' + property + '" not supported.');
        continue;
    }
    output[property] = getter(obj);
  }

  return output;
}

function getWidth(obj) {
  return obj.frame.width;
}

function getHeight(obj) {
  return obj.frame.height;
}

function getX(obj) {
  return obj.frame.x;
}

function getY(obj) {
  return obj.frame.y;
}

function getRotation(obj) {
  return obj.rotation;
}

function getShadows(obj) {
  if (!obj.style.shadows) {
    return [];
  }
  return getShadowsHelper(obj.style.shadows);
}

function getInnerShadows(obj) {
  if (!obj.style.innerShadows) {
    return [];
  }
  return getShadowsHelper(obj.style.innerShadows);
}

function getShadowsHelper(objShadows) {
  let shadows = [];

  for (let shadow of objShadows) {
    let color = shadow.color;
    delete color['_class'];

    innerShadows.push({
      "blurRadius": shadow.blurRadius,
      "color": color,
      "offsetX": shadow.offsetX,
      "offsetY": shadow.offsetY,
      "spread": shadow.spread
    });
  }

  return shadows;
}

function getBorders(obj) {
  let borders = [];

  for (let objBorder of obj.style.borders) {
    let border = objBorder;

    delete border['_class'];
    delete border['isEnabled'];
    delete border['color']['_class'];

    borders.push(border);
  }

  return borders;
}

function getFills(obj) {
  let fills = [];

  // TODO: Add support for gradients

  for (let fill of obj.style.fills) {
    let color = fill.color;
    delete color['_class'];

    fills.push({
      "color": color
    });
  }

  return fills;
}

function getVisible(obj) {
  return obj.isVisible;
}

module.exports = getProperties;
