const cheerio = require('cheerio');
const fs = require("fs");
const nodemailer = require('nodemailer');
const rp = require('request-promise');

/**
 * 出力先を設定します。true:ファイル false:メール
 * @type {boolean}
 */
const isMakeFile = process.argv[2] === 'text';

/**
 * 繰り返し処理のインターバルを時間単位で指定します
 * 未設定時は1時間置き
 * @type {Number}
 */
const interval = !process.argv[3] ? null : Number(process.argv[3]);

// 複数ページ取得
const promises = [...Array(3)].map((_, i) => {
    return `ここにURL?page=${i + 1}`
}).map(async(url) => {
    const $ = await rp.get(url, {
        transform: (body) => {
            return cheerio.load(body);
        }
    });
    const titleList = [];
    // リスト表記されている内容をパース（適宜修正）
    $('.title').each((i, elem) => {
        const title = $(elem).html()
        titleList.push(`${title}`);
    });
    return titleList;
});

const getNewPosts = async() => {
    await Promise.all(promises).then((result) => {
        if (isMakeFile) {
            const fileName = `${getCurrentTime}_list.tsv`;
            if (isMakeFile && fs.existsSync(fileName)) fs.unlinkSync(fileName);
            fs.writeFile(fileName, result.flat().join('\n'), {
                flag: 'wx'
            }, (err) => {
                if (err) throw err;
                console.log(`${getCurrentTime()}出力`);
            });
        } else {
            // TODO: GMailの送信はセキュリティ弱くなるので非推奨
            const smtpConfig = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'あなたのGMailアカウント',
                    pass: 'GMailのパスワード'
                }
            };
            const transporter = nodemailer.createTransport(smtpConfig);
            transporter.sendMail({
                from: '送信元アドレス',
                to: '送信先アドレス',
                subject: `タイトル ${getCurrentTime()}`,
                text: result.flat().join('\n\n'),
            }, (err, reply) => {
                if (err) console.log(err && err.stack);
                console.dir(reply);
            });
        }
    });
}

// 一回実行 or 繰り返し実行
if (!interval) {
    getNewPosts()
} else {
    // 開始時即時実行
    getNewPosts()
    setInterval(getNewPosts, 1000 * 60 * 60 * t);
}

const getCurrentTime = () => {
    const n = new Date();
    return `${n.getFullYear()}/${pz(n.getMonth() + 1)}/${pz(n.getDate())} ${pz(n.getHours())}/${pz(n.getMinutes())}`;
}

const pz = (num) => {
    return result = num < 10 ? `${0}${num}` : num;
}