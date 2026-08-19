// NexGen Digital Logo Asset URLs
const LOGO_LIGHT = 'https://res.cloudinary.com/sahbncq8/image/upload/v1786081222/NexG1en_alefcv.png';
const LOGO_DARK = 'https://res.cloudinary.com/sahbncq8/image/upload/v1786076819/NexGen_vzsaqb.png';

// State Variables
let fgColor = '#000000';
let bgColor = '#ffffff';
let currentThemeMode = 'light';

// DOM Elements
const htmlEl = document.documentElement;
const themeDarkBtn = document.getElementById('theme-dark-btn');
const themeLightBtn = document.getElementById('theme-light-btn');
const themeSystemBtn = document.getElementById('theme-system-btn');
const nexgenLogo = document.getElementById('nexgen-logo');
const footerLogo = document.getElementById('footer-logo');

const urlInput = document.getElementById('url-input');
const clearBtn = document.getElementById('clear-btn');
const customizeBtn = document.getElementById('customize-btn');
const customizationPanel = document.getElementById('customization-panel');
const fgSwatches = document.querySelectorAll('.swatch-fg');
const bgSwatches = document.querySelectorAll('.swatch-bg');

const qrImage = document.getElementById('qr-image');
const qrEmpty = document.getElementById('qr-empty');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const copyIcon = document.getElementById('copy-icon');
const checkIcon = document.getElementById('check-icon');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initQRCode();
    attachEventListeners();
});

// Theme Management (Supports 'dark', 'light', 'system')
function initTheme() {
    const savedMode = localStorage.getItem('theme-mode') || 'light';
    setThemeMode(savedMode);

    // Watch for OS system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (currentThemeMode === 'system') {
            applyActualTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setThemeMode(mode) {
    currentThemeMode = mode;
    localStorage.setItem('theme-mode', mode);

    // Update active pill button UI
    [themeDarkBtn, themeLightBtn, themeSystemBtn].forEach(btn => {
        if (btn) {
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    if (mode === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyActualTheme(prefersDark ? 'dark' : 'light');
    } else {
        applyActualTheme(mode);
    }
}

function applyActualTheme(actualTheme) {
    if (actualTheme === 'dark') {
        htmlEl.classList.add('dark');
        htmlEl.classList.remove('light');
        if (nexgenLogo) nexgenLogo.src = LOGO_DARK;
        if (footerLogo) footerLogo.src = LOGO_DARK;
    } else {
        htmlEl.classList.add('light');
        htmlEl.classList.remove('dark');
        if (nexgenLogo) nexgenLogo.src = LOGO_LIGHT;
        if (footerLogo) footerLogo.src = LOGO_LIGHT;
    }
}

// QR Code Generation Logic
async function generateQR() {
    const url = urlInput.value.trim();

    if (!url) {
        if (qrImage) {
            qrImage.src = '';
            qrImage.classList.add('hidden-element');
        }
        if (qrEmpty) qrEmpty.classList.remove('hidden-element');
        if (downloadBtn) downloadBtn.disabled = true;
        if (copyBtn) copyBtn.disabled = true;
        return;
    }

    try {
        let dataUrl = null;

        // Primary: QRCode JS library
        if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
            dataUrl = await QRCode.toDataURL(url, {
                width: 1024,
                margin: 2,
                color: {
                    dark: fgColor,
                    light: bgColor
                }
            });
        }

        // Fallback API if library unavailable
        if (!dataUrl) {
            const fgHex = fgColor.replace('#', '');
            const bgHex = bgColor.replace('#', '');
            dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(url)}&color=${fgHex}&bgcolor=${bgHex}`;
        }

        if (qrImage) {
            qrImage.src = dataUrl;
            qrImage.classList.remove('hidden-element');
        }
        if (qrEmpty) qrEmpty.classList.add('hidden-element');
        if (downloadBtn) downloadBtn.disabled = false;
        if (copyBtn) copyBtn.disabled = false;
    } catch (err) {
        console.error('QR Generation Error:', err);
        // Secondary fallback
        const fgHex = fgColor.replace('#', '');
        const bgHex = bgColor.replace('#', '');
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(url)}&color=${fgHex}&bgcolor=${bgHex}`;
        if (qrImage) {
            qrImage.src = fallbackUrl;
            qrImage.classList.remove('hidden-element');
        }
        if (qrEmpty) qrEmpty.classList.add('hidden-element');
        if (downloadBtn) downloadBtn.disabled = false;
        if (copyBtn) copyBtn.disabled = false;
    }
}

function initQRCode() {
    generateQR();
}

// Event Listeners
function attachEventListeners() {
    // Theme Switcher Buttons
    [themeDarkBtn, themeLightBtn, themeSystemBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                setThemeMode(mode);
            });
        }
    });

    // Input Change
    if (urlInput) {
        urlInput.addEventListener('input', generateQR);
    }

    // Clear Button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            urlInput.value = '';
            generateQR();
            urlInput.focus();
        });
    }

    // Customize Panel Toggle
    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            customizationPanel.classList.toggle('hidden-element');
        });
    }

    // Foreground Swatches
    fgSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            fgSwatches.forEach(s => s.classList.remove('border-slate-900', 'dark:border-white'));
            e.currentTarget.classList.add('border-slate-900', 'dark:border-white');
            fgColor = e.currentTarget.getAttribute('data-color');
            generateQR();
        });
    });

    // Background Swatches
    bgSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            bgSwatches.forEach(s => s.classList.remove('border-slate-900', 'dark:border-white'));
            e.currentTarget.classList.add('border-slate-900', 'dark:border-white');
            bgColor = e.currentTarget.getAttribute('data-color');
            generateQR();
        });
    });

    // Download PNG Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!urlInput.value.trim() || !qrImage || !qrImage.src) return;
            
            // If dataUrl
            if (qrImage.src.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = 'linkqr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Fetch image for cross-origin URL
                fetch(qrImage.src)
                    .then(res => res.blob())
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = 'linkqr-code.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                    })
                    .catch(() => {
                        window.open(qrImage.src, '_blank');
                    });
            }
        });
    }

    // Copy URL Button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (!url) return;
            navigator.clipboard.writeText(url).then(() => {
                copyIcon.classList.add('hidden-element');
                checkIcon.classList.remove('hidden-element');
                setTimeout(() => {
                    copyIcon.classList.remove('hidden-element');
                    checkIcon.classList.add('hidden-element');
                }, 2000);
            }).catch(err => {
                console.error('Copy Error:', err);
            });
        });
    }
}
