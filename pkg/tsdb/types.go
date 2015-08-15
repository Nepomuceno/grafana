package tsdb

type Request struct {
	TimeRange     TimeRange
	MaxDataPoints int
	Queries       QuerySlice
}

type Response struct {
	BatchTimings []*BatchTiming
	Results      map[string]*QueryResult
}

type BatchTiming struct {
	TimeElapsed int64
}

type TimeRange struct {
}

type DataSourceInfo struct {
	Id                int64
	Name              string
	Type              string
	Url               string
	Password          string
	User              string
	Database          string
	BasicAuth         bool
	BasicAuthUser     string
	BasicAuthPassword string
}

type BatchResult struct {
	Error        error
	QueryResults map[string]*QueryResult
	Timings      *BatchTiming
}

type QueryResult struct {
	Error  error
	RefId  string
	Series TimeSeriesSlice
}

type TimeSeries struct {
	Name   string       `json:"name"`
	Points [][2]float64 `json:"points"`
}

type TimeSeriesSlice []*TimeSeries
