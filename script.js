// Mobile nav toggle (progressive enhancement — site works fine without it)
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ===== Video lightbox =====
// Click a reel item -> video plays right on the page, no new tab.
// Works with either a direct file (videos/yourfile.mp4) or a YouTube/Vimeo link.
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('videoModalPlayer');
const modalTitle = document.getElementById('videoModalTitle');
const modalClose = document.getElementById('videoModalClose');

function getEmbedUrl(url) {
  // YouTube
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;

  // Vimeo
  const vim = url.match(/vimeo\.com\/(\d+)/);
  if (vim) return `https://player.vimeo.com/video/${vim[1]}?autoplay=1`;

  return null; // not a recognized platform link
}

function openVideoModal(src, title) {
  modalTitle.textContent = title || '';
  modalPlayer.innerHTML = '';

  const embedUrl = getEmbedUrl(src);

  if (embedUrl) {
    // YouTube / Vimeo — embed in an iframe
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    modalPlayer.appendChild(iframe);
  } else {
    // Direct video file (e.g. videos/your-clip.mp4)
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    modalPlayer.appendChild(video);
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  modal.classList.remove('open');
  modalPlayer.innerHTML = ''; // stops playback
  document.body.style.overflow = '';
}

document.querySelectorAll('.reel-item[data-video]').forEach((item) => {
  item.addEventListener('click', () => {
    openVideoModal(item.dataset.video, item.dataset.title);
  });
});

if (modalClose) modalClose.addEventListener('click', closeVideoModal);

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal(); // click outside the player
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

// ===== Project Form Modal =====
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectForm = document.getElementById('projectForm');

function openProjectModal(e) {
  e.preventDefault();
  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
}

// Show/hide fields based on project type
function updateFormFields() {
  const projectType = document.querySelector('input[name="projectType"]:checked')?.value;
  
  // Hide all fields first
  document.getElementById('editOnlyFields').classList.add('hidden');
  document.getElementById('shootOnlyFields').classList.add('hidden');
  document.getElementById('completeFields').classList.add('hidden');
  
  // Show relevant fields based on selection
  if (projectType === 'edit-only') {
    document.getElementById('editOnlyFields').classList.remove('hidden');
  } else if (projectType === 'shoot-only') {
    document.getElementById('shootOnlyFields').classList.remove('hidden');
  } else if (projectType === 'complete') {
    document.getElementById('completeFields').classList.remove('hidden');
  }
}

// Handle form submission
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = projectForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(projectForm);
    const projectType = document.querySelector('input[name="projectType"]:checked')?.value;
    
    // Create submission object
    const submission = {
      clientName: formData.get('clientName'),
      clientEmail: formData.get('clientEmail'),
      clientPhone: formData.get('clientPhone') || 'Not provided',
      projectType: projectType || 'Not selected',
      projectCount: formData.get('projectCount'),
      timestamp: new Date().toISOString(),
      formData: Object.fromEntries(formData)
    };
    
    // Remove undefined values for Firebase
    const cleanSubmission = {};
    for (const [key, value] of Object.entries(submission)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanSubmission[key] = value;
      }
    }
    
    try {
      // Send to Formspree
      await fetch('https://formspree.io/f/mzebrdzw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: submission.clientName,
          email: submission.clientEmail,
          phone: submission.clientPhone,
          projectType: projectType,
          projectCount: submission.projectCount,
          ...submission.formData
        })
      });
      
      // Send to Firebase
      if (window.saveToFirebase) {
        await window.saveToFirebase(cleanSubmission);
      }
      
      // Show success message
      alert('Project request submitted successfully! We will contact you soon.');
      
      // Close form and reset
      closeProjectModal();
      projectForm.reset();
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Close button
if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

// Click outside to close
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

// Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal.classList.contains('open')) {
    closeProjectModal();
  }
});
