/**
 * Featured Google Maps reviews — link each card to the reviewer’s public URL.
 */
export type GoogleReviewHighlight = {
  authorName: string;
  reviewUrl: string;
  body: string;
};

export const googleReviewHighlights: GoogleReviewHighlight[] = [
  {
    authorName: "Leonidas Trent",
    reviewUrl: "https://maps.app.goo.gl/WaM3gKkktcePptXU9",
    body: "Business Class Global is a game changer for frequent travelers! Their flight booking service consistently delivers great business class deals. Used them for corporate travel multiple times and they've saved our company thousands. Professional, reliable, and highly recommended!",
  },
  {
    authorName: "Sonia Maybourne",
    reviewUrl: "https://maps.app.goo.gl/8vLpMtRV9YwJX7LN8",
    body: "Thank you. It was a great flight to America from the Middle East. I hope you can get me such good prices next time for Business Class. I would hate to have to sit in economy ever again.",
  },
  {
    authorName: "Lucy Olivia",
    reviewUrl: "https://maps.app.goo.gl/vmRde71dg6VDTHGo9",
    body: "I had an outstanding experience with Business Class Global. Their team truly understands premium travel and helped me secure an amazing deal on a business class ticket. The process was smooth, transparent, and very well-managed from start to finish. I appreciated their quick responses and attention to detail. Highly recommended for anyone looking to travel in comfort without overspending.",
  },
];
