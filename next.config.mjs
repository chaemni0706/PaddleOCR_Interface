/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist']
  },
  webpack: (config, { isServer }) => {
    // PDF.js worker 설정
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    // Konva.js 설정
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    return config;
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/**',
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  // 파일 업로드 크기 제한
  serverRuntimeConfig: {
    maxFileSize: '50mb',
  },
  publicRuntimeConfig: {
    maxFileSize: '50mb',
  },
};

export default nextConfig;
