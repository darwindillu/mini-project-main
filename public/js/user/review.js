const form = document.getElementById('form');
const review = document.querySelector('textarea[name="review"]');

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
    const reviewValue = review.value.trim();

    if (!rating) {
        setError({ name: 'rating' }, 'Please select a rating');
        flag = false;
    } else {
        setSuccess({ name: 'rating' });
    }

    if (reviewValue.split(' ').length < 5) {
        setError({ name: 'review' }, 'Review must contain at least 5 words');
        flag = false;
    } else {
        setSuccess({ name: 'review' });
    }

    if (flag) {
        form.submit();
    }
};
