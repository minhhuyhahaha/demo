var jsdom = require('jsdom');
var { JSDOM } = jsdom;

function parseDataContent(data) {
	var dom = new JSDOM(data, {
		features: {
			QuerySelector: true
		}
	});
	var field = {};
	try {
		var doc = dom.window.document;
		//Tieu de
		field['title'] = doc.querySelector(".pm-title").textContent.trim();
		//Khai quat chi tiet
		x = doc.querySelector("#product-detail > div.kqchitiet");
		if(x){
			var a = x.textContent.match(/Khu vực:(.*)\n*Giá:\n*(.*)\n*Diện tích:\n*(.*)/);
			field['area'] = a[1].trim();
			field['price'] = a[2].trim();
			field['area_size'] = a[3].trim();
		}
		//Noi dung
		field['content'] = doc.querySelector(".pm-desc,.pm-content.stat").innerHTML.replace(/<a [^>]*>([^<]*)<\/a>/g, '$1').trim();
		//Hinh thu nho
		x = doc.querySelector("#thumbs");
		field['image'] = x ? JSON.stringify([...x.children].map(i => i.children[0].src.replace('200x200', '745x510'))) : null;
		//Dac diem bat dong san
		x = doc.querySelector(".div-hold > .table-detail");
		field['info_estate'] = x ? JSON.stringify([...x.children].map(i => [i.children[0].textContent.trim(), i.children[1].textContent.trim()])) : null;
		//Thong tin du an
		x = doc.querySelector("#project > .table-detail");
		field['info_project'] = x ? JSON.stringify([...x.children].map(i => [i.children[0].textContent.trim(), i.children[1].textContent.trim()])) : null;
		//Thong tin lien he
		x = doc.querySelector("#divCustomerInfo,#divCustomerInfoAd");
		if (x) {
			for (let i of [...x.children]) {
				if (i.children.length > 1)
					switch (i.children[0].textContent.trim()) {
						case "Email": field['email'] = i.children[1].textContent.replace(/[^]*>(.*)<\/a>[^]*/, '$1').split(/[^\d]+/).map(i => i != '' ? String.fromCharCode(i) : "").join(""); break;
						case "Tên liên lạc": field['name'] = i.children[1].textContent.trim(); break;
						case "Mobile": case "Điện thoại": field['phone'] = i.children[1].textContent.trim(); break;
						case "Địa chỉ": field['address'] = i.children[1].textContent.trim(); break;
					}
			}
		}

	} catch (e) {
		console.log(e);
		return null;
	}
	return field;
}
function parseDataUrl(data) {
	var dom = new JSDOM(data, {
		features: {
			QuerySelector: true
		}
	});
	var doc = dom.window.document;
	var x = doc.querySelectorAll(".p-title a");
	if (x) {
		return [...x].map(i => "https://batdongsan.com.vn" + i.href);
	}
	return null;
}
exports.parseDataContent = parseDataContent;
exports.parseDataUrl = parseDataUrl;