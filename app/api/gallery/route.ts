import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { weddingConfig } from '../../../src/config/wedding-config';

export async function GET() {
  try {
    // 갤러리 폴더 경로
    const galleryDir = path.join(process.cwd(), 'public/images/gallery');
    
    // 폴더 내 파일 목록 읽기
    const files = fs.readdirSync(galleryDir);
    
    // 이미지 파일 필터링
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    
    // config 파일에 설정된 순서로 이미지 정렬
    const configImages = weddingConfig.gallery.images;
    const orderedImages: string[] = [];

    // 파일명 대소문자 이슈 대응을 위해 매핑 생성 (ex: image_10.jpg vs image_10.JPG)
    const lowerToOriginal = new Map<string, string>(
      imageFiles.map((f: string) => [f.toLowerCase(), f])
    );

    // config에 설정된 순서대로, 실제 존재하는 파일만 추가 (대소문자 무시)
    for (const configImagePath of configImages) {
      const filename = path.basename(configImagePath);
      const match = lowerToOriginal.get(filename.toLowerCase());
      if (match) {
        // 실제 존재하는 원본 파일명으로 URL 구성
        orderedImages.push(`/images/gallery/${match}`);
      }
    }
    // config에 명시된 이미지들만 사용 (폴더에 실제 존재하는 것만)
    const finalImages = orderedImages;

    return NextResponse.json({ images: finalImages });
  } catch (error) {
    console.error('갤러리 이미지 로드 오류:', error);
    return NextResponse.json(
      { 
        error: '갤러리 이미지를 불러오는 중 오류가 발생했습니다.',
        images: weddingConfig.gallery.images // 에러 시 config 설정 반환
      }, 
      { status: 500 }
    );
  }
} 