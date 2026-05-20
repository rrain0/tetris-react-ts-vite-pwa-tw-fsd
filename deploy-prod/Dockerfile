FROM node:22.17.0-alpine AS base

# Configures where pnpm stores its global data
ENV PNPM_HOME="/pnpm"
# and adds it to the system PATH so you can run commands directly
ENV PATH="$PNPM_HOME:$PATH"

# Turn on the built-in Node.js tool used to manage pnpm without needing to install it via npm
RUN corepack enable
# Explicitly download the pnpm binary of provided version into the image during the build process
# '--activate' explicitly sets up this pnpm version to be used globally by 'pnpm' command
RUN corepack prepare pnpm@latest --activate

# Set the current path in image (across all build stages in the same image)
WORKDIR /app




# Load & use only runtime dependencies
FROM base AS runtime-deps
# Copy dependency-list files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
# Mount deps folder from your host machine and install only runtime deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile




# Seaprate build stage to store & use devDependencies only here to reduce total image size
FROM base AS build

# Copy all project files (except that in .dockerignore)
COPY ./ ./

# Mount deps folder from your host machine and install all deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build project
RUN pnpm run build




FROM nginx:1.29.8-alpine
WORKDIR /app
COPY --from=build /app/dist ./


LABEL authors="rrain"
