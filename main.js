// Wait until DOM is fully parsed
document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // DEVICE DETECTION & CONSTANTS
  // ==========================================================================
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const isDesktopViewport = window.innerWidth >= 1024;
  
  // ==========================================================================
  // PAGE LOADER
  // ==========================================================================
  const pageLoader = document.querySelector(".page-loader");
  window.addEventListener("load", () => {
    if (pageLoader) {
      setTimeout(() => {
        gsap.to(pageLoader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            pageLoader.style.visibility = "hidden";
            triggerHeroIntroAnimations();
          }
        });
      }, 400);
    } else {
      triggerHeroIntroAnimations();
    }
  });

  // ==========================================================================
  // LENIS SMOOTH SCROLLING (Desktop Only)
  // ==========================================================================
  let lenis;
  if (!isTouchDevice && isDesktopViewport) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ==========================================================================
  // CUSTOM CURSOR (Desktop Only)
  // ==========================================================================
  const cursorDot = document.querySelector(".custom-cursor-dot");
  const cursorCircle = document.querySelector(".custom-cursor-circle");
  
  if (cursorDot && cursorCircle && !isTouchDevice && isDesktopViewport) {
    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let dotX = 0, dotY = 0;
    
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function updateCursor() {
      circleX += (mouseX - circleX) * 0.1;
      circleY += (mouseY - circleY) * 0.1;
      
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      
      cursorCircle.style.left = `${circleX}px`;
      cursorCircle.style.top = `${circleY}px`;
      
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    
    // Add hover states on interactive links
    const interactiveElements = document.querySelectorAll("a, button, input, select, textarea, .stepper-btn, .clickable");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  // ==========================================================================
  // NAVIGATION & SCROLL PROGRESS
  // ==========================================================================
  const navHeader = document.querySelector(".header-nav");
  const scrollProgress = document.querySelector(".scroll-progress");
  const backToTopBtn = document.querySelector(".back-to-top");
  
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Scroll progress bar
    if (scrollProgress && docHeight > 0) {
      const scrolledPct = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${scrolledPct}%`;
    }
    
    // Header shrinking (scrolled layout styling)
    if (navHeader) {
      if (scrollTop > 40) {
        navHeader.classList.add("scrolled");
      } else {
        navHeader.classList.remove("scrolled");
      }
    }
    
    // Back to top visibility
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });
  
  // Back to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ==========================================================================
  // MOBILE HAMBURGER & OVERLAY
  // ==========================================================================
  const hamburger = document.querySelector(".hamburger");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  
  if (hamburger && mobileNavOverlay) {
    const mobileLinks = mobileNavOverlay.querySelectorAll(".mobile-nav-links a");
    const mobileCta = mobileNavOverlay.querySelector(".mobile-cta-wrapper");
    
    hamburger.addEventListener("click", () => {
      const active = hamburger.classList.toggle("active");
      mobileNavOverlay.classList.toggle("active", active);
      
      if (active) {
        if (lenis) lenis.stop();
        document.body.style.overflow = "hidden";
        
        // GSAP Stagger
        gsap.killTweensOf([mobileLinks, mobileCta]);
        gsap.fromTo(mobileLinks, 
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
        );
        gsap.fromTo(mobileCta,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power3.out" }
        );
      } else {
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      }
    });
    
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileNavOverlay.classList.remove("active");
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      });
    });
  }

  // ==========================================================================
  // INTERSECTION OBSERVER REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================================================
  // TEXT CHAR-BY-CHAR SPLITTING FOR H2
  // ==========================================================================
  const splitTextHeaders = document.querySelectorAll(".split-text");
  splitTextHeaders.forEach(header => {
    const text = header.textContent.trim();
    header.textContent = "";
    
    const words = text.split(" ");
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";
      
      const chars = Array.from(word);
      chars.forEach(char => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.classList.add("char");
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        charSpan.style.transform = "translateY(20px)";
        wordSpan.appendChild(charSpan);
      });
      
      header.appendChild(wordSpan);
      
      if (wordIdx < words.length - 1) {
        header.appendChild(document.createTextNode(" "));
      }
    });
    
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      const chars = header.querySelectorAll(".char");
      gsap.to(chars, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.025,
        ease: "power2.out"
      });
    }
  });

  // ==========================================================================
  // FIRST SCREEN / HERO INTRO ANIMATIONS
  // ==========================================================================
  function triggerHeroIntroAnimations() {
    if (typeof gsap === "undefined") return;
    
    const heroTitle = document.querySelector(".hero-title");
    const heroLabel = document.querySelector(".hero-label");
    const heroDesc = document.querySelector(".hero-desc");
    const heroCtas = document.querySelector(".hero-ctas");
    const heroBadge = document.querySelector(".hero-rating-badge");
    
    if (heroTitle) {
      const words = heroTitle.textContent.trim().split(" ");
      heroTitle.textContent = "";
      
      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        
        const chars = Array.from(word);
        chars.forEach(char => {
          const charSpan = document.createElement("span");
          charSpan.textContent = char;
          charSpan.classList.add("hero-char");
          charSpan.style.display = "inline-block";
          charSpan.style.opacity = "0";
          charSpan.style.transform = "translateY(30px)";
          wordSpan.appendChild(charSpan);
        });
        
        heroTitle.appendChild(wordSpan);
        if (wordIdx < words.length - 1) {
          heroTitle.appendChild(document.createTextNode(" "));
        }
      });
      
      const tl = gsap.timeline();
      
      if (heroLabel) {
        tl.fromTo(heroLabel, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
      
      tl.to(heroTitle.querySelectorAll(".hero-char"), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.025,
        ease: "power3.out"
      }, "-=0.2");
      
      if (heroDesc) {
        tl.fromTo(heroDesc,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
      }
      
      if (heroCtas) {
        tl.fromTo(heroCtas.querySelectorAll(".btn"),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        );
      }
      
      if (heroBadge) {
        tl.fromTo(heroBadge,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.4"
        );
      }
    }
  }

  // ==========================================================================
  // LAZY-LOAD & INTERACTIVE PLAY FOR INSTAGRAM REELS (NEW)
  // ==========================================================================
  const reelCards = document.querySelectorAll(".reel-card");
  if (reelCards.length > 0) {
    const reelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const reelId = card.getAttribute("data-reel-id");
          const wrapper = card.querySelector(".reel-iframe-wrapper");
          
          if (wrapper && !wrapper.querySelector("iframe")) {
            // Lazy load iframe on scroll reach
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.instagram.com/reel/${reelId}/embed/captioned/`;
            iframe.className = "reel-iframe";
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("scrolling", "no");
            iframe.setAttribute("allowtransparency", "true");
            iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share");
            
            iframe.onload = () => {
              iframe.classList.add("loaded");
              const placeholder = card.querySelector(".reel-placeholder");
              if (placeholder && typeof gsap !== "undefined") {
                gsap.to(placeholder, {
                  opacity: 0,
                  duration: 0.4,
                  onComplete: () => {
                    placeholder.style.display = "none";
                  }
                });
              } else if (placeholder) {
                placeholder.style.display = "none";
              }
            };
            
            wrapper.appendChild(iframe);
          }
          
          // Highlight card currently centered on screen
          reelCards.forEach(c => c.classList.remove("active"));
          card.classList.add("active");
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: "0px 0px -15% 0px"
    });
    
    reelCards.forEach(card => {
      reelObserver.observe(card);
      
      card.addEventListener("click", () => {
        const reelId = card.getAttribute("data-reel-id");
        const wrapper = card.querySelector(".reel-iframe-wrapper");
        if (wrapper && !wrapper.querySelector("iframe")) {
          card.classList.add("active");
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.instagram.com/reel/${reelId}/embed/captioned/`;
          iframe.className = "reel-iframe";
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("scrolling", "no");
          iframe.setAttribute("allowtransparency", "true");
          iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share");
          iframe.onload = () => {
            iframe.classList.add("loaded");
            const placeholder = card.querySelector(".reel-placeholder");
            if (placeholder) {
              placeholder.style.display = "none";
            }
          };
          wrapper.appendChild(iframe);
        }
      });
    });
  }

});

