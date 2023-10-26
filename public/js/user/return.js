const form = document.getElementById('form');
const return1 = document.querySelector('textarea[name="return"]');

form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
});

const setError = (element, message) => {
    const errorElement = document.getElementById(`error-${element.name}`);
    errorElement.innerText = message;

    setTimeout(() => {
        errorElement.innerText = '';
    }, 3000); 
};

const setSuccess = (element) => {
    const errorElement = document.getElementById(`error-${element.name}`);
    errorElement.innerText = '';
};

const validateInputs = () => {
    let flag = true;

    const rating = document.querySelector('input[name="rating"]:checked');
    const returnValue = return1.value.trim();

    

    if (returnValue.split(' ').length < 5) {
        setError({ name: 'return' }, 'Review must contain at least 5 words');
        flag = false;
    } else {
        setSuccess({ name: 'return' });
    }

    if (flag) {
        form.submit();
    }
};
