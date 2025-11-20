   document.addEventListener("DOMContentLoaded", () => {
            const reveals = document.querySelectorAll(".reveal");
            const educationEl = document.getElementById('educationSection');

            const isMobile = window.innerWidth < 768;
            const thresholdValue = isMobile ? 0.20 : 0.10;

            // flag to ignore tiny mobile viewport jiggles
            let ignoreRemovals = false;
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', () => { lastScrollY = window.scrollY; }, { passive: true });

            // helper to watch for browser bar popping in/out
            function setupViewportWatcher() {
                if (window.visualViewport) {
                    let lastH = window.visualViewport.height;
                    window.visualViewport.addEventListener("resize", () => {
                        const newH = window.visualViewport.height;
                        const diff = Math.abs(newH - lastH);
                        const scrollDiff = Math.abs(window.scrollY - lastScrollY);

                        // moderate height change + tiny scroll => browser chrome moved
                        if (diff > 0 && diff < 400 && scrollDiff < 8) {
                            ignoreRemovals = true;
                            setTimeout(() => (ignoreRemovals = false), 800);
                        }
                        // extra guard: at top and height shrank (URL bar appeared)
                        if (window.scrollY === 0 && newH < lastH) {
                            ignoreRemovals = true;
                            setTimeout(() => (ignoreRemovals = false), 800);
                        }

                        lastH = newH;
                        lastScrollY = window.scrollY;
                    });
                } else {
                    // fallback
                    let lastH = window.innerHeight;
                    window.addEventListener("resize", () => {
                        const newH = window.innerHeight;
                        const diff = Math.abs(newH - lastH);
                        const scrollDiff = Math.abs(window.scrollY - lastScrollY);

                        if (diff > 0 && diff < 400 && scrollDiff < 8) {
                            ignoreRemovals = true;
                            setTimeout(() => (ignoreRemovals = false), 800);
                        }
                        if (window.scrollY === 0 && newH < lastH) {
                            ignoreRemovals = true;
                            setTimeout(() => (ignoreRemovals = false), 800);
                        }

                        lastH = newH;
                        lastScrollY = window.scrollY;
                    });
                }
            }

            setupViewportWatcher();

            // Helper to keep Education hidden when at the very top on mobile
            function hideEducationAtTop() {
                if (isMobile && educationEl) {
                    if (window.scrollY === 0) {
                        educationEl.classList.remove('show');
                    }
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Keep EDUCATION hidden at absolute top on mobile
                        if (isMobile && educationEl && entry.target === educationEl && window.scrollY === 0) {
                            entry.target.classList.remove('show');
                        } else {
                            entry.target.classList.add('show');
                        }
                    } else {
                        // if mobile just jiggled because the search bar popped out, DON'T hide
                        if (isMobile && ignoreRemovals) {
                            return;
                        }
                        // normal remove (you said you want to keep original behavior)
                        entry.target.classList.remove('show');
                    }
                });
            }, {
                threshold: thresholdValue,
                // keep your 70%-ish trigger if you want:
                rootMargin: "0px 0px -10% 0px"
            });

            // observe all
            reveals.forEach(el => observer.observe(el));

            // robust initial reveal so first screen is visible without scrolling
            const revealNow = () => {
                const vh = window.innerHeight;
                reveals.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    // trigger zone = top 70% of screen
                    if (rect.top < vh * 0.7 && rect.bottom > 0) {
                        el.classList.add("show");
                        if (isMobile && educationEl && el === educationEl && window.scrollY === 0) {
                            el.classList.remove('show');
                        }
                    }
                });
            };

            // run at DOM ready, next paint, and after full load (covers mobile layout shifts)
            revealNow();
            requestAnimationFrame(() => requestAnimationFrame(revealNow));
            hideEducationAtTop();
            window.addEventListener('scroll', hideEducationAtTop, { passive: true });
            window.addEventListener('load', revealNow);
        });