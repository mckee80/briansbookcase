import JSZip from 'jszip';

export interface EbookMetadata {
  title?: string;
  author?: string;
  coverImage?: File;
}

/**
 * Extracts metadata (title, author, cover) from an EPUB file
 * @param file The EPUB file to extract metadata from
 * @returns An object containing title, author, and cover image (if found)
 */
export async function extractEbookMetadata(file: File): Promise<EbookMetadata> {
  try {
    // Only process EPUB files
    if (!file.name.toLowerCase().endsWith('.epub')) {
      console.log('Not an EPUB file, skipping metadata extraction');
      return {};
    }

    // Read the EPUB file as a zip
    const zip = await JSZip.loadAsync(file);

    const metadata: EbookMetadata = {};

    // Extract metadata from content.opf (standard EPUB metadata file)
    const opfPaths = [
      'OEBPS/content.opf',
      'OPS/content.opf',
      'content.opf',
      'OEBPS/package.opf',
      'OPS/package.opf',
      'package.opf',
    ];

    let opfContent: string | null = null;
    for (const path of opfPaths) {
      const opfFile = zip.file(path);
      if (opfFile) {
        opfContent = await opfFile.async('text');
        break;
      }
    }

    // If we didn't find it in common paths, search for any .opf file
    if (!opfContent) {
      const opfFiles: JSZip.JSZipObject[] = [];
      zip.forEach((relativePath, file) => {
        if (relativePath.toLowerCase().endsWith('.opf') && !file.dir) {
          opfFiles.push(file);
        }
      });
      if (opfFiles.length > 0) {
        opfContent = await opfFiles[0].async('text');
      }
    }

    // Parse metadata from OPF content
    if (opfContent) {
      // Extract title
      const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
      if (titleMatch) {
        metadata.title = titleMatch[1].trim();
      }

      // Extract author (creator)
      const authorMatch = opfContent.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i);
      if (authorMatch) {
        metadata.author = authorMatch[1].trim();
      }
    }

    // Extract cover image
    metadata.coverImage = await extractCoverImage(zip);

    console.log('Extracted metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error extracting EPUB metadata:', error);
    return {};
  }
}

/**
 * Extracts the cover image from an EPUB file
 * @param file The EPUB file to extract the cover from
 * @returns A File object containing the cover image, or null if extraction fails
 */
export async function extractEbookCover(file: File): Promise<File | null> {
  try {
    if (!file.name.toLowerCase().endsWith('.epub')) {
      return null;
    }
    const zip = await JSZip.loadAsync(file);
    return await extractCoverImage(zip);
  } catch (error) {
    console.error('Error extracting cover from EPUB:', error);
    return null;
  }
}

/**
 * Internal helper to extract cover image from a loaded zip
 */
async function extractCoverImage(zip: JSZip): Promise<File | null> {
  try {
    // Common cover image paths in EPUB files
    const coverPaths = [
      'OEBPS/Images/cover.jpg',
      'OEBPS/Images/cover.jpeg',
      'OEBPS/Images/cover.png',
      'OEBPS/images/cover.jpg',
      'OEBPS/images/cover.jpeg',
      'OEBPS/images/cover.png',
      'OPS/images/cover.jpg',
      'OPS/images/cover.jpeg',
      'OPS/images/cover.png',
      'Images/cover.jpg',
      'Images/cover.jpeg',
      'Images/cover.png',
      'images/cover.jpg',
      'images/cover.jpeg',
      'images/cover.png',
      'cover.jpg',
      'cover.jpeg',
      'cover.png',
    ];

    // Try to find cover in common paths
    for (const path of coverPaths) {
      const coverFile = zip.file(path);
      if (coverFile) {
        const blob = await coverFile.async('blob');
        const extension = path.split('.').pop() || 'jpg';
        return new File([blob], `cover.${extension}`, { type: `image/${extension === 'jpg' ? 'jpeg' : extension}` });
      }
    }

    // If not found in common paths, search all files for image files
    const imageFiles: Array<{ name: string; file: JSZip.JSZipObject }> = [];
    zip.forEach((relativePath, file) => {
      const lowerPath = relativePath.toLowerCase();
      if (
        (lowerPath.endsWith('.jpg') ||
         lowerPath.endsWith('.jpeg') ||
         lowerPath.endsWith('.png')) &&
        !file.dir
      ) {
        imageFiles.push({ name: relativePath, file });
      }
    });

    // Sort by name and prefer files with "cover" in the name
    imageFiles.sort((a, b) => {
      const aHasCover = a.name.toLowerCase().includes('cover');
      const bHasCover = b.name.toLowerCase().includes('cover');
      if (aHasCover && !bHasCover) return -1;
      if (!aHasCover && bHasCover) return 1;
      return a.name.localeCompare(b.name);
    });

    // Use the first image file found (likely the cover)
    if (imageFiles.length > 0) {
      const firstImage = imageFiles[0];
      const blob = await firstImage.file.async('blob');
      const extension = firstImage.name.split('.').pop() || 'jpg';
      return new File([blob], `cover.${extension}`, { type: `image/${extension === 'jpg' ? 'jpeg' : extension}` });
    }

    console.log('No cover image found in EPUB file');
    return null;
  } catch (error) {
    console.error('Error extracting cover from EPUB:', error);
    return null;
  }
}
