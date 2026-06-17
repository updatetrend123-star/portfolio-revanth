import { toast } from 'sonner';

/**
 * Utility to securely download resume or other PDF files
 * Prevents SPA HTML fallback downloads and handles downloads with high fail-safety
 */
export async function downloadFile(url: string, defaultFilename: string = 'revanth_kumar_resume.pdf') {
  // Extract clean filename from URL or use default
  const urlFilename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  const filename = urlFilename && urlFilename.endsWith('.pdf') ? urlFilename : defaultFilename;

  // Resolve full path if relative to prevent incorrect routing
  const fetchUrl = !url.startsWith('http://') && !url.startsWith('https://')
    ? (url.startsWith('/') ? url : `/${url}`)
    : url;

  try {
    const response = await fetch(fetchUrl, { method: 'GET' });
    
    if (!response.ok) {
      throw new Error(`File is offline or not found (${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    
    // Check if the server returned HTML content (which indicates SPA index.html fallback)
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Fallback page returned instead of actual PDF document.');
    }

    // Convert response to a blob
    const blob = await response.blob();
    
    // Verify the safety of the downloaded content
    if (blob.type && blob.type.includes('text/html')) {
      throw new Error('Blob conversion resulted in an HTML document.');
    }

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
    
    // Success feedback
    toast.success('CV downloaded successfully!');
    return true;
  } catch (error: any) {
    console.warn('PDF download failed. Checking fallback options:', error);
    
    // Friendly, readable guidance to the end-user rather than downloading binary-distorted HTML
    toast.info('Resume file is not available on Server. Upload a real PDF in the Admin Dashboard.', {
      duration: 6000,
    });
    
    return false;
  }
}

