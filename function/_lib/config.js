// ============================================================
// 全局配置（集中管理，改这里即可）
// 注意：生产环境建议把这些敏感值改到 Cloudflare 环境变量里，
//      然后改成 env.PAY_PID 等读取方式，避免密钥泄露。
// ============================================================

export const CONFIG = {
  // ---- 易支付 V2 ----
  PAY_API_SUBMIT: 'https://pay.ykmcn.com/api/pay/submit', // 页面跳转支付
  PAY_API_CREATE: 'https://pay.ykmcn.com/api/pay/create', // 统一下单（预留）
  PID: '1184',
  // 商户私钥（PKCS#8，用于请求签名）
  PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuJ3WsnZEKySUM2YCpa4Es4pmraQP0zMTNvv9kaYdOTBdxiMh3/o+jtcVUYOpeionfXI9dLftMgGJ+gG1PxfbwSZmxRcSGQZSZS7VpXkITlSMzX+EgqNoN28sz+m2q2RJRqwTPh0BwYjjeVrSfshQ8H7MqEeuWjV1dBYCYT8APO8rfEOwCovmRP6hgDSDJikli2Hsr4lF7q+q3rhgiqQaMQ6y0iPiAQ4HdmEHaXN6aQsK6Dn27i9dYNOWtW302vDXUGj1n5aa1QiH48Dda8SrXOCIb1XESljAdEuCW+k1Mw1pqRZGZ4CQ7iuEgf45UEUR3bvjn9Sv6XYdTEE1G6exTAgMBAAECggEAPNsTFreUuHUjWkMi35DuebXRRwGSXVe0qcTFT9xEaMrUIltO2gd9QBLDmsGnBFRa609X1ZK8zrXKNTRBfm/J45uEdlrP2q5N8+dtxB0o79jcjRZC//ug/tjAQDCRY/MooJsnOjGkBeF8x8z6nxdGVOAq5leOwHQznM7QaejsTyXdI6Vu+lBz0uuLpvsV1PVuxdJ0str34ZNLKyNL1vq5oimtSP/T34hbooS7OpJ4aEwVFiNvImIZ3eHRwDgjUGTP7NV9Hu7rpdKE4c/KHVoaBawfhNSuw0/OsbbdrzTz1I72aoW26RxgxxW+0ZaYI5kG9O+l0XWq9drVSdo8Rtj9GQKBgQDUJWRZuBkl9yfFeO4YqeT7DrgCGzXDDEIDcCFkFnbIyTz+Pv2LjtzWsBaJM6sLdfh8rS8o0odEfFk2Ml89+ulhn0Sr0hNFo76IPxjhfM6HQt2gRCdBKM+JkpgQY8FkFi7u/xphPDJWtt2rulpwaktfiw1ipnweB24+X8zH740Z5wKBgQDSJ5Bk/51ryFW4PVVIiLAHeeKsDAnmddEpno7quuNqGOKUt/SEPCv6uchCwj3v3K+gEZV7rfKhGblIMK7I7NWhlSqX38Ga15AF7j0bFACYms1ML5vQbRKnSLijLAy7oe4BOmgKRXlga+6/4ArfZovQwfaIXuxEYfZe3Rz5zGkEtQKBgQCD8sXZr9GkdXc9MZwVpwYOyPbWCIqFyEf+z21VTUuQUuom0JLujGr69QbvSz2loThug2EDqP4NMLJkLSxj5n3mBCO4Iq9t7wyAvY4CIZhrNMGX/wvTUUjULmN6PjF4yPtkFzMXK1O7730sZHn/1X0P7fLjWt1z5/c/wGIkMPC4HQKBgH5o1/04mHtlxNIO6oa32ZKVqVgt4aKjic4MFxFwmyyNjXVBda4494dYSvKFHnZye53AFfeQOVrYO1AGIIyxkQshy74RFMbMFVDL7iuki3s/2m+ST5o+kbLYFl/oNjyC+cP5Wu2avpjWM4VtAX1BlKZclauP1XSIrIaBYFWNtDnlAoGAKTvgazawC8/DTmsDDCLx0NQ98j7iqd6r0u0CtX0EVPj5eOoeogQUhGr55soret7Yxu5Q4QfTdntVdh4dXOgknFTfiZ8OHtuMZV4TRD6ArzkLzGluen1TkMQVBW6stzGGFjXp1rwYVJoO5fL0imfnMkkoAvx4RX/36hR6kztP56U=
-----END PRIVATE KEY-----`,
  // 平台公钥（用于回调验签）
  PLATFORM_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8A5ApCbrB23PUn6PEnx5KZWHRCt/42Om51Ui6PesvdVDapRYJgbGWAXBFINQ+QS5an8WZtn4AH2U9HTYEPuiIXXREHsmiKgCSWqKTFgddPRmgaDvz28e7wLF0hxng29nWEk7ddynSwLLNDxod3A6CfWVrDzSwVyTVSQW1abtGHnqRkKwI/4/zvtYwfxHh1NEDN9zSRZd1SCvH6BU5C/p9eGaRxpp7bj52l+48+6xz7fM2sHJIE2hdTvFXc7hyN6sFkhJpCPSt80mQzO52lHlgM6je5k/fFFCFMAoCkA4qsedvkHanyQbQ6TkJaXvjvGvaUDsNJU74scjpJOOvX5jRwIDAQAB
-----END PUBLIC KEY-----`,

  // ---- EmailJS（请替换为你自己的账号）----
  EMAILJS_SERVICE_ID: 'service_b14b5b2',
  EMAILJS_TEMPLATE_ID: 'template_r3dldzr',
  EMAILJS_PRIVATE_KEY: 'HBiEJBAk4IA61lVhIFU0U',
  EMAILJS_PUBLIC_KEY: 'CeTJ2Yi33yZxHfhbV',
};
