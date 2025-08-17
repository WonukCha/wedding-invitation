'use client';

import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { weddingConfig } from '../../config/wedding-config';

declare global {
  interface Window {
    naver: any;
  }
}

// 텍스트의 \n을 <br />로 변환하는 함수
const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

interface VenueSectionProps {
  bgColor?: 'white' | 'beige';
}

const VenueSection = ({ bgColor = 'white' }: VenueSectionProps) => {

  // 정적 지도 이미지 렌더링
  const renderStaticMap = () => {
    return (
      <StaticMapContainer>
        <StaticMapImage src="/wedding-invitation/images/map/map.png" alt="AW 컨벤션 안산 위치" />
      </StaticMapContainer>
    );
  };
  
  // 길찾기 링크 생성 함수들
  const navigateToNaver = () => {
    if (typeof window !== 'undefined') {
      const lat = weddingConfig.venue.coordinates.latitude;
      const lng = weddingConfig.venue.coordinates.longitude;
      const name = encodeURIComponent(weddingConfig.venue.name);

      // 1) 모바일: 네이버 지도 앱으로 바로 길찾기 (차량 기준)
      const appUrl = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${name}&appname=wedding_invitation`;

      // 2) 웹: 네이버 지도 길찾기 (도착지에 좌표와 이름 모두 지정)
      const webUrl = `https://map.naver.com/p/directions/-/${lng},${lat},${name}/-/car`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (isMobile) {
        // 앱 시도 후 실패 시 웹으로 폴백
        window.location.href = appUrl;
        setTimeout(() => {
          window.open(webUrl, '_blank');
        }, 800);
      } else {
        window.open(webUrl, '_blank');
      }
    }
  };
  
  const navigateToKakao = () => {
    if (typeof window !== 'undefined') {
      // 카카오맵 앱/웹으로 연결
      const lat = weddingConfig.venue.coordinates.latitude;
      const lng = weddingConfig.venue.coordinates.longitude;
      const name = encodeURIComponent(weddingConfig.venue.name);

      const kakaoMapsUrl = `https://map.kakao.com/link/to/${name},${lat},${lng}`;
      window.open(kakaoMapsUrl, '_blank');
    }
  };
  
  const navigateToTmap = () => {
    if (typeof window !== 'undefined') {
      // TMAP 앱으로 연결 (앱 딥링크만 사용)
      const lat = weddingConfig.venue.coordinates.latitude;
      const lng = weddingConfig.venue.coordinates.longitude;
      const name = encodeURIComponent(weddingConfig.venue.name);
      
      // 모바일 디바이스에서는 앱 실행 시도
      window.location.href = `tmap://route?goalname=${name}&goaly=${lat}&goalx=${lng}`;
      
      // 앱이 설치되어 있지 않을 경우를 대비해 약간의 지연 후 TMAP 웹사이트로 이동
      setTimeout(() => {
        // TMAP이 설치되어 있지 않으면 TMAP 웹사이트 메인으로 이동
        if(document.hidden) return; // 앱이 실행되었으면 아무것도 하지 않음
        window.location.href = 'https://tmap.co.kr';
      }, 1000);
    }
  };
  
  return (
    <VenueSectionContainer $bgColor={bgColor}>
      <SectionTitle>장소</SectionTitle>

      <VenueInfo>
        <VenueName>{weddingConfig.venue.name}</VenueName>
        <VenueAddress>{formatTextWithLineBreaks(weddingConfig.venue.address)}</VenueAddress>
        <VenueTel href={`tel:${weddingConfig.venue.tel}`}>{weddingConfig.venue.tel}</VenueTel>
      </VenueInfo>

      {renderStaticMap()}
      
      <NavigateButtonsContainer>
        <NavigateButton onClick={navigateToNaver} $mapType="naver">
          네이버 지도
        </NavigateButton>
        <NavigateButton onClick={navigateToKakao} $mapType="kakao">
          카카오맵
        </NavigateButton>
        <NavigateButton onClick={navigateToTmap} $mapType="tmap">
          TMAP
        </NavigateButton>
      </NavigateButtonsContainer>
      
      <TransportCard>
        <CardTitle>대중교통 안내</CardTitle>
        <TransportItem>
          <TransportLabel>지하철</TransportLabel>
          <TransportText>{weddingConfig.venue.transportation.subway}</TransportText>
        </TransportItem>
        <TransportItem>
          <TransportLabel>버스</TransportLabel>
          <TransportText>{weddingConfig.venue.transportation.bus}</TransportText>
        </TransportItem>
      </TransportCard>
      
      <ParkingCard>
        <CardTitle>주차 안내</CardTitle>
        <TransportText>{weddingConfig.venue.parking}</TransportText>
      </ParkingCard>
      
      {/* 배차 안내는 설정에서 제거됨 */}
    </VenueSectionContainer>
  );
};

const VenueSectionContainer = styled.section<{ $bgColor: 'white' | 'beige' }>`
  padding: 4rem 1.5rem;
  text-align: center;
  background-color: ${props => props.$bgColor === 'beige' ? '#F8F6F2' : 'white'};
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }
`;

const VenueInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const VenueName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const VenueAddress = styled.p`
  margin-bottom: 0.5rem;
`;

const VenueTel = styled.a`
  color: var(--secondary-color);
  text-decoration: none;
`;

const StaticMapContainer = styled.div`
  height: 24rem;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 28rem;
    max-width: 56rem;
  }
`;

const StaticMapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;



const NavigateButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
`;

const NavigateButton = styled.button<{ $mapType?: 'naver' | 'kakao' | 'tmap' }>`
  flex: 1;
  min-width: 6rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #c4a986;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:active:after {
    animation: ripple 0.6s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`;

const TransportCard = styled(Card)``;
const ParkingCard = styled(Card)``;

const CardTitle = styled.h4`
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const TransportItem = styled.div`
  margin-bottom: 1rem;
`;

const TransportLabel = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

const TransportText = styled.p`
  font-size: 0.875rem;
  color: var(--text-medium);
  white-space: pre-line;
`;

export default VenueSection;