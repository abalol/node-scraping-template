# node-scraping-template
Node.jsとCheerioでWebページをスクレイピングする際のテンプレートです

## Install
```shell
yarn
```

## Setup

- メール送信時は`smtpConfig`と`sendMail`を適宜修正する
- package.jsonの引数で繰り返し時のインターバルの設定を行える

## 例

### 常駐して1時間置きにメール送信させる

```shell
yarn run serve
```

### 1回実行してローカルに.tsvを作成する

```shell
yarn run text
```
