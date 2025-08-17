/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/wedding-invitation',
  assetPrefix: '/wedding-invitation/',

  compiler: {
    styledComponents: true,
  },

  // GitHub Pages용 이미지 최적화 설정
  images: {
    unoptimized: true, // GitHub Pages에서는 이미지 최적화 비활성화
  },
  
  // 성능 최적화 설정
  // Next.js 15에서는 swcMinify 옵션이 제거되었습니다
  
  // 외부 이미지 도메인 설정 (필요시 추가)
  // images: {
  //   domains: ['example.com'],
  // },
  
};

export default nextConfig;
