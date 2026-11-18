FROM node:22-bookworm AS node
FROM jenkins/jenkins:lts-jdk21
USER root
COPY --from=node /usr/local/ /usr/local/
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers
COPY package.json package-lock.json /tmp/sis2/
RUN cd /tmp/sis2 && npm ci --ignore-scripts && npx playwright install --with-deps chromium && chmod -R a+rX /opt/playwright-browsers && rm -rf /tmp/sis2 /root/.npm
USER jenkins
RUN jenkins-plugin-cli --plugins workflow-aggregator pipeline-stage-view junit github-branch-source configuration-as-code embeddable-build-status
