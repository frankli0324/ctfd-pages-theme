import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// Features like Universal Transition and Label Layout
import { LabelLayout, UniversalTransition } from 'echarts/features';
// Import the Canvas renderer
// Note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export function embed(target, option){
  let chart = echarts.init(target);
  chart.setOption(option);
  // $(window).on("resize", function() {
  //   if (chart != null && chart != undefined) {
  //     chart.resize();
  //   }
  // });
}