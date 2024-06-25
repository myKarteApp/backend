# ベースとなるイメージを指定
FROM node:22

# 作業ディレクトリを設定
WORKDIR /usr/app

RUN npm update -g npm
RUN npm i -g @nestjs/cli

# ポートを公開
WORKDIR /usr/app/project
EXPOSE 4000

# アプリケーションを起動
CMD ["npm", "run", "start:dev"]
