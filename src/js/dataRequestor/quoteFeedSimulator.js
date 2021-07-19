class QuoteFeedSimulator {

	constructor(){
		this.maxTicks = 20000;
		this.url = process.env.url;
		this.postAjax = this.postAjax.bind(this);
		this.fetchInitialData = this.fetchInitialData.bind(this);
		this.fetchUpdateData = this.fetchUpdateData.bind(this);
		this.fetchPaginationData = this.fetchPaginationData.bind(this);
		this.formatChartData = this.formatChartData.bind(this);
	}

	postAjax (url, cb) {
		// debugger;
		var server = new XMLHttpRequest();
		url += (url.indexOf("?") == -1 ? "?" : "&") + new Date().getTime();
		server.open("GET", url);
		server.onload = function () {
			cb(this.status, this.responseText);
		};
		server.onerror = function () {
			cb(500);
		};
		server.send();
	};

	

	// called by chart to fetch initial data
	fetchInitialData (
		symbol,
		suggestedStartDate,
		suggestedEndDate,
		params,
		cb
	) {
		console.log(this.url);
		var queryUrl =
			this.url +
			"?session=" +
			encodeURIComponent(params.quoteDriverID) + // add on unique sessionID required by ChartIQ simulator;
			"&identifier=" +
			symbol +
			"&startdate=" +
			suggestedStartDate.toISOString() +
			"&enddate=" +
			suggestedEndDate.toISOString() +
			"&interval=" +
			params.interval +
			"&period=" +
			params.period +
			"&extended=" +
			(params.extended ? 1 : 0); // using filter:true for after hours
		this.postAjax(queryUrl, function (status, response) {
			// process the HTTP response from the datafeed
			if (status == 200) {
				// if successful response from datafeed
				var newQuotes = this.formatChartData(response, symbol);
				cb({
					quotes: newQuotes,
					moreAvailable: true,
					attribution: { source: "simulator", exchange: "RANDOM" }
				}); // return the fetched data; init moreAvailable to enable pagination
			} else {
				// else error response from datafeed
				cb({ error: response ? response : status }); // specify error in callback
			}
		}.bind(this));
	};

	// called by chart to fetch update data
	fetchUpdateData (symbol, startDate, params, cb) {
		var queryUrl =
			this.url +
			"?session=" +
			params.quoteDriverID + // add on unique sessionID required by ChartIQ simulator;
			"&identifier=" +
			symbol +
			"&startdate=" +
			startDate.toISOString() +
			"&interval=" +
			params.interval +
			"&period=" +
			params.period +
			"&extended=" +
			(params.extended ? 1 : 0); // using filter:true for after hours
		this.postAjax(queryUrl, (status, response) =>{
			// process the HTTP response from the datafeed
			if (status == 200) {
				// if successful response from datafeed
				var newQuotes = this.formatChartData(response, symbol);
				cb({
					quotes: newQuotes,
					attribution: { source: "simulator", exchange: "RANDOM" }
				}); // return the fetched data
			} else {
				// else error response from datafeed
				cb({ error: response ? response : status }); // specify error in callback
			}
		});
	};

	// called by chart to fetch pagination data
	fetchPaginationData (
		symbol,
		suggestedStartDate,
		endDate,
		params,
		cb
	) {
		var queryUrl =
			this.url +
			"?session=" +
			params.quoteDriverID + // add on unique sessionID required by ChartIQ simulator;
			"&identifier=" +
			symbol +
			"&startdate=" +
			suggestedStartDate.toISOString() +
			"&enddate=" +
			endDate.toISOString() +
			"&interval=" +
			params.interval +
			"&period=" +
			params.period +
			"&extended=" +
			(params.extended ? 1 : 0); // using filter:true for after hours
		this.postAjax(queryUrl, function (status, response) {
			// process the HTTP response from the datafeed
			if (status == 200) {
				// if successful response from datafeed
				var newQuotes = this.formatChartData(response, symbol);
				cb({
					quotes: newQuotes,
					moreAvailable: suggestedStartDate.getTime() > 0,
					upToDate: endDate.getTime() > Date.now(),
					attribution: { source: "simulator", exchange: "RANDOM" }
				}); // return fetched data (and set moreAvailable)
			} else {
				// else error response from datafeed
				cb({ error: response ? response : status }); // specify error in callback
			}
		}.bind(this));
	};

	// utility function to format data for chart input; given simulator was designed to work with library, very little formatting is needed
	// symbol argument can be used to further refine simulated data
	formatChartData (response, symbol) {
		var feeddata = JSON.parse(response);
		var newQuotes = [];
		for (var i = 0; i < feeddata.length; i++) {
			var newQuote = {};
			newQuote.DT = new Date(feeddata[i].DT); // DT is a string in ISO format, make it a Date instance
			newQuote.Open = feeddata[i].Open;
			newQuote.High = feeddata[i].High;
			newQuote.Low = feeddata[i].Low;
			newQuote.Close = feeddata[i].Close;
			newQuote.Volume = feeddata[i].Volume;
			newQuotes.push(newQuote);
		}
		return newQuotes;
	};

}

export default QuoteFeedSimulator;