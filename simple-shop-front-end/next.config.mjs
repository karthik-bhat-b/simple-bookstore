/** @type {import('next').NextConfig} */
import RemoveServiceWorkerPlugin from 'webpack-remove-serviceworker-plugin';

const nextConfig = {
    reactStrictMode:false,
    env: {
        BASE_URL: "http://localhost:8080",
    },
    webpack: (config) => {
        plugins: [new RemoveServiceWorkerPlugin()];
        return config;
      },
};

export default nextConfig;
