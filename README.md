# FDS 중간 프로젝트: 쇼핑몰 프로젝트

## 작업 예상 일정

- 11/7(수) 11시 대략적인 기획 완성
- 11/7(수) 13시 프로젝트 세팅
- 11/7(수) 18시
    - 상품 및 옵션 데이터 작성
    - 로그인 기능 구현
    - 카테고리별 상품 목록 구현
    - 테스트
- 11/8(목) 13시
    - 제품 상세 페이지 구현
    - 장바구니 기능 구현
    - 주문 기능 구현
    - 테스트
- 11/8(목) 18시
    - 관리자 기능 구현
    - 페이지네이션 구현
    - 전체적인 레이아웃 CSS
    - 테스트
- 11/9(금) 13시
    - 회원가입 기능 구현
    - 세부 CSS 작업
- 11/9(금) 18시
    - 추가 CSS 작업
    - 최종 제출 및 회고

## 페이지 구조

(별도 이미지 업로드 예정)

## 목표

1. 이슈 없이 잘 돌아가는 쇼핑몰 페이지를 만들자.
2. 모바일에서 최적화된 CSS를 만들어 보자.
3. 기능별로 세부 작업 일정을 잘 짜서, 작업 시간과 작업량을 조금 더 정확하게 추정해 보자.

## 템플릿 설명

빌드 도구로 [Parcel](https://parceljs.org/)을 사용하고 있으며, [create-react-app](https://github.com/facebook/create-react-app)에서 사용하는 [Babel](http://babeljs.io/) 프리셋인 [babel-preset-react-app](https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app)을 통해 여러 최신 문법을 사용할 수 있도록 설정되어 있습니다.

개발을 시작하기 전, [개발 가이드](./guide.md)를 읽어보세요.

### npm 명령

- `npm install` - 프로젝트 실행에 필요한 파일을 설치하는 명령. 프로젝틑 최초 실행 시 반드시 실행해주어야 합니다.
- `npm start` - 개발용 서버를 실행시키는 명령
- `npm run build` - Netlify 등의 호스팅 서비스에서 사용할 수 있는 HTML, CSS, JS 파일을 생성해주는 명령. `dist` 폴더에 파일이 생성됩니다.
