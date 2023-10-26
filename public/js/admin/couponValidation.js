const form= document.getElementById('couponform');
const code=document.getElementById('code');
const discount= document.getElementById('discount')
const minValue= document.getElementById('minValue')
const description=document.getElementById('description')


form.addEventListener('submit',e =>{
    e.preventDefault();
    validateInputs();
});

const setError= (element,message)=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

    errorDisplay.innerText=message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');

    setTimeout(() => {
      errorDisplay.innerText = '';
      inputControl.classList.remove('error');
  }, 3000);
}

const setSuccess= element=>{
    const inputControl=element.parentElement;
    const errorDisplay=inputControl.querySelector('.error');

    errorDisplay.innerText='';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

const validateInputs = () => {
    const codeValue = code.value.trim();
    const discountValue = discount.value.trim();
    const minValueValue = minValue.value.trim();
    const descriptionValue = description.value.trim();
  
    let flag = true; 
  
    if (codeValue === '') {
      setError(code, 'Name is required');
      flag = false;
    }else if(!codeValue.trim()){
      setError(code,'Name is required')
      flag=false
    }else if(codeValue.startsWith(' ')){
      setError(code,'Name is required')
      flag=false
    } else {
      setSuccess(code);
    }
  
    if (discountValue === '') {
      setError(discount, 'discount is required');
      flag = false;
    }else if(discountValue < 0){
      setError(discount,'discount value cannot less than 0 ')
      flag=false
    } else {
      setSuccess(discount);
    }
  
    if (minValueValue === '') {
      setError(minValue, 'Minimum Value is required');
      flag = false;
    }else if(minValueValue < 1 ){
      setError(minValue,'minimum Value must be positive')
      flag=false

    } else {
      setSuccess(minValue);
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
  
    if (flag) {
      form.submit();
    }
  };
  