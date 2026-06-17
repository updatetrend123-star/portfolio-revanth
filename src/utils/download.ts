/**
 * Utility to securely download resume or other PDF files
 * Prevents SPA HTML fallback downloads and logs errors gracefully
 */
export async function downloadFile(url: string, defaultFilename: string = 'revanth_kumar_resume.pdf') {
  try {
    // Resolve full path if relative
    const fetchUrl = url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
    
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML document instead of binary file. The resource might not exist, causing SPA fallback to serve index.html.');
    }

    const blob = await response.blob();
    // Enforce PDF MIME type to ensure browser handles it correctly
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    
    const objectUrl = window.URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = objectUrl;
    
    // Extract filename from URL or use default
    const urlFilename = url.substring(url.lastIndexOf('/') + 1);
    const filename = urlFilename && urlFilename.endsWith('.pdf') ? urlFilename : defaultFilename;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Robust download utility failed:', error);
    // Graceful fallback: Open in a new tab
    window.open(url, '_blank');
    return false;
  }
}
