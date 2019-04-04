import Layer from '../core/layer';
import * as drawPoint from '../layer/render/point';
import TextBuffer from '../geom/buffer/point/text';
import DrawText from './render/point/drawText';
import Global from '../global';
// import PointBuffer from '../geom/buffer/point';
import * as PointBuffer from '../geom/buffer/point/index';
const { pointShape } = Global;
/**
 * point shape 2d circle, traingle text,image
 * shape 3d   cube，column, sphere
 * shape Model ,自定义
 * image
 */

export default class PointLayer extends Layer {
  draw() {
    this.type = 'point';
    const { stroke, fill } = this.get('styleOptions');
    const style = this.get('styleOptions');
    const activeOption = this.get('activedOptions');
    const config = {
      ...style,
      activeColor: activeOption.fill
    };
    const pointShapeType = this._getShape();
    this.shapeType = pointShapeType;
    switch (pointShapeType) {
      case 'fill': { // 填充图形
        if (fill !== 'none') {
          // 是否填充
          const attributes = PointBuffer.FillBuffer(this.layerData, style);
          const meshfill = drawPoint.DrawFill(attributes, config);
          this.add(meshfill);
        }
        if (stroke !== 'none') {
          // 是否绘制边界
          const lineAttribute = PointBuffer.StrokeBuffer(this.layerData, style);
          const meshStroke = drawPoint.DrawStroke(lineAttribute, config);
          this.add(meshStroke, 'line');
        }
        break;
      }
      case 'image': { // 绘制图片标注
        const imageAttribute = PointBuffer.ImageBuffer(this.layerData, {
          imagePos: this.scene.image.imagePos
        });
        const imageMesh = drawPoint.DrawImage(imageAttribute, {
          ...style,
          texture: this.scene.image.texture
        });
        this.add(imageMesh);
        break;
      }
      case 'normal': { // 原生点
        const normalAttribute = PointBuffer.NormalBuffer(this.layerData, style);
        const normalPointMesh = drawPoint.DrawNormal(normalAttribute, config);
        this.add(normalPointMesh);
        break;
      }
      case 'text': { // 原生点
        const { width, height } = this.scene.getSize();
        const textCfg = {
          ...style,
          width,
          height,
          activeColor: activeOption.fill
        };
        const buffer = new TextBuffer(
          this.layerData,
          this.scene.fontAtlasManager
        );
        const mesh = new DrawText(buffer, textCfg);
        this.add(mesh);
        break;
      }
      default:
        return null;
    }
  }

  _getShape() {
    let shape = null;
    if (!this.layerData[0].hasOwnProperty('shape')) {
      return 'normal';
    }
    for (let i = 0; i < this.layerData.length; i++) {
      shape = this.layerData[i].shape;
      if (shape !== undefined) {
        break;
      }
    }
    if (
      pointShape['2d'].indexOf(shape) !== -1 ||
      pointShape['3d'].indexOf(shape) !== -1
    ) {
      return 'fill';
    } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
      return 'image';
    }
    return 'text';
  }
  zoomchange(ev) {
    super.zoomchange(ev);
    this._updateData();
  }
  dragend(ev) {
    super.dragend(ev);
    this._updateData();

  }
  _updateData() {
    if (this.layerSource.get('isCluster')) {
      const bounds = this.scene.getBounds().toBounds();
      const SW = bounds.getSouthWest();
      const NE = bounds.getNorthEast();
      const zoom = this.scene.getZoom();
      const step = Math.max(NE.lng - SW.lng, NE.lat - SW.lat) / 2;
      const bbox = [ SW.lng, SW.lat, NE.lng, NE.lat ];
      // const bbox = [ SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step ];
      const cfg = this.layerSource.get('cluster');
      const preBox = cfg.bbox;
      const preZoom = cfg.zoom;
      if (!(preBox && preBox[0] < bbox[0] && preBox[1] < bbox[1] && preBox[2] > bbox[2] && preBox[3] < bbox[3] && // 当前范围在范围内
         (Math.abs(zoom - preZoom)) < 0.5)) {
        const newbbox = [ SW.lng - step, SW.lat - step, NE.lng + step, NE.lat + step ];
        this.layerSource.updateCusterData(Math.floor(zoom - 1), newbbox);
        this.repaint();
      }
    }
  }
}
