var mysql = require("./lcMysql")
let axios = require("axios")
let cheerio = require("cheerio")
var path = require("path")

let request = require("request");
const sqlQuery = require("./lcMysql");

// module.exports = {
//   handleRequestByPromise
// };

function handleRequestByPromise(options) {
  let op = Object.assign(
    {},
    {
      url: "",
      method: "GET",
      encoding: null,
      header: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        Referer: "https://www.meituri.com"
      }
    },
    options
  );

  if (op.url === "") {
    throw new Error("请求的url地址不正确");
  }

  const promise = new Promise(function(resolve, reject) {
    request(op, (err, response, body) => {
      if (err) reject(err);

      if (response && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(`请求✿✿✿${url}✿✿✿失败`);
      }
    });
  });

  return promise;
};

var n = 0;
async function getInfoPerPage(num){
    let good_url = "https://www.amazon.fr/s?k=mat%C3%A9riel+scolaire&page=2&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&qid=1624312921&ref=sr_pg_"+num
    let res = await axios.get(good_url)
    //console.log(res)
    let $ = cheerio.load(res.data)
    let goodArr = $("#search > div.s-desktop-width-max.s-opposite-dir > div > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div")
    //  let reg = /#search > div\.s-desktop-width-max\.s-opposite-dir > div > div\.s-matching-dir\.sg-col-16-of-20\.sg-col\.sg-col-8-of-12\.sg-col-12-of-16 > div > span:nth-child\(4\) > div\.s-main-slot\.s-result-list\.s-search-results\.sg-row > div:nth-child\(.*?\) > div > span > div > div > div > div > div:nth-child\(3\) > h2 > a > span/igs
    //  let goodArr = $(reg)
    //console.log(goodArr)

    goodArr.each((i,element) => {
        let $ = cheerio.load(element)
        let id = n++;
        let rnumber = Math.ceil(Math.random()*10)
        let sorte = $(".a-size-base-plus").text()
        let disponible=''

        if(rnumber%3==0){
          disponible = 'indisponible'
        }else{
          disponible = 'disponible'
        }
        let etat = rnumber + '/10'
        let duree = Math.ceil(Math.random()*10)+" ans";
       //let name = goodInfo.text()

       
       arr = [id, sorte, etat, duree, disponible]
       intoMysql(arr)

        // mvInfo = "https:"+mvInfo
        // getInfo(mvInfo,img).then(()=>{
        //     console.log("one movie is into database")
        // })
    });  
}

async function intoMysql(arr){
  let strSql = "insert into t_materiel values(?,?,?,?,?);"
  await sqlQuery(strSql, arr)
} 
/*for(var i=1;i<=7;i++){
  getInfoPerPage(i)
}*/
(async function test(){
  let good_url = "https://www.amazon.fr/s?k=mat%C3%A9riel+scolaire&page=2&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&qid=1624312921&ref=sr_pg_"+'1'
  let res = await axios.get(good_url)
  //console.log(res)
  let $ = cheerio.load(res.data)

  let sorte = $(".a-size-base-plus").text()
  console.log(sorte)
})()

// let index_url = "https://sou.pptv.com/category/typeid_2_pn_1"

// async function spider(){
//     let res = await axios.get(index_url)
//     let $ = cheerio.load(res.data)

//     let pageAll = $("body > div.main > div.pagination > ul > li:nth-last-child(2) > a").text()

//     for(i=16;i<=pageAll;i++){
//         getInfoPerPage(i)    
//     }
// }

// async function getInfo(onemvUrl,img){
//     let res = await handleRequestByPromise({ url: onemvUrl });
//     let $ = cheerio.load(res,{ignoreWhitespace: true})
//     let name = $('#video-info > div.bd > h1').text();
//     let category = $("#video-info > div.bd > ul > li.tabs > a").text()
//     let score = $("#video-info > div.bd > div > em").text()
//     let actor = $("#video-info > div.bd > ul > li:nth-child(1) > a:nth-child(2)").text()
//     let imgUrl = img
//     let mvUrl = onemvUrl
//     let strSql = "insert into movies(name, category, score, actor, imgUrl, mvUrl) values(?,?,?,?,?,?);"
//     arr = [name, category, score, actor, imgUrl, mvUrl]
//     await sqlQuery(strSql, arr)
// }

//spider()


