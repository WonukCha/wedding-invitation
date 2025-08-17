const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 품질만 최적화하는 설정 (크기/방향 유지)
const QUALITY_CONFIG = {
  // 메인 이미지 (배경용) - 높은 품질 유지
  main: {
    quality: 85,
    progressive: true,
    preserveAspectRatio: true
  },
  // 갤러리 이미지 - 적당한 품질
  gallery: {
    quality: 75,
    progressive: true,
    preserveAspectRatio: true
  },
  // 지도 이미지 - 높은 품질 유지
  map: {
    quality: 85,
    progressive: true,
    preserveAspectRatio: true
  }
};

async function optimizeImageQualityOnly(inputPath, outputPath, config) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    console.log(`🔄 Processing: ${path.basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

    // 원본 이미지 정보 가져오기
    const metadata = await sharp(inputPath).metadata();
    console.log(`   📐 Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);

    // 메타데이터 정보 표시
    const hasExif = metadata.exif ? 'EXIF 있음' : 'EXIF 없음';
    const hasOrientation = metadata.orientation && metadata.orientation !== 1 ? `회전정보: ${metadata.orientation}` : '회전정보 없음';
    console.log(`   🗂️  Metadata: ${hasExif}, ${hasOrientation}`);
    
    // 임시 파일 경로 생성
    const tempPath = outputPath + '.tmp';
    
    // 원본 크기와 방향 유지하면서 품질만 최적화 + 메타데이터 완전 제거
    let sharpInstance = sharp(inputPath);

    // 회전 정보가 있다면 적용 (메타데이터는 제거하되 실제 이미지는 올바른 방향으로)
    if (metadata.orientation && metadata.orientation !== 1) {
      sharpInstance = sharpInstance.rotate();
    }

    // 포맷에 따라 최적화 (모든 메타데이터 제거)
    if (metadata.format === 'jpeg' || metadata.format === 'jpg' || path.extname(inputPath).toLowerCase().includes('jpg')) {
      await sharpInstance
        .jpeg({
          quality: config.quality,
          progressive: config.progressive,
          mozjpeg: true,
          // 메타데이터 완전 제거
          withMetadata: false
        })
        .toFile(tempPath);
    } else if (metadata.format === 'png') {
      await sharpInstance
        .png({
          quality: config.quality,
          progressive: config.progressive,
          compressionLevel: 9,
          // 메타데이터 완전 제거
          withMetadata: false
        })
        .toFile(tempPath);
    } else {
      // 기타 포맷은 JPEG로 변환 (메타데이터 제거)
      await sharpInstance
        .jpeg({
          quality: config.quality,
          progressive: config.progressive,
          mozjpeg: true,
          // 메타데이터 완전 제거
          withMetadata: false
        })
        .toFile(tempPath);
    }
    
    // 최적화된 이미지 정보 확인
    const newMetadata = await sharp(tempPath).metadata();
    console.log(`   📐 Optimized: ${newMetadata.width}x${newMetadata.height}, ${newMetadata.format}`);
    console.log(`   🗑️  Metadata: 모든 EXIF/메타데이터 제거됨`);
    
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
      
      const result = await optimizeImageQualityOnly(inputPath, outputPath, config);
      if (result) {
        results.push(result);
      }
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting quality-only image optimization...\n');
  console.log('📝 This will preserve original dimensions and orientation');
  console.log('🗑️  All EXIF metadata will be completely removed\n');
  
  const totalResults = [];
  
  // 메인 이미지 최적화
  console.log('📸 Optimizing main images...');
  const mainImages = ['image_main_v3.jpg'];
  for (const image of mainImages) {
    const inputPath = path.join('public/images', image);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImageQualityOnly(inputPath, inputPath, QUALITY_CONFIG.main);
      if (result) totalResults.push(result);
    }
  }
  
  // 갤러리 이미지 최적화
  console.log('\n🖼️  Optimizing gallery images...');
  const galleryResults = await optimizeDirectory('public/images/gallery', QUALITY_CONFIG.gallery);
  totalResults.push(...galleryResults);
  
  // 지도 이미지 최적화
  console.log('\n🗺️  Optimizing map images...');
  const mapResults = await optimizeDirectory('public/images/map', QUALITY_CONFIG.map);
  totalResults.push(...mapResults);
  
  // 결과 요약
  console.log('\n📊 Quality Optimization Summary:');
  const totalOriginal = totalResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = totalResults.reduce((sum, r) => sum + r.newSize, 0);
  const totalReduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  
  console.log(`📁 Total files processed: ${totalResults.length}`);
  console.log(`📉 Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📈 Optimized size: ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  console.log(`🎯 Total reduction: ${totalReduction}%`);
  console.log(`💾 Space saved: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)}MB`);
  
  console.log('\n✅ Quality-only optimization completed!');
  console.log('📐 All images maintain their original dimensions and orientation');
  console.log('🗑️  All EXIF metadata has been completely removed');
}

main().catch(console.error);
