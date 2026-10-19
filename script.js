/**
 * Shidy Nur Kholish — Portfolio & Resume Interactive Script
 * Replicates Nico Wilson Framer Template interactions:
 * - Scroll-reveal animations
 * - Numbered navigation spy & mobile menu
 * - Capabilities accordion
 * - Portfolio category filter & Case Study modal (/works/* view)
 * - Direct WhatsApp & Email CTA integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal Observer (Framer entrance motion)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // 3. Active Section Navigation Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let currentSection = 'home';
    const scrollY = window.scrollY + 180;

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentSection}`
      );
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 4. Print / Save CV Button
  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 5. Capabilities / Skills Accordion
  const capabilityItems = document.querySelectorAll('.capability-item');
  capabilityItems.forEach((item) => {
    const header = item.querySelector('.capability-header');
    if (header) {
      header.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });

  // 6. Portfolio Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const workCards = document.querySelectorAll('.work-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedFilter = tab.getAttribute('data-filter');

      workCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (selectedFilter === 'all' || category === selectedFilter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Case Study Modal (Replicating Nico Wilson /works/[slug] pages)
  const projectCaseStudies = {
    'pertama-luxury': {
      category: '// CASE STUDY · PROPERTY LEAD GENERATION',
      title: 'Beraban Luxury Loft & Elle Villas Seminyak',
      service: 'Meta Ads, Google Ads & Lead Generation',
      year: '2025 – 2026',
      client: 'Pertama Property',
      overview:
        'Kampanye pemasaran digital terfokus untuk penjualan unit villa dan luxury loft premium di kawasan strategis Seminyak dan Beraban, Bali. Fokus utama adalah menjangkau investor properti domestik maupun internasional dengan prospek (leads) berkualitas tinggi.',
      challenge:
        'Pasar properti mewah di Bali memiliki tingkat kompetisi yang sangat tinggi. Tantangannya adalah menjaga efisiensi Cost Per Lead (CPL) sekaligus menyaring audiens berdaya beli tinggi yang siap melanjutkan ke tahap site visit dan transaksi (closing).',
      solution:
        'Merancang dan mengoptimasi struktur kampanye Meta Ads & Google Ads (CBO/CPL), menyusun copywriting persuasif dan creative marketing berstandar investasi global, serta berkolaborasi langsung dengan tim sales/in-house agent untuk mempercepat konversi leads hingga site visit dan closing.'
    },
    'casaverde-abadi': {
      category: '// CASE STUDY · PERFORMANCE MARKETING & ANALYTICS',
      title: 'Casaverde & Abadi Property Campaign',
      service: 'Performance Marketing & Data Analytics',
      year: '2025 – 2026',
      client: 'Pertama Property',
      overview:
        'Pengelolaan strategi paid traffic dan evaluasi performa iklan secara menyeluruh untuk portofolio proyek properti Casaverde dan Abadi.',
      challenge:
        'Mengalokasikan anggaran iklan secara presisi di berbagai channel digital dan memastikan setiap kampanye menghasilkan Return on Ad Spend (ROAS) serta Click-Through Rate (CTR) yang optimal.',
      solution:
        'Memantau dan menganalisis metrik utama (CPL, ROAS, CTR, conversion rate) secara berkala, menyusun laporan analitik berbasis data (data-driven reporting) untuk evaluasi efektivitas anggaran, serta melakukan iterasi materi kreatif berdasarkan performa audiens.'
    },
    'urban-group': {
      category: '// CASE STUDY · CREATIVE MARKETING, KOL & POSM',
      title: 'Mandatory, Mooiz & MS Kids',
      service: 'Creative Marketing, KOL & Graphic Design',
      year: '2023 – 2024',
      client: 'Urban Group Indonesia',
      overview:
        'Pengelolaan strategi creative marketing 360 derajat untuk tiga lini brand utama di bawah naungan Urban Group Indonesia: Mandatory, Mooiz, dan MS Kids.',
      challenge:
        'Menjaga konsistensi identitas visual di berbagai kanal—mulai dari konten harian media sosial, kolaborasi Key Opinion Leader (KOL), e-commerce, hingga aktivasi ritel dan pameran offline.',
      solution:
        'Mengelola end-to-end kampanye kreatif dan manajemen KOL, merancang konten feed/story media sosial serta materi promosi e-commerce, sekaligus mendesain Point of Sales Materials (POSM), booth event pameran, flyer, brosur, dan rak display produk.'
    },
    'nusa-berkibar': {
      category: '// CASE STUDY · COMMERCIAL PHOTO, VIDEO & ACTIVATION',
      title: 'Nusa Berkibar Tour & Proyek Bank Indonesia',
      service: 'Commercial Photography, Videography & Tour Leader',
      year: '2022 – 2023',
      client: 'Nusa Berkibar Tour & Travel (Malang)',
      overview:
        'Produksi dokumentasi visual promosi, fotografi komersial, dan videografi acara untuk klien korporat dan institusi besar, termasuk proyek kegiatan bersama Bank Indonesia.',
      challenge:
        'Menghasilkan dokumentasi multimedia berstandar institusi dengan alur acara lapangan yang dinamis sekaligus memastikan kelancaran koordinasi rombongan.',
      solution:
        'Menjalankan peran ganda sebagai tim kreatif multimedia (fotografi komersial & videografi acara) serta tour leader yang mengoordinasikan jalannya kegiatan wisata dan menjamin kepuasan peserta.'
    },
    'serenity-eco': {
      category: '// CASE STUDY · HOSPITALITY & WELLNESS BRANDING',
      title: 'Serenity Eco Guesthouse & Yoga',
      service: 'Hospitality Marketing & Graphic Design',
      year: '2021 – 2022',
      client: 'Serenity Eco Guesthouse & Yoga (Bali)',
      overview:
        'Pengembangan aset visual digital dan cetak untuk mempromosikan layanan akomodasi eco-guesthouse, gaya hidup wellness, dan program event yoga di Bali.',
      challenge:
        'Meningkatkan eksposur organik maupun promosi visual agar mampu menarik wisatawan wellness dan peserta kelas yoga di tengah pemulihan industri pariwisata.',
      solution:
        'Merancang materi pemasaran digital dan cetak yang selaras dengan identitas eco-wellness, sehingga berhasil memperkuat eksposur brand dan mendorong peningkatan kedatangan tamu.'
    }
  };

  const modal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalService = document.getElementById('modalService');
  const modalYear = document.getElementById('modalYear');
  const modalClient = document.getElementById('modalClient');
  const modalOverview = document.getElementById('modalOverview');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalSolution = document.getElementById('modalSolution');

  workCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-project');
      const data = projectCaseStudies[key];
      if (!data || !modal) return;

      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalService.textContent = data.service;
      modalYear.textContent = data.year;
      modalClient.textContent = data.client;
      modalOverview.textContent = data.overview;
      modalChallenge.textContent = data.challenge;
      modalSolution.textContent = data.solution;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  // 8. Contact Form Service Selector & WhatsApp / Email Submission
  const servicePills = document.querySelectorAll('#servicePills .selector-pill');
  let selectedService = 'Meta & Google Paid Ads';

  servicePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      servicePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      selectedService = pill.getAttribute('data-value');
    });
  });

  const contactForm = document.getElementById('contactForm');
  const sendEmailBtn = document.getElementById('sendEmailBtn');

  const getFormPayload = () => {
    const name = document.getElementById('senderName')?.value.trim() || 'Client';
    const email = document.getElementById('senderEmail')?.value.trim() || '-';
    const details = document.getElementById('projectDetails')?.value.trim() || '-';
    return { name, email, service: selectedService, details };
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email, service, details } = getFormPayload();
      const text = `Halo Shidy Nur Kholish,\n\nSaya *${name}* (${email}).\n*Kebutuhan:* ${service}\n*Detail Proyek:* ${details}`;
      const waUrl = `https://wa.me/6281338596305?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const { name, email, service, details } = getFormPayload();
      const subject = `Kolaborasi / Inquiry: ${service} — ${name}`;
      const body = `Halo Shidy Nur Kholish,\n\nNama: ${name}\nEmail: ${email}\nLayanan: ${service}\n\nDetail Proyek:\n${details}`;
      window.location.href = `mailto:shidy354@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
