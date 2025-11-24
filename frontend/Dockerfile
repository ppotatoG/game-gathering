# 1. Base Image 선택: 경량 Node.js 런타임 환경 (Alpine 리눅스 기반)
#    - 용량이 작아 이미지 다운로드 및 빌드 속도가 빠릅니다.
FROM node:20-alpine

  # 2. 작업 디렉토리 설정: 컨테이너 내부에서 모든 작업이 일어날 기본 경로 지정
WORKDIR /usr/src/app

  # 3. 종속성 복사: package.json과 package-lock.json만 복사 (npm install 캐싱 최적화)
  #    - 이 파일들만 복사하여 npm install을 먼저 수행하면,
  #      코드 파일이 바뀌더라도 이 파일들이 바뀌지 않으면 npm install 단계를 건너뛰어 빌드 속도가 빨라집니다.
COPY package*.json ./

# --ignore-scripts 플래그 추가
RUN npm install --ignore-scripts

  # 5. 모든 코드 복사: 나머지 모든 애플리케이션 코드를 작업 디렉토리로 복사
  #    - docker-compose.yml의 volume 설정이 개발 중 실시간 코드를 동기화해 주지만,
  #      최초 이미지 빌드 시에는 코드가 있어야 합니다.
COPY . .

# 6. 포트 노출 (선택 사항): 실제 포트 설정은 docker-compose.yml에서 했으므로 생략 가능
# EXPOSE 3000 # 프론트엔드
# EXPOSE 8080 # 백엔드

# CMD 명령어는 docker-compose.yml에서 'command: npm run dev'로 이미 지정했으므로 여기에선 생략합니다.
