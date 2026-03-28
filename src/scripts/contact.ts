const form = document.getElementById('contact-form') as HTMLFormElement;
const successMessage = document.getElementById('success-message');
const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
const buttonText = document.getElementById('button-text');
const buttonLoader = document.getElementById('button-loader');
const formError = document.getElementById('form-error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset states
        formError?.classList.add('hidden');
        if (submitButton) submitButton.disabled = true;
        buttonText?.classList.add('hidden');
        buttonLoader?.classList.remove('hidden');

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                form.reset();
                form.classList.add('hidden');
                successMessage?.classList.remove('hidden');
                // Scroll to the message
                successMessage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                if (formError) {
                    formError.textContent = result.message || 'Při odesílání došlo k chybě. Zkuste to prosím znovu.';
                    formError.classList.remove('hidden');
                }
            }
        } catch (error) {
            if (formError) {
                formError.textContent = 'Omlouváme se, spojení se serverem selhalo. Zkuste to prosím později.';
                formError.classList.remove('hidden');
            }
        } finally {
            if (submitButton) submitButton.disabled = false;
            buttonText?.classList.remove('hidden');
            buttonLoader?.classList.add('hidden');
        }
    });
}
