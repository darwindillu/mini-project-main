const form= document.getElementById('addressform')
const address=document.getElementById('address')
const city=document.getElementById('city')
const district=document.getElementById('district')
const pincode=document.getElementById('pincode')
const mobile= document.getElementById('mobile')


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
    const addressValue = address.value.trim();
    const cityValue = city.value.trim();
    const districtValue = district.value.trim();
    const pincodeValue= pincode.value.trim()
    const mobileValue= mobile.value.trim()

    let flag = true;

    if(addressValue==''){
        setError(address,('Cannot be empty'))
        flag=false
    }else if(!addressValue.trim()){
        setError(address,'Cannot be empty')
        flag=false
    }else{
        setSuccess(address)
    }

    if(cityValue==''){
        setError(city,'Cannot be empty')
        flag=false
    }else if (!cityValue.trim()){
        setError(city,'Cannot be Empty')
        flag=false
    }else{
        setSuccess(city)
    }

    if(districtValue==''){
        setError(district,'Cannot be empty')
        flag=false
    }else if(!districtValue.trim()){
        setError(district,'Cannot be empty')
        flag=false
    }else{
        setSuccess(district)
    }

    if(pincodeValue==''){
        setError(pincode,'Cannot be empty')
        flag=false
    }else if(pincodeValue <6){
        setError(pincode,'Should contain 6 digits')
        flag=false
    }else if (pincodeValue < 0){
        setError(pincode,'Cannot contain special character')
        flag=false
    }else{
        setSuccess(pincode)
    }

    if(mobileValue==''){
        setError(mobile,'Cannot be empty')
        flag=false
    }else if(mobileValue.length <10){
        setError(mobile,'Should contain 10 digits')
        flag=false

    }else if(mobileValue < 10){
        setError(mobile,'Cannot contain Special charecters')
        flag=false
    }else{
        setSuccess(mobile)
    }

    if(flag){
        form.submit()
    }
}