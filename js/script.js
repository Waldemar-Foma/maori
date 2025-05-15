document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.story-section');
    const qrSection = document.querySelector('.qr-section');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressSteps = document.querySelectorAll('.progress-step');
    const images = document.querySelectorAll('.image-placeholder');
    let isMobile = window.innerWidth <= 900;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.id === 'section5') {
                    setTimeout(() => {
                        qrSection.classList.add('active');
                    }, 500);
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentSection = btn.closest('.story-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    function updateProgress() {
        const scrollPosition = window.scrollY + 100;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.min(100, (scrollPosition / docHeight) * 100);
        
        progressBarFill.style.width = `${scrollPercentage}%`;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                progressSteps.forEach(step => {
                    step.classList.toggle('active', 
                        parseInt(step.getAttribute('data-step')) === index + 1);
                });

                document.body.className = '';
                switch(index) {
                    case 0: document.body.classList.add('ocean-theme'); break;
                    case 1: document.body.classList.add('green-theme'); break;
                    case 2: document.body.classList.add('sunset-theme'); break;
                    case 3: case 4: document.body.classList.add('dark-theme'); break;
                }
            }
        });
    }

    function handleMouseMove(e) {
        if (isMobile) return;
        
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
        
        images.forEach(img => {
            if (isElementInViewport(img)) {
                img.style.transform = `
                    scale(1.02) 
                    rotateY(${mouseX}deg) 
                    rotateX(${-mouseY}deg)
                `;
            }
        });
    }

    function handleDeviceOrientation(e) {
        if (!isMobile) return;
        
        const beta = e.beta;
        const gamma = e.gamma;
        
        const tiltX = gamma ? Math.max(-20, Math.min(20, gamma * 0.7)) : 0;
        const tiltY = beta ? Math.max(-15, Math.min(15, (beta - 90) * 0.5)) : 0;
        
        images.forEach(img => {
            if (isElementInViewport(img)) {
                img.style.transform = `
                    scale(1.02)
                    rotateX(${tiltY}deg)
                    rotateY(${tiltX}deg)
                `;
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.5 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    progressSteps.forEach(step => {
        step.addEventListener('click', () => {
            const targetSection = document.querySelector(
                `#section${step.getAttribute('data-step')}`);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();

    if (isMobile) {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
            console.log('DeviceOrientation API не поддерживается');
        }
    } else {
        document.addEventListener('mousemove', handleMouseMove);
    }

    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 900;
        if (isMobile !== newIsMobile) {
            isMobile = newIsMobile;
            
            if (isMobile) {
                document.removeEventListener('mousemove', handleMouseMove);
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', handleDeviceOrientation);
                }
            } else {
                if (window.DeviceOrientationEvent) {
                    window.removeEventListener('deviceorientation', handleDeviceOrientation);
                }
                document.addEventListener('mousemove', handleMouseMove);
            }
            
            images.forEach(img => {
                img.style.transform = 'scale(1)';
            });
        }
    });
});
