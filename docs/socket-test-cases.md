## ✅ connectionHandler
- [x] auction:check-nickname - 닉네임 중복 및 팀장 여부 확인
- [x] auction:join
  - [x] 관리자 진입 성공
  - [x] 등록된 팀장 진입 성공
  - [x] 등록되지 않은 닉네임 거절
  - [x] 중복 닉네임 거절
  - [x] 대소문자 구분 없이 닉네임 허용
  - [x] 빈 닉네임 거절
  - [x] 일반 유저(팀장 아님) 거절
  - [x] 관리자 닉네임 무관하게 진입 허용
- [x] auction:leave - nicknameMap에서 닉네임 제거
- [x] disconnect - 연결 해제 시 nicknameMap에서 닉네임 제거

---

## 🔄 registerAuctionHandlers

### handleInitAuction
- [ ] auction:init - 경매 초기화 요청 시 상태 초기화 (유저 목록, 포인트, 타이머 등)

### handleNextUser
- [ ] auction:next-user - 랜덤 유저 요청 이벤트 정상 작동
- [ ] auction:show-user - 유저 공개 브로드캐스트 정상 작동 여부

### handleStartBid
- [ ] auction:start-bid - 경매 시작 시 타이머 설정 및 시작 여부

### handleInputBid
- [ ] auction:input-bid - 숫자 입력 시 타이머 초기화 여부
- [ ] auction:input-bid - 제한 시간 내에만 반영되는지
- [ ] auction:input-bid - 제한 시간 이후 입력 무시되는지

### handleFinalizeAuction
- [ ] auction:finalize - 최고 입찰자 기준 낙찰 처리
- [ ] auction:finalize - 입찰자 없을 경우 유찰 처리
