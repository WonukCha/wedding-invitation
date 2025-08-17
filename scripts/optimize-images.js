const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 이미지 최적화 설정
const OPTIMIZATION_CONFIG = {
  // 메인 이미지 (배경용)
  main: {
    width: 1920,
    height: 1080,
    quality: 85,
    progressive: true
  },
  // 갤러리 이미지
  gallery: {
    width: 1200,
    height: 800,
    quality: 80,
    progressive: true
  },
  // 지도 이미지
  map: {
    width: 800,
    height: 600,
    quality: 85,
    progressive: true
  }
};

async function optimizeImage(inputPath, outputPath, config) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    console.log(`🔄 Processing: ${path.basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

    // 임시 파일 경로 생성
    const tempPath = outputPath + '.tmp';

    await sharp(inputPath)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: config.quality,
        progressive: config.progressive,
        mozjpeg: true
      })
      .toFile(tempPath);

    // 원본 파일을 임시 파일로 교체
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ Optimized: ${path.basename(outputPath)} (${(newSize / 1024 / 1024).toFixed(2)}MB, -${reduction}%)`);

    return { originalSize, newSize, reduction };
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeDirectory(dirPath, config, pattern = /\.(jpg|jpeg|png)$/i) {
  const files = fs.readdirSync(dirPath);
  const results = [];
  
  for (const file of files) {
    if (pattern.test(file)) {
      const inputPath = path.join(dirPath, file);
      const outputPath = path.join(dirPath, file);
      
      const result = await optimizeImage(inputPath, outputPath, config);
      if (result) {
        results.push(result);
      }
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  const totalResults = [];
  
  // 메인 이미지 최적화
  console.log('📸 Optimizing main images...');
  const mainImages = ['image_main_v3.jpg'];
  for (const image of mainImages) {
    const inputPath = path.join('public/images', image);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, inputPath, OPTIMIZATION_CONFIG.main);
      if (result) totalResults.push(result);
    }
  }
  
  // 갤러리 이미지 최적화
  console.log('\n🖼️  Optimizing gallery images...');
  const galleryResults = await optimizeDirectory('public/images/gallery', OPTIMIZATION_CONFIG.gallery);
  totalResults.push(...galleryResults);
  
  // 지도 이미지 최적화
  console.log('\n🗺️  Optimizing map images...');
  const mapResults = await optimizeDirectory('public/images/map', OPTIMIZATION_CONFIG.map);
  totalResults.push(...mapResults);
  
  // 결과 요약
  console.log('\n📊 Optimization Summary:');
  const totalOriginal = totalResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = totalResults.reduce((sum, r) => sum + r.newSize, 0);
  const totalReduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  
  console.log(`📁 Total files processed: ${totalResults.length}`);
  console.log(`📉 Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📈 Optimized size: ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  console.log(`🎯 Total reduction: ${totalReduction}%`);
  console.log(`💾 Space saved: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)}MB`);
  
  console.log('\n✅ Image optimization completed!');
}

main().catch(console.error);
