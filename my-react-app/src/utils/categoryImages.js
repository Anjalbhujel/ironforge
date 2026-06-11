export function getImage(product) {
  if (product && product.image_url) return product.image_url;
  return `https://via.placeholder.com/300x200/1a1a1a/ff6b00?text=${encodeURIComponent(product?.name?.slice(0, 10) || "Product")}`;
}