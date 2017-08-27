import {QueryCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import angular from 'angular';
import {AppInsightsDatasource} from './datasource';
import {MetricsMetadata,Metric} from './insights.data';

export class AppInsightsQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  metricSegment: any;
  dimensionsSegments: any[];
  aggregationSegment: any;
  datasource: AppInsightsDatasource;
  metricsMetadata: MetricsMetadata;


  /** @ngInject **/
  constructor($scope, $injector, private templateSrv, private $q, private uiSegmentSrv)  {
    super($scope,$injector);

    this.target = this.target;
    if (!this.target.metric) {
      this.target.metric = "requests/count";
    }
    if (!this.target.aggregation) {
      this.target.aggregation = "sum";
    }

    this.metricSegment = uiSegmentSrv.newSegment(this.target.metric);
    this.aggregationSegment = uiSegmentSrv.newSegment(this.target.aggregation);
    this.loadMetadata();
  }

  private loadMetadata() {
    this.datasource.getMetricsMetadata()
    .then((data: MetricsMetadata) => {
      this.metricsMetadata = data;
    })
    .catch(this.handleQueryError.bind(this));
  }

  fixdimensionsSegments() {
    console.log("fix dimensions segment");
    var count = this.dimensionsSegments.length;
    var lastSegment = this.dimensionsSegments[Math.max(count-1, 0)];

    if (!lastSegment || lastSegment.type !== 'plus-button') {
      this.dimensionsSegments.push(this.uiSegmentSrv.newPlusButton());
    }
  }

  getAggregationOptions() {
    return this.$q((resolve,reject) => {
      let currentMetric = this.metricsMetadata.metrics[this.target.metric];
      var segments = _.map(currentMetric.supportedAggregations, (aggregation) => {
          return this.uiSegmentSrv.newSegment({ value: aggregation, expandable: false });
      });
      resolve(segments);
    });
  }

  aggregationChanged(segment, index){
    console.log('aggregationChanged: ' + JSON.stringify(segment) + index);
    this.target.aggregation = this.aggregationSegment.value;
    this.aggregationSegment = this.uiSegmentSrv.newSegment(this.target.aggregation);
    this.panelCtrl.refresh();
  }

  getAvailableDimensions(segment,index){
    console.log("getAvailableDimensions");
  }


  changedDimension(segment,index){
    console.log("dimensionChanged");
  }

  buildSelectMenu() {
    console.log('buildSelectMenu');
  }

  getCategories(){
    console.log('getCategories');
  }

  groupByAction() {
    console.log('groupByAction');
  }

  addSelectPart(selectParts, cat, subitem) {
    console.log('addSelectPart');
  }

  handleSelectPartEvent(selectParts, part, evt) {
    console.log('handleSelectPartEvent');
  }

  handleGroupByPartEvent(part, index, evt) {
    console.log('handleGroupByPartEvent');
  }

  fixTagSegments() {
    console.log('fixTagSegments');
  }

  measurementChanged() {
    console.log('measurementChanged');
  }

  getMetricOptions() {
    console.log('getMetricOptions');
    return this.$q((resolve,reject) => {resolve(true);})
    .then(this.transformToSegments(false))
    .catch(this.handleQueryError.bind(this));
  }

  metricChanged() {
    console.log('metricChanged');
    this.target.metric = this.metricSegment.value;
    this.target.aggregation = this.metricsMetadata.metrics[this.target.metric].defaultAggregation;
    this.aggregationSegment = this.uiSegmentSrv.newSegment(this.target.aggregation);
    this.panelCtrl.refresh();
  }


  getMeasurements(measurementFilter) {
    console.log('getMeasurements');
  }

  handleQueryError(err) {
    console.log('handleQueryError');
  }

  transformToSegments(addTemplateVars) {
    console.log('transformToSegments');
    return (results) => {
      var segments = _.map(this.metricsMetadata.metrics, (metric,id) => {
          return this.uiSegmentSrv.newSegment({ value: id, expandable: false });
        });
      return segments;
    };
  }

  getTagsOrValues(segment, index) {
    console.log('getTagsOrValues');
  }

  getFieldSegments() {
    console.log('getFieldSegments');
  }

  tagSegmentUpdated(segment, index) {
    console.log('tagSegmentUpdated');
  }

  rebuildTargetTagConditions() {
    console.log('rebuildTargetTagConditions');
  }

  getTagValueOperator(tagValue, tagOperator) {
    console.log('getTagValueOperator');
  }

  getCollapsedText() {
    return `Metrics for: ${this.target.metric} aggregated by: ${this.target.aggregation}`;
  }

  getOptions() {
    console.log('getOptions');
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    console.log('onChangeInternal');
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}


