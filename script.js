// Konfigurasi path file markdown
const MARKDOWN_FILE = 'post/laporan.md';

// Inisialisasi Dark Mode
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const iconSpan = themeToggle.querySelector('span');

// Cek preferensi pengguna yang tersimpan atau preferensi sistem
const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    iconSpan.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

// Fetch dan Render Markdown
async function loadMarkdown() {
    const contentDiv = document.getElementById('markdown-content');
    
    try {
        const response = await fetch(MARKDOWN_FILE);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Konfigurasi Marked.js untuk mendukung semua sintaks (GFM)
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true
        });

        // Parse markdown dan sanitasi HTML untuk keamanan
        const rawHtml = marked.parse(text);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        
        contentDiv.innerHTML = cleanHtml;
        
    } catch (error) {
        console.error('Gagal memuat laporan:', error);
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 48px 0; color: var(--md-primary);">
                <span class="material-symbols-rounded" style="font-size: 48px;">warning</span>
                <h2>Laporan Belum Tersedia</h2>
                <p>Silakan buat atau perbarui file di path: <code>${MARKDOWN_FILE}</code></p>
                <p style="margin-top: 16px; font-size: 14px; color: var(--md-on-surface-variant);">
                    Contoh format: Tambahkan header, tabel, dan data keuangan Anda di sini.
                </p>
            </div>
        `;
    }
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', loadMarkdown);
