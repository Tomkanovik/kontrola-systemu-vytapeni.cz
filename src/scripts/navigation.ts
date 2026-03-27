const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');

        const icon = menuToggle.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
        }
    });

    // Close menu when clicking a link
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            const icon = menuToggle.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'menu';
        });
    });
}
