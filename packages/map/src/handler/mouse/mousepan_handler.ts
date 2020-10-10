// @ts-ignore
import { DOM, Point } from '@antv/l7-utils';
import MouseHandler from './mouse_handler';
import { buttonStillPressed, LEFT_BUTTON } from './util';
export default class MousePanHandler extends MouseHandler {
  public mousedown(e: MouseEvent, point: Point) {
    super.mousedown(e, point);
    if (this.lastPoint) {
      this.active = true;
    }
  }

  public move(lastPoint: Point, point: Point) {
    return {
      around: point,
      panDelta: point.sub(lastPoint),
    };
  }
  protected correctButton(e: MouseEvent, button: number) {
    return button === LEFT_BUTTON && !e.ctrlKey;
  }
}
