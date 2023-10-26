const form= document.getElementById('productform');
const proname=document.getElementById('productname');
const stock= document.getElementById('stockid')
const price= document.getElementById('price')
const discount= document.getElementById('discount')
const images=document.getElementById('images')
const description=document.getElementById('description')
const category=document.getElementById('category');



if (form && proname && stock && price && discount && images && description && category) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
  });
} else {
  console.error('One or more form elements are null or do not exist.');
}

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  if (errorDisplay) {
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');

    setTimeout(() => {
      errorDisplay.innerText = '';
      inputControl.classList.remove('error');
    }, 3000);
  } else {
    console.error('Error display element is null or does not exist.');
  }
}

const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  if (errorDisplay) {
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
  } else {
    console.error('Error display element is null or does not exist.');
  }
}

const validateInputs = () => {
    const pronameValue = proname.value.trim();
    const stockValue = stock.value.trim();
    const priceValue = price.value.trim();
    const discountValue= discount.value.trim()
    const categoryValue = category.value.trim();
    const descriptionValue = description.value.trim();
    const imageValue = images.value.trim().toLowerCase(); 
  
    let flag = true; // Start with flag as true
  
    if (pronameValue === '') {
      setError(proname, 'Name is required');
      flag = false;
    }else if(!pronameValue.trim()){
      setError(proname,'Name is required')
      flag=false
    }else if(pronameValue.startsWith(' ')){
      setError(proname,'Name is required')
      flag=false
    } else {
      setSuccess(proname);
    }
  
    if (stockValue === '') {
      setError(stock, 'Stock is required');
      flag = false;
    }else if(stockValue < 1){
      setError(stock,'stock value not be 0 or negative ')
      flag=false
    } else {
      setSuccess(stock);
    }
  
    if (priceValue === '') {
      setError(price, 'Price is required');
      flag = false;
    }else if(priceValue < 1 ){
      setError(price,'price must be positive')
      flag=false

    } else {
      setSuccess(price);
    }

    if (discountValue === '') {
      setError(discount, 'Discount is required / assign zero');
      flag = false;
    } else {
      const discountValueNumber = parseFloat(discountValue);
      if (isNaN(discountValueNumber) || discountValueNumber < 0) {
        setError(discount, 'Discount must be a non-negative number');
        flag = false;
      } else {
        setSuccess(discount);
      }
    }
  
    if (imageValue === '') {
      setError(images, 'Image is required');
      flag = false;
    } else if (!imageValue.endsWith('.jpeg') && !imageValue.endsWith('.jpg')) {
      setError(images, 'Only .jpeg and .jpg file formats are allowed');
      flag = false;
    } else {
      setSuccess(images);
    }
  
    if (descriptionValue === '') {
      setError(description, 'Description is required');
      flag = false;
    }else if(!descriptionValue.trim()){
      setError(description,'Description is required')
      flag=false
    } else {
      setSuccess(description);
    }
  
    if (categoryValue === '') {
      setError(category, 'Category is required');
      flag = false;
    } else {
      setSuccess(category);
    }
  
    if (flag) {
      form.submit();
    }
  };
  