#!/bin/bash

# 引数チェック
if [ $# -ne 1 ]; then
  echo "Usage: $0 <migration_name>"
  exit 1
fi

# マイグレーション名を引数から取得
migration_name=$1

# Prisma migrate save コマンド実行
result=$(npx prisma migrate save --name "$migration_name" --experimental)

# コマンドの実行結果からマイグレーションIDを抽出
# migration_id=$(echo "$result" | grep "Created Migration" | awk '{print $NF}')

# # マイグレーション実行
# npx prisma migrate up --experimental --auto-approve $migration_id

# # スキーマ更新
# npx prisma generatecd

mysql -u root -p