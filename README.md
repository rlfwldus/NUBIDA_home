# NUBIDA - 여행 소셜 플랫폼

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/cookiey0009-2099s-projects/v0-instagram-feed-page)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UZJFCPk1l9z)

## 프로젝트 소개

NUBIDA는 여행을 계획하고 공유하는 소셜 플랫폼입니다. 인스타그램 스타일의 피드와 AI 챗봇을 통한 여행지 검색, 여행지 일자리 정보 등을 제공합니다.

## 로컬 개발 환경 설정

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## 문제 해결

### 개발 서버가 시작되지 않는 경우

1. 캐시 및 node_modules 삭제 후 재설치:
\`\`\`bash
rm -rf node_modules .next
npm install
npm run dev
\`\`\`

2. 포트 3000이 이미 사용 중인 경우:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

3. Node.js 버전 확인 (18.17 이상 필요):
\`\`\`bash
node --version
\`\`\`

## 주요 기능

- 홈: 여행 피드 및 해시태그
- 검색: AI 챗봇을 통한 여행지/숙소 검색
- 여행 만들기: 새로운 여행 게시물 작성
- 일자리: 여행지별 일자리 정보
- 더보기: 프로필, 설정, 내 여행, 저장된 게시물

## 기술 스택

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React (아이콘)
- Radix UI (컴포넌트)

## Deployment

Your project is live at:

**[https://vercel.com/cookiey0009-2099s-projects/v0-instagram-feed-page](https://vercel.com/cookiey0009-2099s-projects/v0-instagram-feed-page)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/UZJFCPk1l9z](https://v0.app/chat/projects/UZJFCPk1l9z)**
