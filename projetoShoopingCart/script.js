let totalPrice = 0;
const CLASS_TOTAL_PRICE = '.total-price';
const innerTotalPrice = document.querySelector(CLASS_TOTAL_PRICE);
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const autoSaveCart = () => {
  const SAVECLASS_TOTAL_PRICE = '.total-price';
  const saveValue = document.querySelector(SAVECLASS_TOTAL_PRICE); 
  const getCartItems = document.querySelector('.cart');
  localStorage.Value = saveValue.innerHTML;
  localStorage.cartItens = getCartItems.innerHTML;    
};

function priceUpdate(price) {
  totalPrice += Math.round(price * 100) / 100;
  innerTotalPrice.innerHTML = totalPrice;    
}

async function cartItemClickListener() {
  const allItensAtCart = document.querySelector('.cart');
  allItensAtCart.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {      
      let textoTeste = event.target.innerText;
      textoTeste = textoTeste.match(/\$[\d.]+/g);      
      textoTeste = textoTeste.join('');
      textoTeste = textoTeste.substring(1);
      textoTeste = parseFloat(textoTeste);      
      let removeValue = totalPrice - textoTeste;
      removeValue = Math.round(removeValue * 100) / 100;                    
      const item = event.target.parentNode;    
      item.removeChild(event.target);      
      innerTotalPrice.innerHTML = removeValue;
      totalPrice = removeValue;
      localStorage.Value = totalPrice;      
      autoSaveCart();      
    }  
  });    
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;  
  return li;
}

async function itemToCart(event) {
  const itemId = event.target.parentNode.firstChild.innerText;   
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const response = await fetch(endpoint);
  const singleItem = await response.json();
  const { id: sku, title: name, price: salePrice } = singleItem;
  const createItemAtCart = createCartItemElement({ sku, name, salePrice });
  createItemAtCart.style.padding = '8px';
  const cartItemOl = document.querySelector('.cart__items');    
  cartItemOl.appendChild(createItemAtCart);
  priceUpdate(singleItem.price);
  autoSaveCart();  
}

async function getItensResults(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;  
  const response = await fetch(endpoint);
  const object = await response.json();
  const { results } = object;
  const intemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image }); 
    element.addEventListener('click', itemToCart);   
    intemsElement.appendChild(element);
  });
  } 
  
  const loadSavedCart = () => {
    if (localStorage.cartItens !== undefined) {
      const savedItens = localStorage.cartItens;
      const savedValues = localStorage.Value;
      document.querySelector(CLASS_TOTAL_PRICE).innerHTML = savedValues;
      document.querySelector('.cart').innerHTML = savedItens;      
    }
    };    

window.onload = function onload() {  
  innerTotalPrice.innerHTML = totalPrice;
  getItensResults('computador');
  loadSavedCart();
  cartItemClickListener(); 
};