# 龙黑发卡 - Cloudflare Pages 部署教程

## 第一步：创建 D1 数据库

1. 登录 Cloudflare Dashboard
2. 左侧菜单 → **Workers & Pages** → **D1 SQL Database**
3. 点 **Create database**
4. 名字填：`longhei_faka`
5. 创建后点进去 → **Console** 标签
6. 把 `schema.sql` 文件里的全部内容复制粘贴进去执行
7. 记下右上角的 **Database ID**（后面要用）

## 第二步：上传代码到 GitHub

1. 新建一个 GitHub 仓库（private 就行）
2. 把整个文件夹上传上去

## 第三步：连接 Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages**
2. 选 **Connect to Git**
3. 选你刚建的 GitHub 仓库
4. 构建设置全部留空，直接点 **Save and Deploy**
5. 部署成功后，进项目 → **Settings** → **Bindings** → **Add binding**
6. 选 **D1 database**，Variable name 填 `DB`，选你刚建的 `longhei_faka`
7. 重新部署一次

## 第四步：绑定域名

1. Pages 项目 → **Custom domains** → **Add custom domain**
2. 填：`serverdo.ccwu.cc`
3. 按提示去 DNS 加解析记录

## 第五步：使用

- 首页：`https://serverdo.ccwu.cc`
- 注册：`https://serverdo.ccwu.cc/register.html`
- 登录：`https://serverdo.ccwu.cc/login.html`
- 店铺：`https://serverdo.ccwu.cc/shop.html?uid=商家ID`

---

## EmailJS 邮件模板配置

在 EmailJS 后台配置模板变量：

| 变量名 | 说明 |
|--------|------|
| `to_email` | 买家邮箱 |
| `subject` | 邮件主题 |
| `message` | 邮件内容 |
| `card_content` | 购买到的卡密 |
| `order_no` | 订单号 |

**EmailJS 后台模板HTML（复制粘贴）：**

```html
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif">
  <div style="background:linear-gradient(135deg,#1677FF,#2196F3);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0">
    <h1 style="margin:0">🎉 购买成功</h1>
    <p style="margin:10px 0 0;opacity:0.9">感谢您购买龙黑发卡</p>
  </div>
  <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 12px 12px">
    <p style="color:#666;margin:0 0 16px">订单号：<strong>{{order_no}}</strong></p>
    <div style="background:#f5f5f7;padding:20px;border-radius:10px;margin:16px 0">
      <p style="margin:0 0 8px;color:#999;font-size:13px">您的卡密：</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:#ff5252;word-break:break-all">{{card_content}}</p>
    </div>
    <p style="color:#999;font-size:13px;text-align:center;margin-top:24px">
      如有问题请联系客服<br>Copyright © 2026 龙黑发卡
    </p>
  </div>
</div>
```

**EmailJS 配置信息：**
- Service ID: `service_b14b5b2`
- Template ID: `template_r3dldzr`
- Private Key（私钥，后端用）: `HBiEJBAk4IA61lVhIFU0U`
- Public Key（公钥，前端用）: 在 EmailJS 后台 Account 页面找
- 发件邮箱: `dnmdos@qq.com`

---

## 邮箱验证码页面

文件：`public/send_code.html`

**EmailJS 后台需要配置的模板变量：**

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `to_email` | 接收邮箱 | 用户输入的邮箱 |
| `subject` | 邮件主题 | 【龙黑发卡】邮箱验证码 |
| `message` | 邮件内容 | 您的验证码是：123456 |
| `code` | 验证码数字 | 123456 |

**EmailJS 模板HTML（验证码用）：**

```html
<div style="max-width:500px;margin:0 auto;font-family:Arial,sans-serif">
  <div style="background:linear-gradient(135deg,#1677FF,#2196F3);color:white;padding:30px;text-align:center;border-radius:12px 12px 0 0">
    <h1 style="margin:0">龙黑发卡</h1>
  </div>
  <div style="background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 12px 12px;text-align:center">
    <p style="color:#666;margin:0 0 20px">您正在注册龙黑发卡账号</p>
    <div style="background:#f5f5f7;padding:20px;border-radius:10px;margin:20px 0">
      <p style="margin:0;color:#999;font-size:13px">验证码</p>
      <p style="margin:8px 0 0;font-size:36px;font-weight:700;color:#1677FF;letter-spacing:8px">{{code}}</p>
    </div>
    <p style="color:#999;font-size:13px">5分钟内有效，请勿泄露给他人</p>
  </div>
</div>
```

**注意：** 前端直接调EmailJS需要用 **Public Key（公钥）**，不是私钥。私钥在后端Node.js/Cloudflare Functions里用。公钥在 EmailJS 后台 → Account → API Keys 里复制。

---

## 易支付配置

- 商户ID: `1184`
- 商户密钥: `pv9PDVv1fQJ12vAtAQqcPD9p8fpdV2UQ`
- 接口地址: `https://pay.ykmcn.com/submit.php`
- 回调地址: `https://serverdo.ccwu.cc/api/notify`

---

## 文件结构

```
├── functions/api/       后端接口
│   ├── login.js        登录
│   ├── register.js      注册
│   └── goods.js        商品
├── public/             前端页面
│   ├── index.html      首页
│   ├── login.html      登录
│   ├── register.html    注册
│   ├── dashboard.html   商家后台
│   ├── shop.html       店铺页
│   ├── goods.html       商品管理
│   ├── goods_edit.html  添加商品
│   ├── orders.html     订单
│   ├── cards.html      卡密
│   ├── coupons.html     优惠券
│   ├── plugins.html    插件
│   ├── stats.html      统计
│   ├── shop_settings.html 店铺设置
│   └── wallet.html     钱包
├── schema.sql          D1数据库表结构
└── wrangler.toml       Cloudflare配置
```
