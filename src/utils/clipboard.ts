/**
 * Copy text to the clipboard reliably. The async Clipboard API is blocked in
 * many contexts (insecure origin, unfocused document, iframes without the
 * clipboard-write permission), so we fall back to a hidden-textarea +
 * execCommand('copy'), which works as long as there's a user gesture.
 *
 * Returns true only if the copy actually succeeded, so callers can show
 * accurate feedback instead of a misleading "copied!" toast.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Preferred path: async Clipboard API (needs a secure, focused context).
  try {
    if (navigator.clipboard && window.isSecureContext && document.hasFocus()) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  // Fallback: hidden textarea + execCommand('copy').
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
