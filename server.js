var https = require('https');
var express = require('express');
var app = express();
var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var http = require('http').createServer(app);
var io = require('socket.io')(http);

function parseData(data) {
	var dom = new JSDOM(data, {
		features: {
			QuerySelector: true
		}, runScripts: "dangerously"
	});
	var html = "";
	try{
		var doc = dom.window.document;
		if(doc.querySelector("#LeftMainContent")){
			html += '<b class="text-success">Tiêu đề: </b>' + doc.querySelector("#ctl23_ctl00_divArticleTitle").innerHTML;
			html += '<hr><b class="text-success">Tóm tắt: </b>' + doc.querySelector("#ctl23_ctl00_divSummary").innerHTML;
			html += '<hr><b class="text-success">Nội dung: </b>' + doc.querySelector("#divContents").innerHTML;
		} else {
			html += '<b class="text-success">Tiêu đề: </b>' + doc.querySelector("h1[itemprop]").innerHTML;
			var x = doc.querySelector("#product-detail > div.kqchitiet");
			html += '<hr><b class="text-success">Khái quát chi tiết: </b><br>'
			+ x.children[0].textContent + x.children[1].textContent;
			html += '<hr><b class="text-success">Nội dung: </b>' + doc.querySelector("div[class='pm-desc']").innerHTML.replace(/<a [^>]*>([^<]*)<\/a>/g,'$1');
			var id_carousel = Math.random().toString().slice(2);
			x = doc.querySelector("#thumbs");
			if(x) html += '<hr><b class="text-success">Hình ảnh: </b><br>' + 
				`<div id="${id_carousel}" class="carousel slide" data-ride="carousel">
				<!-- Indicators -->
				<ol class="carousel-indicators">
				${[...Array(x.children.length).keys()].map(i => `<li data-target="#${id_carousel}" data-slide-to="${i}"${i == 0? ' class="active"' : ''}></li>`).join('')}
				</ol>

				<div class="carousel-inner">
				${[...x.children].map((i,x) => `<div class="item${x == 0 ? ' active' : ''}"><img src="${i.children[0].src.replace('200x200','745x510')}" style="max-height:300px; margin: auto;"></div>`).join('')}
				</div>

				<a class="left carousel-control" href="#${id_carousel}" data-slide="prev">
				<span class="glyphicon glyphicon-chevron-left"></span>
				<span class="sr-only">Previous</span>
				</a>
				<a class="right carousel-control" href="#${id_carousel}" data-slide="next">
				<span class="glyphicon glyphicon-chevron-right"></span>
				<span class="sr-only">Next</span>
				</a>
				</div>`;
			x = doc.querySelector(".div-hold > .table-detail");
			if(x) html += '<hr><b class="text-success">Đặc điểm bất động sản: </b><br>'+[...x.children].map(i => `<b>- ${i.children[0].textContent}</b>: ${i.children[1].textContent}`).join('<br>');
			x = doc.querySelector("#project > .table-detail");
			if(x) html += '<hr><b class="text-success">Thông tin dự án: </b><br>'+[...x.children].map(i => `<b>- ${i.children[0].textContent}</b>: ${i.children[1].textContent}`).join('<br>');
			x = doc.querySelector("#divCustomerInfo");
			if(x) html += '<hr><b class="text-success">Liên hệ: </b><br>'
				 + [...x.children]
				 .slice(0,-2)
				 .map(i => `<b>- ${i.children[0].textContent}</b>: ${i.id != "contactEmail" ? i.children[1].textContent : i.children[1].children[1].textContent}`).join('<br>');
		}
	} catch(e) {
		// statements
		return "Hmm, mình không thể lấy được thông tin. Nếu bạn cho rằng đây là lỗi của hệ thống, hãy liên hệ với admin nhé!";
	}
	return html;
}

function fetch_data(socket, text){
	var options = {
		hostname: 'batdongsan.com.vn',
		port: 443,
		path: text.replace(/.*com.vn/,''),
		method: 'GET',
		headers: { 
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
		}
	};
	new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			var s = "";
			res.on('data', (d) => {
				s += d;
			});
			res.on('end', function(){
				resolve(s);
			})
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	}).then((x) => socket.emit('send_text',parseData(x)));
}

io.on('connection', function (socket) {
	socket.on('send_text', function (text) {
		fetch_data(socket,text);
	});
});

app.get('/', (req, res) => {
	res.sendFile(__dirname+'/sources/index.html');
});
app.use('/', express.static('./sources'));
http.listen(process.env.PORT || 8080);
