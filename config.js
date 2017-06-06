exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blog-app' ||
                      'mongodb://dev:123@ds111262.mlab.com:11262/blog-app';
exports.PORT = process.env.PORT || 8080;