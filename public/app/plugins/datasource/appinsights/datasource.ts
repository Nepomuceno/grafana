import _ from "lodash";
import moment from 'moment';
import {QueryMetricsResponse,QuerySegments} from './insights.data';

export class AppInsightsDatasource {
  type: string;
  url: string;
  name: string;
  q: any;
  backendSrv: any;
  templateSrv: any;
  appid: string;
  version: string;
  apikey: string;
  baseheader: any;

  /** @ngInject */
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.appid = instanceSettings.jsonData.appid;
    this.apikey = instanceSettings.jsonData.apikey;
    this.url = `https://api.applicationinsights.io/beta/apps/${this.appid}`;
    this.baseheader = { 'Content-Type': 'application/json', 'x-api-key': this.apikey };
  }

  query(options) {
    console.log('query: ' + JSON.stringify(options));
    // Getting metric that you query for
    let target = options.targets[0];
    let metric = target.metric;

    // Getting the dimensions and including metric
    let segments: string[] = [];
    if (target.segment) {
      segments = target.segment.split(',');
    }
    segments.push(metric);

    // Getting aggregation
    let aggregation = target.aggregation;

    // Mounting query url
    let queryUrl = this.formatUrl(options,metric,target.segment, aggregation);

    // Getting response from server
    return this.backendSrv.datasourceRequest({
      url: queryUrl,
      method: 'GET',
      headers: this.baseheader
    }).then(response => {
      if (response.status === 200) {
        var data = this.parseQueryResponse(response.data.value,segments,aggregation);
        return data;
      }
    });
  }

  formatUrl(options: any, metric: string, segment: string, aggregation: string){
    console.log('formatUrl:started');
    let queryUrl = this.url + '/metrics/';
    queryUrl += `${metric}`;
    let duration = moment.duration(options.intervalMs,'ms').toISOString();
    var from = new Date(options.range.from).toISOString();
    var to = new Date(options.range.to).toISOString();
    queryUrl += `?timespan=${from}%2F${to}&interval=${duration}`;
    queryUrl += `&aggregation=${aggregation}`;

    if (segment) {
      queryUrl += `&segment=${segment}`;
    }
    console.log('callingUrl: ' + queryUrl);
    return queryUrl;
  }

  parseQueryResponse(data: QuerySegments,segments: string[],aggregation: string) {
    let result = [];
    console.log('parseQueryResponse');
    let metrics =  this.getMetrics(data,0,segments,aggregation,"");
    for (let prop in metrics) {
      if (prop !== "target" && prop !== "datapoints") {
        if (!metrics[prop]) {
            console.log(metrics);
        }
        result.push(metrics[prop]);
      }
    }
    return { data: result };
  }

  getMetrics(data: QuerySegments,deepIndex: number,segments: string[], aggregation: string, base: string) {
    let metric = "";
    if (deepIndex < segments.length) {
      metric = segments[deepIndex];
    }
    if (!data.segments) {
      return { target: base ,datapoints: [[ data[base][aggregation], new Date(data.end).getTime() ]] };
    } else {
      ++deepIndex;
      let result = data.segments.map(segment => {
         return this.getMetrics(segment,deepIndex,segments,aggregation, metric);
      }).reduce((previous,current) => {
          let label = current.target;
          if (!previous[label]) {
            previous[label] = {};
            previous[label].target = label;
            previous[label].datapoints = current.datapoints;
          } else {
            previous[label].datapoints = previous[label].datapoints.concat(current.datapoints);
          }
          return previous;
      });
      return result;
    }
  }

  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/metrics/metadata',
      method: 'GET',
      headers: this.baseheader
    }).then(response => {
      if (response.status === 200) {
        return {
           status: "success",
           message: "Connected with success",
           title: "Success"
        };
      }
    });
  }

  getMetricsMetadata() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/metrics/metadata',
      method: 'GET',
      headers: this.baseheader
    }).then(response => {
      if (response.status === 200) {
        return response.data;
      }
    });
  }

  annotationQuery(options) {
    console.log('annotationQuery: ' + JSON.stringify(options));
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.backendSrv.datasourceRequest({
      url: this.url + '/annotations',
      method: 'POST',
      data: annotationQuery,
      headers: this.baseheader
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(options) {
    console.log('metricFindQuery: ' + JSON.stringify(options));
    var target = typeof (options) === "string" ? options : options.target;
    var interpolated = {
        target: this.templateSrv.replace(target, null, 'regex')
    };

    return this.backendSrv.datasourceRequest({
      url: this.url + '/search',
      data: interpolated,
      method: 'POST',
      headers: this.baseheader
    }).then(this.mapToTextValue);
  }

  mapToTextValue(result) {
    console.log('mapToTextValue: ' + JSON.stringify(result));
    return _.map(result.data, (d, i) => {
      if (d && d.text && d.value) {
         return { text: d.text, value: d.value };
      }
      return { text: d, value: i };
    });
  }

  buildQueryParameters(options) {
    console.log('buildQueryParameters: ' + JSON.stringify(options));
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target),
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie'
      };
    });

    options.targets = targets;

    return options;
  }
}
