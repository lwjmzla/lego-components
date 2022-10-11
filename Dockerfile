# Dockerfile
# 提前docker pull node:14 加快速度
FROM node:14
COPY . /app
WORKDIR /app


# 构建镜像时，一般用于做一些系统配置，安装必备的软件。可有多个 RUN
# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
RUN npm install -g cnpm --registry=https://registry.npmmirror.com && cnpm i && cnpm i -g pm2

# 启动容器时执行，CMD最后的命令要求是 阻塞控制台的程序，这样容器才会持续地执行，类似监听日志那种，而不是npm run test，执行完毕就结束了。
CMD echo $NODE_ENV && echo $BUILD_ENV && npm run test && pm2 log

# 环境变量process.env.BUILD_ENV
ENV NODE_ENV="dev"
ENV BUILD_ENV="dev"