FROM ubuntu:18.04 as builder

WORKDIR /apps

COPY . .

# ===========================================================
FROM nginx:stable-alpine

# The following is mainly for doc purpose to show which ENV is supported
ENV WS_URL=

RUN apk add --no-cache bash && \
    apk add --update nodejs npm && \
    apk add --update yarn && \
    apk add --no-cache git && \
    apk add python3 && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    apk add --no-cache musl-dev gcc make && \
    apk add --no-cache python3-dev py3-pip && \
    pip install --upgrade pip && \
    pip install cffi && \
    pip install cryptography && \
    apk add libusb && \
    apk info libusb && \
    npm install -g node-gyp && \
    node-gyp clean

WORKDIR /usr/share/nginx/html

COPY env.sh /usr/share/nginx/html/

RUN apk add --no-cache bash; chmod +x env.sh

COPY --from=builder /apps/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/ /usr/share/nginx/html
COPY --from=builder /apps/package.json /usr/share/nginx/html/package.json
COPY --from=builder /apps/packages /usr/share/nginx/html/packages
COPY --from=builder /apps/scripts /usr/share/nginx/html/scripts

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
