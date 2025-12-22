# 如何推送代码到 GitHub

## 方法一：直接在命令中输入（最简单）

运行这个命令，然后按提示输入：
- Username（用户名）：输入你的 GitHub 用户名（BuilderDane）
- Password（密码）：**不要输入你的 GitHub 密码**，而是粘贴你刚才复制的 Personal Access Token

```bash
git push -u origin main
```

## 方法二：把 Token 直接放在命令里（更简单，但要注意安全）

替换 `YOUR_TOKEN` 为你的实际 Token：

```bash
git push https://YOUR_TOKEN@github.com/BuilderDane/myenglishnameis.git main
```

⚠️ 注意：这个方法会把 Token 显示在命令行历史中，用完记得清除历史。

## 方法三：使用 Git Credential Helper（推荐，一次设置永久使用）

```bash
# 保存你的凭据（输入一次后，以后就不用再输入了）
git config --global credential.helper osxkeychain

# 然后正常推送
git push -u origin main
```

当你运行 `git push` 时，它会弹出窗口让你输入：
- Username: BuilderDane
- Password: 粘贴你的 Personal Access Token

输入一次后，Mac 会帮你保存，以后就不用再输入了！

