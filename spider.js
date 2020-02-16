const https = require('https');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

'http://www.iplant.cn/info/10653?t=z'
let url = 'http://www.iplant.cn/ashx/getfrps.ashx';
let urlAttr = 'http://www.iplant.cn/ashx/getfrpssublist.ashx'
let urlType = 'http://www.iplant.cn/ashx/getfrpsclass.ashx'
var subjectList = ["Styracaceae","Alangiaceae","Musaceae","Plumbaginaceae","Stemonaceae","Liliaceae","Cupressaceae","Valerianaceae","Cistaceae","Frankeniaceae","Primulaceae","Scheuchzeriaceae","Bretschneideraceae","Goodeniaceae","Icacinaceae","Plantaginaceae","Tamaricaceae","Hippocrateaceae","Podostemaceae","Dipsacaceae","Labiatae","Najadaceae","Centrolepidaceae","Salvadoraceae","Flacourtiaceae","Rafflesiaceae","Euphorbiaceae","Juncaceae","Aquifoliaceae","Leguminosae","Dichapetalaceae","Ericaceae","Elaeocarpaceae","Eucommiaceae","Tiliaceae","Annonaceae","Caricaceae","Aizoaceae","Menispermaceae","Bromeliaceae","Balsaminaceae","Lemnaceae","Burseraceae","Elatinaceae","Ancistrocladaceae","Erythroxylaceae","Eriocaulaceae","Sonneratiaceae","Pittosporaceae","Tropaeolaceae","Gramineae","Sparganiaceae","Taxaceae","Bixaceae","Rhizophoraceae","Piperaceae","Pedaliaceae","Juglandaceae","Elaeagnaceae","Cucurbitaceae","Saxifragaceae","Daphniphyllaceae","Butomaceae","Polemoniaceae","Stylidiaceae","Betulaceae","Xyridaceae","Buxaceae","Zygophyllaceae","Apocynaceae","Theligonaceae","Zingiberaceae","Martyniaceae","Malpighiaceae","Ochnaceae","Hamamelidaceae","Chloranthaceae","Ceratophyllaceae","Violaceae","Malvaceae","Stachyuraceae","Crassulaceae","Campanulaceae","Compositae","Taccaceae","Acanthaceae","Fagaceae","Gesneriaceae","Myoporaceae","Simaroubaceae","Trochodendraceae","Calycanthaceae","Moringaceae","Orchidaceae","Nyssaceae","Lentibulariaceae","Chenopodiaceae","Cercidiphyllaceae","Hernandiaceae","Meliaceae","Polygonaceae","Orobanchaceae","Trapaceae","Eupteleaceae","Onagraceae","Gentianaceae","Dipterocarpaceae","Pyrolaceae","Pandanaceae","Podocarpaceae","Asclepiadaceae","Basellaceae","Ephedraceae","Verbenaceae","Portulacaceae","Aristolochiaceae","Loganiaceae","Coriariaceae","Rhoipteleaceae","Gnetaceae","Geraniaceae","Ranunculaceae","Droseraceae","Triuridaceae","Cannaceae","Actinidiaceae","Magnoliaceae","Casuarinaceae","Bombacaceae","Lardizabalaceae","Resedaceae","Oleaceae","Araucariaceae","Connaraceae","Pandaceae","Vitaceae","Hippocastanaceae","Clethraceae","Anacardiaceae","Aceraceae","Lythraceae","Rubiaceae","Rosaceae","Solanaceae","Sabiaceae","Begoniaceae","Caprifoliaceae","Myristicaceae","Thymelaeaceae","Saururaceae","Cephalotaxaceae","Umbelliferae","Loranthaceae","Moraceae","Cyperaceae","Theaceae","Symplocaceae","Capparaceae","Sapotaceae","Proteaceae","Opiliaceae","Cornaceae","Taxodiaceae","Hippuridaceae","Phytolaccaceae","Balanophoraceae","Staphyleaceae","Cruciferae","Punicaceae","Amaryllidaceae","Caryophyllaceae","Combretaceae","Ebenaceae","Rhamnaceae","Dioscoreaceae","Hydrocharitaceae","Callitrichaceae","Tetracentraceae","Aponogetonaceae","Burmanniaceae","Nymphaeaceae","Tetramelaceae","Pinaceae","Cycadaceae","Cynomoriaceae","Santalaceae","Myrtaceae","Guttiferae","Araceae","Philydraceae","Hydrophyllaceae","Olacaceae","Phrymaceae","Celastraceae","Sapindaceae","Sterculiaceae","Adoxaceae","Araliaceae","Pentaphylacaceae","Dilleniaceae","Passifloraceae","Cactaceae","Amaranthaceae","Typhaceae","Berberidaceae","Haloragidaceae","Flagellariaceae","Scrophulariaceae","Platanaceae","Convolvulaceae","Urticaceae","Commelinaceae","Linaceae","Empetraceae","Diapensiaceae","Potamogetonaceae","Salicaceae","Myricaceae","Melastomataceae","Ginkgoaceae","Crypteroniaceae","Papaveraceae","Ulmaceae","Pontederiaceae","Lecythidaceae","Iridaceae","Polygalaceae","Rutaceae","Alismataceae","Lauraceae","Restionaceae","Nepenthaceae","Marantaceae","Boraginaceae","Myrsinaceae","Nyctaginaceae","Bignoniaceae","Palmae","Oxalidaceae"]

var worm = function (key, index, text, level, isType) {
	let idx = index + 1
	new Promise(resolve => {
		setTimeout(() => {
			request(url + '?key=' + key + '&m=0.6532545059571335', function (error, response, body) {
				if(!body) {
					isType ? worm(key, index, text, level, isType) : worm(key, index, text, level)
				}
			   if (body && body[0] === "{") {
				   let data = JSON.parse(body)
				   resolve(data)
			   } else {
				   resolve('end')
			   }
			})
		}, 2000)
	}).then(data => {
		return new Promise(resolve => {
			if (data == 'end') {
				resolve('end')
				return
			}
			let attrPost = {
			   spid: data.frpsspno,
			   classid: data.frpsspclassid
			}
			let handlePost = function (e) {
				let postDataString = ''
				Object.keys(e).forEach((v, index) => {
				   postDataString = postDataString + v + '=' + e[v]
				   if (index < 1) {
					   postDataString = postDataString + '&'
				   }
				})
				return postDataString
			}
			let postData = {
			   spno: data.frpsspno,
			   spclassid: data.frpsspclassid
			}
			setTimeout(() => {
				request(urlType + '?' + handlePost(postData), function (err,httpResponse,body){
					if (body && body[0] === "{") {
						let typeData = JSON.parse(body)
						let dataStr = text == 'subject' ? data.frpsdesc + data.frpskey : typeData.frpsclasstxt + data.frpsdesc + data.frpskey
						let rule = {
							subject: '植物-科',
							attr: '植物-属',
							seeds: '植物-种'
						}
						fs.writeFile('./text/' + text + '.html', dataStr, { 'flag': 'a' }, function(err) {
						    if(err) throw err;
						    console.log('写入'+ rule[text] +'成功第' + idx + '');
						});
					}
				})
				resolve({url: urlAttr + '?'+ handlePost(attrPost), parentData: data})
			}, 2000)
		})
	}).then(beforData => {
		 return new Promise(resolve=> {
			 if (text == 'seeds' || beforData == 'end') {
			 	resolve('end')
			 	return 
			 }
			setTimeout(() => {
				request(beforData.url, function(err,httpResponse,body) {
					if (body && body[0] === "{") {
						let attData = JSON.parse(body)
						let $ = cheerio.load(attData.list)
						let attrObj = []
						$('a').each(i => {
						   let current = $('a').eq(i).text().split("  ");
						   let currentText = current[1].indexOf('.') !== -1 ? current[2] : current[1]
						   attrObj.push({
							   code: currentText,
							   name: current[0]
						   })
						})
						resolve({attrObj, beforData})
					}
				}) 
			}, 2000)
		 })
	}).then(data => {
		if (data == 'end') {
			return
		}
		let allPromise = []
		level = level + 1
		let fileName = level === 2 ? 'attr' : 'seeds'
		if (data.attrObj.length == 0) {
			return
		}
		data.attrObj.forEach((v, index) => {
			if (level === 2) {
				setTimeout(() => {
					worm(v.code, index, fileName , level, true)
				},2000)
			} else if (level === 3) {
				setTimeout(() => {
					worm(data.beforData.parentData.frpsl + '+' + v.code, index, fileName , level, true)
				})
			}
		})
	})
}

subjectList.forEach((v, index) => {
	if (index == 0) {
		worm(v, index, 'subject', 1)
	} else {
		setTimeout(() => {
			worm(v, index, 'subject', 1)
		}, 2000)
	}
})
