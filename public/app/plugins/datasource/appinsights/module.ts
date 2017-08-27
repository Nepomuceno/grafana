import {AppInsightsDatasource} from './datasource';
import {AppInsightsQueryCtrl} from './query_ctrl';

class ApplicationInsightsConfigCtrl {
  static templateUrl = 'partials/config.html';
}

class ApplicationInsightsAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  AppInsightsDatasource as Datasource,
  AppInsightsQueryCtrl as QueryCtrl,
  ApplicationInsightsConfigCtrl as ConfigCtrl,
  ApplicationInsightsAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
