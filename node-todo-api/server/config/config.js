let env = process.env.NODE_ENV || 'development';
console.log('ENV VARIABLE: ', env);
console.log('PORT ENV: ', process.env.PORT);

if (env === 'development') {
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === 'test') {
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}