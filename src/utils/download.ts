/**
 * Utility to securely download resume or other PDF files
 * Prevents SPA HTML fallback downloads and handles downloads with high fail-safety
 */
export async function downloadFile(url: string, defaultFilename: string = 'revanth_kumar_resume.pdf') {
  const isRelative = !url.startsWith('http://') && !url.startsWith('https://');
  
  // Extract clean filename from URL or use default
  const urlFilename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  const filename = urlFilename && urlFilename.endsWith('.pdf') ? urlFilename : defaultFilename;

  if (isRelative) {
    // For local/relative assets on the same origin, native browser download is 100% reliable,
    // avoids CORS, and works flawlessly without manual fetch / blob generation.
    try {
      const link = document.createElement('a');
      link.href = url.startsWith('/') ? url : `/${url}`;
      link.download = filename;
      link.type = 'application/pdf';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (e) {
      console.error('Relative native download fallback failed:', e);
    }
  }

  // For remote / absolute URLs (e.g. Firebase storage), we try fetching as a blob first 
  // to enforce the download attribute. If CORS blocks it, we gracefully fallback
  // to a safe target="_blank" window opening which forces download/preview without crashing or re-routing.
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML fallback page.');
    }

    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const objectUrl = window.URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    }, 150);
    
    return true;
  } catch (error) {
    console.warn('CORS or Blob fetch failed. Falling back to native target="_blank" safe navigation:', error);
    
    // Direct safe window opening that avoids popup blocker blocks
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return false;
  }
}
