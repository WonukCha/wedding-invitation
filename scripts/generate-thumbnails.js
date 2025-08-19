const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 썸네일 생성 설정
const THUMBNAIL_CONFIG = {
  // 갤러리 썸네일 (작은 크기, 빠른 로딩)
  gallery: {
    width: 400,
    height: 400,
    quality: 70,
    progressive: true,
    suffix: '_thumb'
  },
  // 확대 이미지 (원본 크기 유지, 높은 품질)
  fullsize: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 90,
    progressive: true,
    suffix: '_full'
  }
};

async function generateThumbnail(inputPath, outputDir, config, suffix) {
  try {
    // 이미 존재하는 파일인지 확인
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const ext = path.extname(inputPath);
    const outputPath = path.join(outputDir, `${fileName}${suffix}${ext}`);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${fileName}${suffix}${ext} (already exists)`);
      return null;
    }

    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    console.log(`🔄 Processing: ${path.basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

    // 원본 이미지 정보 가져오기
    const metadata = await sharp(inputPath).metadata();
    console.log(`   📐 Original: ${metadata.width}x${metadata.height}`);

    let sharpInstance = sharp(inputPath);

    // 회전 정보가 있다면 적용
    if (metadata.orientation && metadata.orientation !== 1) {
      sharpInstance = sharpInstance.rotate();
    }
    
    // 썸네일 생성 (정사각형으로 크롭)
    if (suffix === '_thumb') {
      await sharpInstance
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: config.quality,
          progressive: config.progressive,
          mozjpeg: true,
          withMetadata: false
        })
        .toFile(outputPath);
    } 
    // 풀사이즈 이미지 생성 (비율 유지하면서 최대 크기 제한)
    else if (suffix === '_full') {
      await sharpInstance
        .resize(config.maxWidth, config.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: config.quality,
          progressive: config.progressive,
          mozjpeg: true,
          withMetadata: false
        })
        .toFile(outputPath);
    }
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    // 새 이미지 정보 확인
    const newMetadata = await sharp(outputPath).metadata();
    console.log(`   ✅ ${suffix === '_thumb' ? 'Thumbnail' : 'Fullsize'}: ${newMetadata.width}x${newMetadata.height} (${(newSize / 1024 / 1024).toFixed(2)}MB, -${reduction}%)`);
    
    return { originalSize, newSize, reduction, outputPath };
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function processGalleryImages() {
  const galleryDir = 'public/images/gallery';
  const files = fs.readdirSync(galleryDir);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  console.log(`📁 Found ${imageFiles.length} images in gallery`);
  
  const results = {
    thumbnails: [],
    fullsize: []
  };
  
  for (const file of imageFiles) {
    // 이미 썸네일이나 풀사이즈 이미지인 경우 스킵
    if (file.includes('_thumb') || file.includes('_full')) {
      continue;
    }
    
    const inputPath = path.join(galleryDir, file);
    
    // 썸네일 생성
    console.log(`\n🖼️  Creating thumbnail for ${file}...`);
    const thumbResult = await generateThumbnail(
      inputPath, 
      galleryDir, 
      THUMBNAIL_CONFIG.gallery, 
      '_thumb'
    );
    if (thumbResult) results.thumbnails.push(thumbResult);
    
    // 풀사이즈 이미지 생성
    console.log(`\n🖼️  Creating fullsize for ${file}...`);
    const fullResult = await generateThumbnail(
      inputPath, 
      galleryDir, 
      THUMBNAIL_CONFIG.fullsize, 
      '_full'
    );
    if (fullResult) results.fullsize.push(fullResult);
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting thumbnail generation...\n');
  console.log('📝 This will create thumbnail and fullsize versions of gallery images\n');
  
  const results = await processGalleryImages();
  
  // 결과 요약
  console.log('\n📊 Thumbnail Generation Summary:');
  console.log(`🖼️  Thumbnails created: ${results.thumbnails.length}`);
  console.log(`🖼️  Fullsize images created: ${results.fullsize.length}`);
  
  if (results.thumbnails.length > 0) {
    const totalThumbOriginal = results.thumbnails.reduce((sum, r) => sum + r.originalSize, 0);
    const totalThumbNew = results.thumbnails.reduce((sum, r) => sum + r.newSize, 0);
    const thumbReduction = ((totalThumbOriginal - totalThumbNew) / totalThumbOriginal * 100).toFixed(1);
    
    console.log(`📉 Thumbnail total reduction: ${thumbReduction}%`);
    console.log(`💾 Thumbnail space saved: ${((totalThumbOriginal - totalThumbNew) / 1024 / 1024).toFixed(2)}MB`);
  }
  
  if (results.fullsize.length > 0) {
    const totalFullOriginal = results.fullsize.reduce((sum, r) => sum + r.originalSize, 0);
    const totalFullNew = results.fullsize.reduce((sum, r) => sum + r.newSize, 0);
    const fullReduction = ((totalFullOriginal - totalFullNew) / totalFullOriginal * 100).toFixed(1);
    
    console.log(`📉 Fullsize total reduction: ${fullReduction}%`);
    console.log(`💾 Fullsize space saved: ${((totalFullOriginal - totalFullNew) / 1024 / 1024).toFixed(2)}MB`);
  }
  
  console.log('\n✅ Thumbnail generation completed!');
  console.log('📝 Now you can update the gallery configuration to use thumbnails');
}

main().catch(console.error);
