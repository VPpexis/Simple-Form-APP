export default function imgResize(maxWidth, maxHeight, dimensions) {
    if (dimensions.width > maxWidth) {
        dimensions.height = (maxWidth/dimensions.width) * dimensions.height;
        dimensions.width = maxWidth;
    }
    if (dimensions.height > maxHeight) {
        dimensions.width = (maxHeight/dimensions.height) * dimensions.width;
        dimensions.height = maxHeight;
    }
    return {'width': dimensions.width, "height": dimensions.height}
}