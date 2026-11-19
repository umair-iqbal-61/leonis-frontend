export const marketSpecies = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'dairy-cattle', 'other']
export const marketButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed glass hover:bg-surface'
export const marketPrimary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2.5 text-sm font-semibold bg-action text-white hover:bg-violet-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
export const marketInput = 'w-full min-w-0 min-h-12 rounded-xl border border-line bg-surface px-3 py-2.5 text-base text-ink'
const en = {
  marketplace: 'Marketplace', myListings: 'My listings', newListing: 'Create listing', animals: 'My animals',
  browseIntro: 'Find animals and contact sellers directly.', allSpecies: 'All species', location: 'City or area',
  filter: 'Apply filters', noListings: 'No listings found', noListingsHint: 'Try another species or location.',
  noMine: 'Your listings will appear here. Start with a private draft.', listingDetails: 'Listing details',
  price: 'Asking price (PKR)', age: 'Age in years', breed: 'Breed', title: 'Listing title', description: 'Description',
  species: 'Species', phone: 'Phone number', whatsapp: 'WhatsApp number', phoneHint: 'Use +country code or a Pakistani 03 number.',
  whatsappHint: 'Leave blank to use your phone number.', privacy: 'Only the details and photos you add here are published. Your private animal records are not shared.',
  draftIntro: 'Save a private draft, add photos, then publish when ready.', saveDraft: 'Save draft', saveChanges: 'Save changes as draft',
  DRAFT: 'Draft', PUBLISHED: 'Published', SOLD: 'Sold', edit: 'Edit listing', view: 'View listing', back: 'Back to listings',
  photos: 'Listing photos', photoHint: 'Add up to 5 JPG, PNG, or WebP photos, 5 MB each. Add at least one before publishing.',
  photoPrivacy: 'Choose photos intended for public viewing. Do not upload medical documents or private information.',
  addPhoto: 'Add photo', removePhoto: 'Remove photo', photoAlt: 'Listing photo {number}',
  publish: 'Publish listing', consent: 'I agree to make these listing details, photos, phone and WhatsApp numbers public.',
  publishHint: 'Save any changes and add a photo before publishing.', withdraw: 'Withdraw listing', sold: 'Mark as sold', remove: 'Delete listing',
  deleteConfirm: 'Delete this listing and its photos?', soldConfirm: 'Mark this animal as sold? Buyer contact buttons will be hidden.',
  withdrawHint: 'Saving changes withdraws this listing. Review and publish it again to make changes public.',
  call: 'Call seller', message: 'WhatsApp seller', contact: 'Contact seller', details: 'About this animal',
  sellerEntered: 'Details are provided by the seller. Confirm the animal, price and arrangements directly.',
  soldHint: 'This listing is sold. Seller contact details are hidden.', whatsappMessage: 'Hello, I am interested in your Leonis listing: {title}.',
  unavailable: 'This listing is unavailable.', failed: 'Could not complete this action. Check the details and try again.',
  loading: 'Loading listings…', retry: 'Try again', saving: 'Saving…', previous: 'Previous', next: 'Next', page: 'Page {page}',
  saveFirst: 'Save the draft to add photos and publish.', saved: 'Draft saved. Add photos and review before publishing.',
  invalidPhoto: 'Choose one JPG, PNG, or WebP image under 5 MB.', publishSuccess: 'Your listing is now public.',
  unknown: 'Not specified', photoUnavailable: 'Photo unavailable', noPhoto: 'No listing photos yet', manage: 'Manage listing',
}
const ur = {
  marketplace: 'جانوروں کی مارکیٹ', myListings: 'میرے اشتہارات', newListing: 'اشتہار بنائیں', animals: 'میرے جانور',
  browseIntro: 'جانور تلاش کریں اور فروخت کنندہ سے براہ راست رابطہ کریں۔', allSpecies: 'تمام اقسام', location: 'شہر یا علاقہ',
  filter: 'فلٹر لگائیں', noListings: 'کوئی اشتہار نہیں ملا', noListingsHint: 'دوسری قسم یا علاقہ تلاش کریں۔',
  noMine: 'آپ کے اشتہارات یہاں نظر آئیں گے۔ پہلے نجی مسودہ بنائیں۔', listingDetails: 'اشتہار کی تفصیلات',
  price: 'مطلوبہ قیمت (روپے)', age: 'عمر (سال)', breed: 'نسل', title: 'اشتہار کا عنوان', description: 'تفصیل',
  species: 'قسم', phone: 'فون نمبر', whatsapp: 'واٹس ایپ نمبر', phoneHint: 'ملکی کوڈ کے ساتھ + نمبر یا پاکستانی 03 نمبر لکھیں۔',
  whatsappHint: 'وہی فون نمبر استعمال کرنے کے لیے خالی چھوڑیں۔', privacy: 'صرف یہاں دی گئی تفصیلات اور تصاویر شائع ہوں گی۔ جانور کے نجی ریکارڈ شیئر نہیں ہوں گے۔',
  draftIntro: 'نجی مسودہ محفوظ کریں، تصاویر شامل کریں، پھر تیار ہونے پر شائع کریں۔', saveDraft: 'مسودہ محفوظ کریں', saveChanges: 'تبدیلیاں بطور مسودہ محفوظ کریں',
  DRAFT: 'مسودہ', PUBLISHED: 'شائع شدہ', SOLD: 'فروخت شدہ', edit: 'اشتہار میں ترمیم', view: 'اشتہار دیکھیں', back: 'اشتہارات پر واپس',
  photos: 'اشتہار کی تصاویر', photoHint: 'زیادہ سے زیادہ 5 تصاویر، JPG، PNG یا WebP، ہر ایک 5 ایم بی تک۔ اشاعت سے پہلے ایک تصویر ضروری ہے۔',
  photoPrivacy: 'عوامی نمائش کے لیے تصاویر منتخب کریں۔ طبی دستاویزات یا نجی معلومات اپ لوڈ نہ کریں۔',
  addPhoto: 'تصویر شامل کریں', removePhoto: 'تصویر حذف کریں', photoAlt: 'اشتہار کی تصویر {number}',
  publish: 'اشتہار شائع کریں', consent: 'میں اشتہار کی تفصیلات، تصاویر، فون اور واٹس ایپ نمبر عوامی کرنے پر رضامند ہوں۔',
  publishHint: 'تبدیلیاں محفوظ کریں اور اشاعت سے پہلے تصویر شامل کریں۔', withdraw: 'اشتہار واپس لیں', sold: 'فروخت شدہ کریں', remove: 'اشتہار حذف کریں',
  deleteConfirm: 'یہ اشتہار اور اس کی تصاویر حذف کریں؟', soldConfirm: 'جانور فروخت شدہ کریں؟ خریدار کے رابطہ بٹن چھپ جائیں گے۔',
  withdrawHint: 'تبدیلیاں محفوظ کرنے سے اشتہار واپس ہو جائے گا۔ دوبارہ جائزہ لے کر شائع کریں۔',
  call: 'فروخت کنندہ کو کال کریں', message: 'واٹس ایپ پر رابطہ کریں', contact: 'فروخت کنندہ سے رابطہ', details: 'جانور کی تفصیلات',
  sellerEntered: 'یہ تفصیلات فروخت کنندہ نے دی ہیں۔ جانور، قیمت اور لین دین کی تصدیق خود کریں۔',
  soldHint: 'یہ جانور فروخت ہو چکا ہے۔ رابطہ تفصیلات چھپا دی گئی ہیں۔', whatsappMessage: 'السلام علیکم، مجھے آپ کے لیونس اشتہار میں دلچسپی ہے: {title}۔',
  unavailable: 'یہ اشتہار دستیاب نہیں۔', failed: 'کارروائی مکمل نہیں ہوئی۔ تفصیلات دیکھ کر دوبارہ کوشش کریں۔',
  loading: 'اشتہارات لوڈ ہو رہے ہیں…', retry: 'دوبارہ کوشش کریں', saving: 'محفوظ ہو رہا ہے…', previous: 'پچھلا', next: 'اگلا', page: 'صفحہ {page}',
  saveFirst: 'تصاویر شامل کرنے اور شائع کرنے کے لیے پہلے مسودہ محفوظ کریں۔', saved: 'مسودہ محفوظ ہو گیا۔ تصاویر شامل کریں اور اشاعت سے پہلے جائزہ لیں۔',
  invalidPhoto: 'ایک JPG، PNG یا WebP تصویر منتخب کریں جو 5 ایم بی سے کم ہو۔', publishSuccess: 'اشتہار اب عوامی ہے۔',
  unknown: 'درج نہیں', photoUnavailable: 'تصویر دستیاب نہیں', noPhoto: 'ابھی اشتہار کی کوئی تصویر نہیں', manage: 'اشتہار کا انتظام',
}
export function marketText(language, key, params = {}) {
  return ((language === 'ur' ? ur[key] : en[key]) ?? en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
}
export function formatPrice(price, language) {
  return new Intl.NumberFormat(language === 'ur' ? 'ur-PK' : 'en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 2 }).format(Number(price))
}
