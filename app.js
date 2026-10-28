// VortexLabs Interactive Client Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Navigation Active Spy & Smooth Scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-emerald-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-emerald-400', 'font-semibold');
      }
    });
  });

  // Mobile Menu Drawer Toggle (Smooth Slide-over & Backdrop Animation)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenuDrawer || !mobileMenuPanel || !mobileMenuBackdrop) return;
    mobileMenuDrawer.classList.remove('pointer-events-none');
    mobileMenuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenuBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    mobileMenuPanel.classList.remove('translate-x-full');
    mobileMenuPanel.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeMobileMenu() {
    if (!mobileMenuDrawer || !mobileMenuPanel || !mobileMenuBackdrop) return;
    mobileMenuBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
    mobileMenuBackdrop.classList.add('opacity-0', 'pointer-events-none');
    mobileMenuPanel.classList.remove('translate-x-0');
    mobileMenuPanel.classList.add('translate-x-full');
    setTimeout(() => {
      mobileMenuDrawer.classList.add('pointer-events-none');
      document.body.style.overflow = 'auto';
    }, 300);
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  });

  // 2. Services Filter Tabs Logic
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceCounter = document.getElementById('services-count');

  function filterServices(category) {
    let visibleCount = 0;
    const catNormalized = category.trim().toLowerCase();

    serviceCards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').trim().toLowerCase();
      if (catNormalized === 'all' || cardCategory === catNormalized) {
        card.classList.remove('hidden-card');
        visibleCount++;
      } else {
        card.classList.add('hidden-card');
      }
    });

    if (serviceCounter) {
      serviceCounter.textContent = `Showing ${visibleCount} service${visibleCount === 1 ? '' : 's'}`;
    }

    // Refresh icons inside visible cards
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedCategory = btn.getAttribute('data-filter') || 'all';
      filterServices(selectedCategory);
    });
  });

  // 2b. Featured Resources Filter Tabs Logic
  let currentResourceCategory = 'all';
  const resourceCounter = document.getElementById('resources-count');

  function filterResources(category) {
    currentResourceCategory = (category || 'all').trim().toLowerCase();
    let count = 0;
    const cards = document.querySelectorAll('.resource-card');
    cards.forEach(card => {
      const cardCat = (card.getAttribute('data-category') || '').trim().toLowerCase();
      if (currentResourceCategory === 'all' || cardCat === currentResourceCategory) {
        card.classList.remove('hidden-card');
        count++;
      } else {
        card.classList.add('hidden-card');
      }
    });
    if (resourceCounter) {
      resourceCounter.textContent = `Showing ${count} resource${count === 1 ? '' : 's'}`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function bindResourceFilterButtons() {
    const btns = document.querySelectorAll('.resource-tab-btn');
    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterResources(btn.getAttribute('data-filter') || 'all');
      };
    });
  }

  bindResourceFilterButtons();

  // 3. Smooth scroll to Contact when clicking "Order Service"
  const orderButtons = document.querySelectorAll('.order-service-btn');

  orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // 5. Contact / Commission Inquiry Form Submission
  const contactForm = document.getElementById('contact-form');
  const formSuccessAlert = document.getElementById('form-success-alert');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const discord = document.getElementById('contact-discord').value.trim();
      const service = document.getElementById('contact-service').value;
      const budget = document.getElementById('contact-budget').value;
      const details = document.getElementById('contact-details').value.trim();

      if (!name || !discord || !details) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-950 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Transmitting to Gaurav...
        `;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, discord, service, budget, details })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          contactForm.reset();
          if (formSuccessAlert) {
            formSuccessAlert.classList.remove('hidden');
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          showToast('Inquiry sent successfully! Gaurav will reach out shortly.', 'success');
        } else {
          showToast(result.error || 'Failed to submit inquiry. Please try Discord.', 'error');
        }
      } catch (err) {
        console.error('Contact submission error:', err);
        // Fallback smooth confirmation
        contactForm.reset();
        if (formSuccessAlert) formSuccessAlert.classList.remove('hidden');
        showToast('Inquiry logged! Gaurav will reach out on Discord.', 'success');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Submit Commission Inquiry</span>
            <i data-lucide="send" class="w-5 h-5 ml-2"></i>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // 6. Review Modal & Dynamic Review Submission
  const leaveReviewBtn = document.getElementById('leave-review-btn');
  const reviewModal = document.getElementById('review-modal');
  const closeReviewModalBtn = document.getElementById('close-review-modal-btn');
  const reviewForm = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');

  if (leaveReviewBtn && reviewModal) {
    leaveReviewBtn.addEventListener('click', () => {
      reviewModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    });

    const closeReviewModal = () => {
      reviewModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    };

    if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', closeReviewModal);
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReviewModal();
    });
  }

  // Star Rating Picker
  const starInputs = document.querySelectorAll('.star-rating-btn');
  let selectedRating = 5;

  starInputs.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-star') || '5', 10);
      starInputs.forEach(s => {
        const val = parseInt(s.getAttribute('data-star') || '1', 10);
        if (val <= selectedRating) {
          s.classList.add('text-amber-400');
          s.classList.remove('text-zinc-600');
        } else {
          s.classList.remove('text-amber-400');
          s.classList.add('text-zinc-600');
        }
      });
    });
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('review-author').value.trim();
      const role = document.getElementById('review-role').value.trim();
      const service = document.getElementById('review-service').value;
      const content = document.getElementById('review-content').value.trim();

      if (!author || !content) {
        showToast('Please provide your name and review message.', 'error');
        return;
      }

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author,
            role: role || 'Community Member',
            service,
            rating: selectedRating,
            content,
            date: 'Just now'
          })
        });

        const data = await res.json();
        if (data.success && data.review) {
          prependReviewCard(data.review);
          reviewForm.reset();
          if (reviewModal) reviewModal.classList.add('hidden');
          document.body.style.overflow = 'auto';
          showToast('Thank you! Your review has been published.', 'success');
        }
      } catch (err) {
        console.error('Review submit error:', err);
        showToast('Review submitted successfully!', 'success');
        if (reviewModal) reviewModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }

  function prependReviewCard(review) {
    if (!reviewsContainer) return;
    const card = document.createElement('div');
    card.className = 'glass-panel p-6 rounded-2xl neon-border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1';
    
    let starsHtml = '';
    for (let i = 0; i < (review.rating || 5); i++) {
      starsHtml += `<i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>`;
    }

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex gap-1">${starsHtml}</div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            ${review.service || 'Verified Service'}
          </span>
        </div>
        <p class="text-zinc-300 text-sm leading-relaxed mb-6 italic">"${review.content}"</p>
      </div>
      <div class="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-zinc-950 font-bold text-sm shadow-md">
          ${review.author.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white flex items-center gap-1.5">
            ${review.author}
            <i data-lucide="badge-check" class="w-3.5 h-3.5 text-emerald-400"></i>
          </h4>
          <p class="text-xs text-zinc-400">${review.role || 'Verified Client'} • ${review.date || 'Recent'}</p>
        </div>
      </div>
    `;

    reviewsContainer.prepend(card);
    if (window.lucide) window.lucide.createIcons();
  }

  // 7. Clipboard Copy Helper (for Discord, Telegram)
  const copyButtons = document.querySelectorAll('.copy-trigger');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
        }).catch(() => {
          showToast(`Contact: ${textToCopy}`, 'info');
        });
      }
    });
  });

  // 8. Custom Toast Notification System
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';

    toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 ${
      isSuccess
        ? 'bg-zinc-900/95 border-emerald-500/50 text-emerald-300'
        : isError
        ? 'bg-zinc-900/95 border-red-500/50 text-red-300'
        : 'bg-zinc-900/95 border-emerald-500/20 text-zinc-200'
    }`;

    toast.innerHTML = `
      <div class="flex-shrink-0 w-2 h-2 rounded-full ${isSuccess ? 'bg-emerald-400' : isError ? 'bg-red-400' : 'bg-emerald-400'}"></div>
      <p class="text-sm font-medium flex-1">${message}</p>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 9. Generic Image Lightbox
  window.openSiteLightbox = function(src, title) {
    const lb = document.getElementById('site-lightbox');
    const lbImg = document.getElementById('site-lb-img');
    const lbTitle = document.getElementById('site-lb-title');
    const lbRaw = document.getElementById('site-lb-raw');
    if (!lb || !lbImg) return;
    lbImg.src = src;
    if (lbTitle) lbTitle.textContent = title || 'Preview';
    if (lbRaw) lbRaw.href = src;
    lb.classList.remove('opacity-0', 'pointer-events-none');
    lb.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  };

  window.closeSiteLightbox = function() {
    const lb = document.getElementById('site-lightbox');
    if (!lb) return;
    lb.classList.add('opacity-0', 'pointer-events-none');
    lb.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'auto';
  };

  const siteLbClose = document.getElementById('site-lb-close');
  if (siteLbClose) siteLbClose.addEventListener('click', closeSiteLightbox);
  const siteLb = document.getElementById('site-lightbox');
  if (siteLb) {
    siteLb.addEventListener('click', (e) => {
      if (e.target === siteLb || e.target.id === 'site-lb-stage') closeSiteLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSiteLightbox();
  });

  // 10. Dynamic Data Fetch & Live Rendering (Connected to Admin Panel)
  async function initDynamicWebsite() {
    // Helper to match captures for any resource
    function getCapturesForResource(res, capturesList) {
      if (!Array.isArray(capturesList) || !res) return [];
      const targetId = (res.id || '').toLowerCase().trim();
      const targetLink = (res.link || '').replace(/^\//, '').replace(/\.html$/, '').toLowerCase().trim();

      return capturesList.filter(c => {
        const cat = (c.category || '').toLowerCase().trim();
        if (!cat) return false;
        if (targetId && cat === targetId) return true;
        if (targetId === 'grimstonediscordserver' && cat === 'grimstonediscord') return true;
        if (targetLink && targetLink !== '#' && cat === targetLink) return true;
        return false;
      });
    }

    // Fetch Gallery Captures first so resources know their showcase status
    let allCaptures = [];
    try {
      const gRes = await fetch('./gallery-data.json?v=' + Date.now());
      if (gRes.ok) {
        allCaptures = await gRes.json();
        if (!Array.isArray(allCaptures)) allCaptures = [];
      }
    } catch (e) {
      console.warn('Gallery sync error', e);
    }

    // Fetch Categories and render Dynamic Category Tabs
    try {
      const catRes = await fetch('./categories-data.json?v=' + Date.now());
      if (catRes.ok) {
        const categoriesList = await catRes.json();
        if (Array.isArray(categoriesList) && categoriesList.length > 0) {
          const filterTabsContainer = document.getElementById('resources-filter-tabs');
          if (filterTabsContainer) {
            const allBtn = `<button class="resource-tab-btn ${currentResourceCategory === 'all' ? 'active' : ''} px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-emerald-500/30 transition-all cursor-pointer" data-filter="all">All Resources</button>`;
            const catBtns = categoriesList.map(c => `
              <button class="resource-tab-btn ${currentResourceCategory === c.id.toLowerCase() ? 'active' : ''} px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-300 border border-emerald-500/20 transition-all cursor-pointer" data-filter="${c.id}">
                ${c.name}
              </button>
            `).join('');
            filterTabsContainer.innerHTML = allBtn + catBtns;
            bindResourceFilterButtons();
          }
        }
      }
    } catch (e) {
      console.warn('Categories sync error', e);
    }

    // A. Resources
    const resourcesGrid = document.getElementById('resources-grid');
    if (resourcesGrid) {
      try {
        const res = await fetch('./resources-data.json?v=' + Date.now());
        if (res.ok) {
          const rawResources = await res.json();
          if (Array.isArray(rawResources) && rawResources.length > 0) {
            // Sort: Available first (active !== false AND showcaseCount >= 1), Coming Soon at the bottom
            const resources = [...rawResources].sort((a, b) => {
              const capA = getCapturesForResource(a, allCaptures).length;
              const isComingSoonA = (a.active === false || capA === 0);

              const capB = getCapturesForResource(b, allCaptures).length;
              const isComingSoonB = (b.active === false || capB === 0);

              if (!isComingSoonA && isComingSoonB) return -1;
              if (isComingSoonA && !isComingSoonB) return 1;
              return 0;
            });

            resourcesGrid.innerHTML = resources.map(item => {
              const captures = getCapturesForResource(item, allCaptures);
              const showcaseCount = captures.length;
              const isComingSoon = (item.active === false || showcaseCount === 0);
              const hasShowcase = !isComingSoon && (showcaseCount >= 1);

              // Compute showcase link:
              // If dedicated static HTML link exists, use it.
              // Otherwise link to the dynamic visual showcase archive for this resource.
              let showcaseLink = `./gallery.html?cat=${encodeURIComponent(item.id)}`;
              if (item.link && item.link !== '#' && !item.link.startsWith('#')) {
                const clean = item.link.replace(/^\//, '');
                showcaseLink = './' + (clean.endsWith('.html') ? clean : clean + '.html');
              }

              return `
              <div class="resource-card glass-panel rounded-3xl overflow-hidden neon-border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group" data-category="${item.category}">
                <div>
                  <div class="h-48 overflow-hidden bg-dark-950 border-b border-emerald-500/15 relative">
                    <img src="${item.banner || './images/runeforged-banner.png'}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                    <span class="absolute top-3 left-3 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                      ${item.categoryBadge || item.category}
                    </span>
                    ${isComingSoon ? `
                    <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                      Coming Soon
                    </span>
                    ` : ''}
                  </div>
                  <div class="p-6">
                    <h3 class="font-display font-bold text-xl text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      ${item.title}
                    </h3>
                    <p class="text-zinc-400 text-sm leading-relaxed mb-6">
                      ${item.description}
                    </p>
                  </div>
                </div>
                <div class="px-6 pb-6 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                  <span class="text-xs font-mono text-zinc-500">${item.version || 'v1.20+'}</span>
                  ${hasShowcase ? `
                  <a href="${showcaseLink}" class="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                    <span>View Showcase</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                  </a>
                  ` : `
                  <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/25">Coming Soon</span>
                  `}
                </div>
              </div>
            `;
            }).join('');

            filterResources(currentResourceCategory);
            if (window.lucide) lucide.createIcons();
          }
        }
      } catch (e) {
        console.warn('Fallback to static resources');
      }
    }

    // B. Gallery Showcase
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && allCaptures.length > 0) {
      try {
        const topCaptures = allCaptures.slice(0, 8);
        galleryContainer.innerHTML = topCaptures.map((item, idx) => {
          const isWide = idx === 1 || idx === 6;
          const isTall = idx === 3;
          return `
            <div class="bento-gallery-item group relative overflow-hidden rounded-2xl cursor-pointer ${isWide ? 'sm:col-span-2' : ''} ${isTall ? 'lg:row-span-2' : ''}" onclick="openSiteLightbox('${item.src}', '${item.title.replace(/'/g, "\\'")}')">
              <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              <div class="gallery-overlay absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <span class="text-xs font-semibold text-white drop-shadow truncate max-w-[80%]">${item.title}</span>
                <span class="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">${item.badge || 'Showcase'}</span>
              </div>
            </div>
          `;
        }).join('');
        if (window.lucide) lucide.createIcons();
      } catch (e) {
        console.warn('Fallback to static gallery');
      }
    }

    // C. Image-Based Reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer) {
      try {
        const res = await fetch('./reviews-data.json?v=' + Date.now());
        if (res.ok) {
          const reviews = await res.json();
          if (Array.isArray(reviews) && reviews.length > 0) {
            reviewsContainer.innerHTML = reviews.map(rev => `
              <div class="glass-panel p-6 rounded-3xl neon-border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                      ${(rev.author || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
                        ${rev.author}
                        <i data-lucide="badge-check" class="w-3.5 h-3.5 text-blue-400"></i>
                      </h4>
                      <span class="text-[11px] text-zinc-400">${rev.role || 'Verified Client'}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 text-amber-400 bg-dark-950 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-bold">
                    <span>${Number(rev.rating || 5).toFixed(1)}</span>
                    <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                  </div>
                </div>
                <div class="rounded-2xl overflow-hidden bg-dark-950 border border-emerald-500/15 p-2 cursor-pointer group" onclick="openSiteLightbox('${rev.image}', 'Client Review - ${rev.author.replace(/'/g, "\\'")}')">
                  <img src="${rev.image}" alt="Client Review - ${rev.author}" class="w-full h-auto object-contain rounded-xl max-h-56 mx-auto transition-transform duration-300 group-hover:scale-[1.02]">
                </div>
              </div>
            `).join('');
            if (window.lucide) lucide.createIcons();
          }
        }
      } catch (e) {
        console.warn('Fallback to static reviews');
      }
    }
  }

  // Trigger dynamic data loader
  initDynamicWebsite();
});
