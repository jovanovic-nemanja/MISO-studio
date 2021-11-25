/**
 * キャッシュを行うミドルウェアのサンプル
 */

const isMyPage = url => {
  return /^\/my/.test(url);
};

const cacheMiddleware = (req, res, next) => {
  if (isMyPage(req.url)) {
    res.header('Cache-Control', 'no-store');
  } else {
    res.header('Cache-Control', `max-age=${60}`); // 1分間
  }
  next();
};

module.exports = {
  cacheMiddleware,
};
