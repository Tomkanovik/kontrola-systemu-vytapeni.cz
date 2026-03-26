const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const button = item.querySelector('button');
    const content = item.querySelector('.faq-content') as HTMLElement;
    const icon = item.querySelector('.material-symbols-outlined');

    button?.addEventListener('click', () => {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Close all other items (optional, but often desired for accordions)
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherContent = otherItem.querySelector('.faq-content') as HTMLElement;
                const otherIcon = otherItem.querySelector('.material-symbols-outlined');
                otherContent.style.maxHeight = '0px';
                otherContent.style.opacity = '0';
                otherIcon?.classList.remove('rotate-180');
            }
        });

        if (isOpen) {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            icon?.classList.remove('rotate-180');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon?.classList.add('rotate-180');
        }
    });
});
