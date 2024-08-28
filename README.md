# NomadZoom [24.08.28]

## 0. SetUp
### 0-1. 

## 1. WebSocket
### 1-1. Info
- WebSocket은 ws 프로토콜을 기반으로 클라이언트와 서버 사이에 지속적인 완전 양방향 연결 스트림을 만들어 주는 기술.

## 2. SocketIO
### 2-1. Info
- SocketIO는 실시간, 양방향, event 기반 통신을 하는 프레임워크.
- WebSocket도 사용하지만 WS를 지원하지 않으면 그 외에 다른 방법도 사용함.
- 방화벽, proxy가 있어도 작동, 인터넷이 끊겨도 재연결.
- WebSocket보다 무거움. `/socket.io/socket.io.js`를 사용자의 브라우저에 보내고 설치함. 서버에도 설치해야 됨.

- 메시지 안 보내도 됨. 그냥 emit("아무거나").
- 프론트에서 오브젝트 바로 보낼 수 있음.
- 프론트에서 콜백 함수를 서버로 보낼 수 있음.

## 3. Video Call(WebRTC)
### 3-1. 
