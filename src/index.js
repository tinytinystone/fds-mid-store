import '@babel/polyfill' // 이 라인을 지우지 말아주세요!

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  loginForm: document.querySelector("#login-form").content,
  productList: document.querySelector("#product-list").content,
  productItem: document.querySelector("#product-item").content,
  // postForm: document.querySelector("#post-form").content,
  // postDetail: document.querySelector("#post-detail").content,
  // commentItem: document.querySelector("#comment-item").content
};

const rootEl = document.querySelector(".root");

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

// 메인 페이지
// 1. 템플릿 복사
// 2. 요소 선택

// member 영역
const signInEl = document.querySelector('.sign-in')

// category 영역
const entireItemEl = document.querySelector('.entire')

// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
signInEl.addEventListener('click', async e => {
  e.preventDefault()
  await drawLoginForm()
})

entireItemEl.addEventListener('click', async e => {
  e.preventDefault()
  await drawProductList()
})
// 6. 템플릿을 문서에 삽입

async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true)

  // 2. 요소 선택
  const formEl = frag.querySelector('.login-form')

  // 3. 필요한 데이터 불러오기 - 필요없음
  // 4. 내용 채우기 - 필요없음

  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener('submit', async e => {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value
    const res = await api.post('/users/login', {
      username,
      password
    })
    localStorage.setItem('token', res.data.token)
  })

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
}

async function drawProductList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productList, true);

  // 2. 요소 선택
  const numberEl = frag.querySelector(".num");
  const listEl = frag.querySelector(".product-list");

  // 3. 필요한 데이터 불러오기
  const { data: productList } = await api.get("/products");

  // 4. 내용 채우기
  numberEl.textContent = productList.length
  productList.forEach(productItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.productItem, true);

    // 2. 요소 선택
    const mainImgEl = frag.querySelector(".main-img");
    const titleEl = frag.querySelector(".title");
    const priceEl = frag.querySelector(".price");

    // 3. 필요한 데이터 불러오기 - 필요 없음
    // 4. 내용 채우기
    mainImgEl.setAttribute("src", productItem.mainImgUrl);
    titleEl.textContent = productItem.title;
    // priceEl.textContent = // 추후 수정

    // 5. 이벤트 리스너 등록하기

    // 6. 템플릿을 문서에 삽입
    listEl.appendChild(frag);
  });

  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

drawProductList()
