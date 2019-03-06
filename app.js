//「2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」作成
'use strict';
//モジュールの呼出
const fs = require('fs');
const readline = require('readline');
//ファイルを読み込みを行う Stream を生成
const rs = fs.ReadStream('./popu-pref.csv');
//readline オブジェクトの input として設定
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();
//rl オブジェクトで line というイベントが発生したらこの無名関数を呼ぶ
rl.on('line', (lineString) => {//lineString:読み込んだ 1 行の文字列
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);//集計年
    const prefecture = columns[2];//都道府県名
    const popu = parseInt(columns[7]);//15〜19歳（人）
    if (year === 2010 || year === 2015) {
        　// value：2010の人口・2015人口・変化率
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu2010:0,
                popu2015:0,
                change:null
            };
        }
        if(year === 2010){
            value.popu2010 += popu;
        }
        if(year === 2015){
            value.popu2015 += popu;
        }
        prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close', () => {
    // for-of 構文(Map や Array の中身を of の前に与えられた変数に代入して for ループと同じことができる)
    // Map に for-of を使うと、キーと値で要素が 2 つある配列が前に与えられた変数に代入される
    // 分割代入
    for(let [key, value] of prefectureDataMap){
        value.change = value.popu2015 / value.popu2010;
    }

    // pair1：現在の配列　pair2：次の配列
    // 変化率の降順に並び替え：pair2 を pair1 より前にしたいときは、正の整数をreturn
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;//次の変化率-現在の変化率
    });
    //先ほどの連想配列の Map とは別のもので、 map 関数という
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu2010 + '=>' + value.popu2015 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});
