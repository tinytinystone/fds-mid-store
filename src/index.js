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
  // productForm: document.querySelector("#product-form").content,
  productDetail: document.querySelector("#product-detail").content,
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
const flowerEl = document.querySelector('.flower')
const plantEl = document.querySelector('.plant')
const cactusEl = document.querySelector('.cactus')
const hangingEl = document.querySelector('.hanging')
const orchidEl = document.querySelector('.orchid')
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
flowerEl.addEventListener("click", async e => {
  e.preventDefault();
  await drawProductList('flower');
});
plantEl.addEventListener("click", async e => {
  e.preventDefault();
  await drawProductList('plant');
});
cactusEl.addEventListener("click", async e => {
  e.preventDefault();
  await drawProductList('cactus');
});
hangingEl.addEventListener("click", async e => {
  e.preventDefault();
  await drawProductList('hanging');
});
orchidEl.addEventListener("click", async e => {
  e.preventDefault();
  await drawProductList('orchid');
});
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

async function drawProductList(category = undefined) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productList, true);

  // 2. 요소 선택
  const numberEl = frag.querySelector(".num");
  const listEl = frag.querySelector(".product-list");

  // 3. 필요한 데이터 불러오기
  const { data: prevProductList } = await api.get("/products", {
    params: {
      _embed: "options"
    }
  })
  const productList = prevProductList.filter(item => item.category === category || category === undefined);

  // 4. 내용 채우기
    numberEl.textContent = productList.length
  productList.forEach(productItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.productItem, true);

    // 2. 요소 선택
    const productItemEl = frag.querySelector('.product-item')
    const mainImgEl = frag.querySelector(".main-img");
    const titleEl = frag.querySelector(".title");
    const priceEl = frag.querySelector(".price");

    // 3. 필요한 데이터 불러오기 - 필요 없음
    // 4. 내용 채우기
    mainImgEl.setAttribute("src", productItem.mainImgUrl);
    titleEl.textContent = productItem.title;
    priceEl.textContent = productItem.options[0].price

    // 5. 이벤트 리스너 등록하기
    productItemEl.addEventListener('click', async e => {
      const id = productItem.id
      drawProductDetail(id)
    })
    // 6. 템플릿을 문서에 삽입
    listEl.appendChild(frag);
  });

  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}

async function drawProductDetail(productId) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productDetail, true)

  // 2. 요소 선택
  const titleEl = frag.querySelector('.title')
  const categoryEl = frag.querySelector('.category')
  const descEl = frag.querySelector('.description')
  const priceEl = frag.querySelector('.price')
  const mainImgEl = frag.querySelector('.main-img')
  const detailImgEl = frag.querySelector('.detail-img')
  // 2-2. 버튼 관련
  const backEl = frag.querySelector(".back")
  const addToCartEl = frag.querySelector('.add-to-cart')
  const buyItNowEl = frag.querySelector('.buy-it-now')
  // 3. 필요한 데이터 불러오기
  const {
    data: { id, category, title, description, mainImgUrl, detailImgUrls, options } } = await api.get("/products/" + productId, {
    params: {
      _embed: "options"
    }
  })
  // 4. 내용 채우기
  titleEl.textContent = title
  categoryEl.textContent = category
  descEl.textContent = description
  priceEl.textContent = options[0].price
  mainImgEl.setAttribute("src", mainImgUrl)
  detailImgEl.setAttribute("src", detailImgUrls[0])
  // 5. 이벤트 리스너 등록하기
  backEl.addEventListener('click', e => {
    e.preventDefault() // 새 글이 써지는 것을 방지하기 위함 - 폼의 submit 이벤트가 일어나지 않게 함
    drawProductList();
  })
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
}

drawProductList()
