var fetch = require("./fetch");
var Crawler = require("crawler");
var db = require('./database');

var c = new Crawler({
	maxConnections: 1,
	rateLimit: 1000,
	jQuery: false,
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
	callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
			var data = fetch.parseDataContent(res.body);
			if(data != null){
				data['id'] = res.request.uri.href.match(/\d+$/)[0];
				data['url'] = res.request.uri.href;
				db.insert(data);
			}
        }
        done();
    }
});

//Get all urls in all pages
function crawl_page(url, page_id){
	c.queue([{
		uri: url + "/p" + page_id,
		callback: function (error, res, done) {
			if(error){
				console.log(error);
			}else{
				var urls = fetch.parseDataUrl(res.body);
				if(urls) {
					c.queue(urls);
					crawl_page(url, page_id+1);
				}
			}
			done();
		}
	}]);
}
exports.crawl_page = crawl_page;