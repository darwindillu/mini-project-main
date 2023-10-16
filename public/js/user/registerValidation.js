const form= document.getElementById('form');
const username= document.getElementById('username');
const email=document.getElementById('email');
const mobile=document.getElementById('mobile');
const password=document.getElementById('password');

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

const isValidEmail=email=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const mobileValue = mobile.value.trim();
    const passwordValue = password.value.trim();

    let flag = true; // Start by assuming all fields are valid.

    if (usernameValue === '') {
        setError(username, 'Username is required');
        flag = false;
    }else if(/\d/.test(usernameValue)){
        setError(username,'Cannot contain numbers')
        flag=false
    } else if (usernameValue.startsWith(' ') || usernameValue.endsWith(' ')) {
        setError(username, 'Username cannot start or end with spaces');
        flag = false;
    } else {
        setSuccess(username);
    }

    if (emailValue === '') {
        setError(email, 'Email is required');
        flag = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Enter a valid email');
        flag = false;
    } else {
        setSuccess(email);
    }

    if (mobileValue === '') {
        setError(mobile, 'Mobile number is required');
        flag = false;
    } else if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        setError(mobile, 'Enter a valid 10-digit mobile number');
        flag = false;
    } else {
        setSuccess(mobile);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required');
        flag = false;
    } else if (passwordValue.includes(' ')) {
        setError(password, 'Password cannot contain spaces');
        flag = false;
    } else if (passwordValue.length < 6) {
        setError(password, 'Password must contain at least 6 characters');
        flag = false;
    } else {
        setSuccess(password);
    }

    if (flag) {
        form.submit();
    }
};
