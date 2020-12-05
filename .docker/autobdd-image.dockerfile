ARG AUTOBDD_VERSION
FROM xyteam/autobdd-ubuntu:${AUTOBDD_VERSION}
USER root
ENV DEBIAN_FRONTEND noninteractive

# apt install additional packages
RUN \
    # add key for google-chrome
    rm -f /etc/apt/sources.list.d/google-chrome.list && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    wget -qO- --no-check-certificate https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    mkdir -p /etc/opt/chrome/policies/managed && \
    echo "{\"CommandLineFlagSecurityWarningsEnabled\": false}" > /etc/opt/chrome/policies/managed/managed_policies.json && \
    # add key for nodejs 12.x, change nodejs version here
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && \
    # add key for k6
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61 && \
    echo "deb https://dl.bintray.com/loadimpact/deb stable main" | sudo tee -a /etc/apt/sources.list && \
    # update and install additional packages
    apt update -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"  && \
    apt install -q -y --allow-unauthenticated --fix-missing -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" \
    google-chrome-stable \
    nodejs \
    k6

# install AutoBDD
ADD . /root/Projects/AutoBDD

# setup AutoBDD
RUN cd /root/Projects/AutoBDD && \
    pip install -r requirement.txt && \
    npm config set script-shell "/bin/bash" && \
    npm cache clean --force && \
    npm --loglevel=error install && \
    npm run --loglevel=error test && \
    npm run --loglevel=error clean && \
    rm -rf /tmp/chrome_profile_* /tmp/download_* ./test-projects/autobdd-test/test-results

# copy preset ubuntu system env
COPY .docker/autobdd.root /
RUN chmod +x /root/.bash_profile /root/autobdd-run.startup.sh /root/autobdd-dev.startup.sh 
