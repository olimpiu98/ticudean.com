/**
 * CV Section Toggle
 * Controls which sections are included in PDF print.
 */
function toggleSection(checkbox) {
    const section = checkbox.closest('.cv-section');
    if (checkbox.checked) {
        section.classList.remove('exclude-print');
    } else {
        section.classList.add('exclude-print');
    }
}
