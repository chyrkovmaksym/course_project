import { downLine, ifLines, horizontalLine } from './lines.js';
import {
  EllipseRect,
  ArrowDown,
  Parallelogram45,
  Rectangle,
  Rhombus,
  Hexagon,
  ElseMove,
  configs,
  ArrowLeft,
  ctx,
} from './figures.js';

const cordinatX = (prevId, resFigures) => resFigures[prevId - 1].x;

const cordinatY = (prevId, resFigures) => resFigures[prevId - 1].y;

const keyWords = {
  customF: ['customF'],
  expression: ['printf', 'scanf', 'def', 'expression'],
  if: ['if'],
  cycle: ['for', 'while'],
  else: ['else'],
  switch: ['switch'],
  case: ['case'],
  default: ['default'],
};

const getType = (keyWord) => {
  for (const key of Object.keys(keyWords)) {
    if (keyWords[key].includes(keyWord)) return key;
  }
  return null;
};

const types = {
  customF() {
    const { X, Y, editedText } = this;
    downLine(X, Y);
    const ellipseRect = new EllipseRect(
      X,
      Y,
      configs.uniHeight,
      editedText,
      configs.uniHeight / configs.half,
    );
    ellipseRect.draw();
    return ellipseRect;
  },
  expression({ type }) {
    const { editedText } = this;
    if (editedText != 'break;') {
      this.Y += configs.spaceY;
      const { X, Y } = this;
      const figure = type === 'expression'
        ? new Rectangle(X, Y, configs.uniHeight, editedText)
        : new Parallelogram45(X, Y, configs.uniHeight, editedText);
      figure.draw();
      if (this.idCase == null) {
        downLine(X, Y);
        const arrowDown = new ArrowDown(X, Y);
        arrowDown.draw();
      }
      if (this.idCase != null) {
        horizontalLine(X + configs.spaceX1 / configs.quarter, Y);
        downLine(
          X + configs.spaceX1 + configs.spaceX1 / configs.fifth,
          Y - configs.uniHeight / 2,
          configs.uniHeight,
        );
      }

      return figure;
    }
  },
  if({ id, prevId }) {
    if (this.idLoop != null) this.flagIfLoop = true;
    this.flagIf = true;
    this.idIf = id;
    this.ifPrevId = prevId;
    this.flagAfterIf = true;
    this.Y += configs.spaceY;
    const { X, Y, editedText } = this;
    const arrowDown = new ArrowDown(X, Y);
    arrowDown.draw();
    const rhombus = new Rhombus(X, Y, configs.uniHeight, editedText);
    this.rhoWidth = rhombus.width;
    rhombus.draw();
    ifLines(X, Y, this.rhoWidth);
    if (this.rhoWidth > configs.spaceX4) this.X += this.rhoWidth / configs.half;
    else if (this.rhoWidth < configs.spaceX1) this.X += configs.spaceX3;
    else this.X += this.rhoWidth;
    return rhombus;
  },
  cycle({ id }) {
    if (this.idIf !== null) {
      this.idElse !== null
        ? (this.flagLoopIf = 'right')
        : (this.flagLoopIf = 'left');
    }
    this.idLoop = id;
    this.Y += configs.spaceY;
    const { X, Y, editedText } = this;
    const arrowDown = new ArrowDown(X, Y);
    arrowDown.draw();
    const hexagon = new Hexagon(X, Y, configs.uniHeight, editedText);
    this.hexWidth = hexagon.width;
    hexagon.draw();
    downLine(X, Y);
    return hexagon;
  },
  else({
    figuresAfterIf, resFigures, id, prevId,
  }) {
    figuresAfterIf.push(resFigures[id - 2]);
    let res;
    if (this.editedText === '') {
      this.idElse = id;
      let mainIf = null;
      prevId === this.ifPrevId
        ? (mainIf = this.idIf)
        : (mainIf = this.ifPrevId);
      this.X = cordinatX(mainIf, resFigures);
      this.Y = cordinatY(mainIf, resFigures);
      if (this.rhoWidth > configs.spaceX4) this.X -= this.rhoWidth / configs.half;
      else if (this.rhoWidth < configs.spaceX1) this.X -= configs.spaceX3;
      else this.X -= this.rhoWidth;
      res = new ElseMove(this.X, this.Y);
    } else {
      this.X = cordinatX(this.idIf, resFigures);
      this.Y = cordinatY(this.idIf, resFigures);
      this.Y += configs.spaceY;
      if (this.rhoWidth > configs.spaceX4) this.X -= this.rhoWidth / configs.half;
      else if (this.rhoWidth < configs.spaceX1) this.X -= configs.spaceX3;
      else this.X -= this.rhoWidth;
      const { X, Y, editedText } = this;
      res = new Rhombus(X, Y, configs.uniHeight, editedText);
      this.rhoWidth = res.width;
      const arrowDown = new ArrowDown(X, Y);
      arrowDown.draw();
      res.draw();
      ifLines(X, Y, this.rhoWidth);
      if (this.rhoWidth > configs.spaceX4) this.X += this.rhoWidth / configs.half;
      else if (this.rhoWidth < configs.spaceX1) this.X += configs.spaceX3;
      else this.X += this.rhoWidth;
      this.idIf = id;
    }
    return res;
  },
  switch({}) {
    console.log('switch');
    this.Y += configs.spaceY;
    const { X, Y, editedText } = this;
    const arrowDown = new ArrowDown(X, Y);
    arrowDown.draw();
    const rhombus = new Rhombus(X, Y, configs.uniHeight, editedText);
    this.rhoWidth = rhombus.width;
    rhombus.draw();
    downLine(X, Y);
  },
  case({ id }) {
    if (this.idCase != null) this.X -= configs.spaceX3;
    if (this.idCase == null) this.idCase = id;
    console.log('case');
    console.log(this.Y);
    this.Y += configs.spaceY;
    console.log(this.Y);
    const { X, Y, editedText } = this;
    console.log(Y);
    const arrowDown = new ArrowDown(X, Y);
    arrowDown.draw();
    const rhombus = new Rhombus(X, Y, configs.uniHeight, editedText);
    this.rhoSwitchWidth = rhombus.width;
    rhombus.draw();
    this.Y -= configs.spaceY;
    this.X += configs.spaceX3;
    downLine(X, Y);
    horizontalLine(X, Y);
    return rhombus;
  },
  default({}) {
    this.idCase = null;
    this.Y += configs.spaceY;
    this.X -= configs.spaceX3;
    const { X, Y, editedText } = this;
    const yLevel = Y + configs.uniHeight / configs.half;
    const arrowDown = new ArrowDown(X, Y);
    arrowDown.draw();
    const rectangle = new Rectangle(X, Y, configs.uniHeight, editedText);
    this.rectWidth = rectangle.width;
    rectangle.draw();
    const arrowLeft = new ArrowLeft(X + this.rectWidth / 2, yLevel);
    arrowLeft.draw();
    ctx.moveTo(X + this.rhoSwitchWidth / configs.half, yLevel);
    ctx.lineTo(X + this.rectWidth / configs.half, yLevel);
    downLine(X, Y);
    horizontalLine(X, Y, configs.spaceX3 + 50);
    return rectangle;
  },
};
export {
  types, getType, cordinatX, cordinatY,
};
