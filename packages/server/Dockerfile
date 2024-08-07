# Use the official Bun image
FROM oven/bun:1 AS base

WORKDIR /usr/src/app

# Install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY ./package.json ./bun.lockb /temp/dev/
COPY ./packages/server/package.json /temp/dev/packages/server/
COPY ./packages/desktop/package.json /temp/dev/packages/desktop/
COPY ./packages/mobile/package.json /temp/dev/packages/mobile/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY ./package.json ./bun.lockb /temp/prod/
COPY ./packages/server/package.json /temp/prod/packages/server/
COPY ./packages/desktop/package.json /temp/prod/packages/desktop/
COPY ./packages/mobile/package.json /temp/prod/packages/mobile/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .
COPY --from=prerelease /usr/src/app/packages/server/src/index.ts src/index.ts

# Run the app
USER bun
EXPOSE 4000/tcp
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "packages/server/src/index.ts" ]
