export function getImageDataUrl(base64Image) {
    // Detect file type from the first few characters of base64
    if (base64Image.startsWith("/9j/")) {
        // JPEG magic number
        return `data:image/jpeg;base64,${base64Image}`;
    }
    else if (base64Image.startsWith("iVBORw0KGgo")) {
        // PNG magic number
        return `data:image/png;base64,${base64Image}`;
    }
    else if (base64Image.startsWith("R0lGOD")) {
        // GIF magic number
        return `data:image/gif;base64,${base64Image}`;
    }
    else if (base64Image.startsWith("UklGR")) {
        // WebP magic number
        return `data:image/webp;base64,${base64Image}`;
    }
    // Fallback (assume jpeg)
    return `data:image/jpeg;base64,${base64Image}`;
}
//# sourceMappingURL=getImageDataUrl.js.map