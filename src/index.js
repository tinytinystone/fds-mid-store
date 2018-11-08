import '@babel/polyfill' // 이 라인을 지우지 말아주세요!

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  layout: document.querySelector('#layout').content,
  loginForm: document.querySelector("#login-form").content,
  productList: document.querySelector("#product-list").content,
  productItem: document.querySelector("#product-item").content,
  productDetail: document.querySelector("#product-detail").content,
  cartList: document.querySelector('#cart-list').content,
  cartItem: document.querySelector('#cart-item').content
};

const rootEl = document.querySelector(".root");

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

function drawFragment(frag) {
  // 1. 템플릿 복사
  const layoutFrag = document.importNode(templates.layout, true);
  // 2. 요소 선택
  const signInEl = layoutFrag.querySelector('.sign-in')
  const signOutEl = layoutFrag.querySelector('.sign-out')
  const myCartEl = layoutFrag.querySelector('.my-cart')
  const entireItemEl = layoutFrag.querySelector('.entire')
  const flowerEl = layoutFrag.querySelector('.flower')
  const plantEl = layoutFrag.querySelector('.plant')
  const cactusEl = layoutFrag.querySelector('.cactus')
  const hangingEl = layoutFrag.querySelector('.hanging')
  const orchidEl = layoutFrag.querySelector('.orchid')
  const mainEl = layoutFrag.querySelector(".main");
  // 3. 필요한 데이터 불러오기
  if(localStorage.token){
    signOutEl.classList.remove('hidden')
    signInEl.classList.add('hidden')
  }
  // 4. 내용 채우기
  // 5. 이벤트 리스너 등록하기
  signInEl.addEventListener('click', async e => {
    e.preventDefault()
    await drawLoginForm()
  })
  signOutEl.addEventListener('click', async e => {
    e.preventDefault()
    localStorage.removeItem("token");
    alert('로그아웃 되었습니다.')
    await drawProductList()
  })
  myCartEl.addEventListener('click', async e => {
    const userId = localStorage.token
    e.preventDefault()
    await drawCartList(userId)
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
  mainEl.appendChild(frag);

  rootEl.textContent = ''
  rootEl.appendChild(layoutFrag)
}

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
    drawProductList()
  })

  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}

async function drawProductList(categoryDetail = undefined) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productList, true);

  // 2. 요소 선택
  const numberEl = frag.querySelector(".num");
  const listEl = frag.querySelector(".product-list");

  // 3. 필요한 데이터 불러오기
  const { data: productList } = await api.get("/products", {
    params: {
      category: categoryDetail,
      _embed: "options"
    }
  })

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
  drawFragment(frag);
}

async function drawProductDetail(productId) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productDetail, true)
  // 2. 요소 선택
  const categoryRouteEl = frag.querySelector('.third')
  const titleRouteEl = frag.querySelector('.fourth')

  const formEl = frag.querySelector('.cart-form')
  const selectEl = frag.querySelector('.select-option')
  const quantityEl = frag.querySelector(".quantity-choose");
  const titleEl = frag.querySelector('.title')
  const descEl = frag.querySelector('.description')

  const priceEl = frag.querySelector('.price')
  let finalPrice = 0
  let optionPrice = 0

  const mainImgEl = frag.querySelector('.main-img')
  const detailImgEl = frag.querySelector('.detail-img')
  const addToCartEl = frag.querySelector('.add-to-cart')
  const buyItNowEl = frag.querySelector('.buy-it-now')
  // 3. 필요한 데이터 불러오기
  const {
    data: { id, category, title, description, mainImgUrl, detailImgUrls, options } } = await api.get("/products/" + productId, {
    params: {
      _embed: "options"
    }
  })
  function drawPrice() {
    if (finalPrice === 0 || isNaN(finalPrice)) {
      priceEl.textContent = "옵션과 수량을 확인해 주세요.";
    } else {
      priceEl.textContent = `${finalPrice} 원`;
    }
  }
  // 4. 내용 채우기
  categoryRouteEl.textContent = category
  titleRouteEl.textContent = title
  drawPrice()

  options.forEach(option => {
    const optionEl = document.createElement("option")
    optionEl.setAttribute('value', option.id)
    optionEl.textContent = option.title
    selectEl.appendChild(optionEl)
  })

  titleEl.textContent = title
  descEl.textContent = description
  mainImgEl.setAttribute("src", mainImgUrl)
  detailImgEl.setAttribute("src", detailImgUrls[0])
  // 5. 이벤트 리스너 등록하기
  selectEl.addEventListener('change', e => {
    const optionId = parseInt(e.target.value);
    const option = options.find(item => item.id === optionId)
    optionPrice = option.price
  })
  quantityEl.addEventListener('input', e => {
    const quantityId = e.target.value
    finalPrice = optionPrice * parseInt(quantityId)
    let result = drawPrice()
    if (result) {
      priceEl.textContent = "수량을 확인해 주세요."
    } else {
      result
    }
  })
  formEl.addEventListener('submit', async e => {
    e.preventDefault()
    const optionId = parseInt(e.target.elements.option.value)
    const quantity = parseInt(e.target.elements.quantity.value)
    if (!localStorage.token) {
      alert('로그인을 먼저 해주세요.')
    } else if (!quantity) {
      alert('옵션과 수량을 확인해 주세요.')
    } else {
      await api.post('/cartItems', {
        optionId,
        quantity
      })
      alert('장바구니에 담겼습니다.')
    }
  })
  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}

async function drawCartList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.cartList, true)
  // 2. 요소 선택
  const cartListEl = frag.querySelector('.cart-list')
  const cartTotalPriceEl = frag.querySelector('.cart-total-price')
  const cartOrderBtnEl = frag.querySelector('.cart-total')
  // 3. 필요한 데이터 불러오기
  const { data: cartList } = await api.get('/cartItems', {
    params: {
      _embed: 'options'
    }
  })
  const { data: optionList } = await api.get('/options/', {
    params: {
      _expand: 'product'
    }
  })
  // 4. 내용 채우기
  cartList.forEach(cartItem => {
    // 1. 템플릿 복사
    const frag = document.importNode(templates.cartItem, true)
    // 2. 요소 선택
    const mainImgEl = frag.querySelector('.cart-main-img')
    const titleEl = frag.querySelector('.title')
    const priceEl = frag.querySelector('.price-in-cart')
    const quantityEl = frag.querySelector('.quantity-in-cart')
    const cartDeleteBtnEl = frag.querySelector('.cart-delete')
    // 3. 필요한 데이터 불러오기
    quantityEl.textContent = cartItem.quantity
    const option = optionList.find(item => item.id === cartItem.optionId)
    priceEl.textContent = option.price
    mainImgEl.setAttribute("src", option.product.mainImgUrl)
    titleEl.textContent = option.product.title
    // 4. 내용 채우기
    // 5. 이벤트 리스너 등록하기
    cartDeleteBtnEl.addEventListener('click', async e => {
      e.preventDefault()
      await api.delete('/cartItems/' + cartItem.id)
      alert(`선택한 항목이 장바구니에서 삭제 되었습니다.`);
      drawCartList()
    })
    // 6. 템플릿을 문서에 삽입
    cartListEl.appendChild(frag)
  })
  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}

drawProductList()
