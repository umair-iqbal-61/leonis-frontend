export const petSpecies = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'other']
export const livestockSpecies = ['dairy-cattle']
export const workspaceHome = value => value === 'LIVESTOCK' ? '/livestock' : '/pets'
const en = {
  workspace: 'Workspace', workspaces: 'Manage workspaces', choose: 'Choose your workspace', chooseHint: 'Use one account for pets, livestock, or both. You can change this later.',
  placeholder: 'Select a workspace', PETS: 'Pets', LIVESTOCK: 'Livestock', BOTH: 'Pets and livestock',
  petsHint: 'Pet profiles, care records, reminders and AI chat.', livestockHint: 'Cattle profiles, barns, milk production and farm finances.',
  active: 'Starting workspace', enableHint: 'Choose the workspaces you use. Disabling one hides its navigation; your existing records are retained.',
  save: 'Save workspaces', saved: 'Workspace preferences saved.', saving: 'Saving…', loading: 'Loading your workspace…', failed: 'Could not load or change your workspace. Please try again.', retry: 'Try again',
  none: 'Keep at least one workspace enabled.', notActive: 'This page belongs to the {workspace} workspace.', open: 'Open {workspace}', enable: 'Enable {workspace}',
  yourPets: 'Your pets', yourCattle: 'Your cattle', addPet: 'Add pet', addCattle: 'Add cattle', emptyPets: 'Your first pet starts here', emptyCattle: 'Your first cattle profile starts here',
  petIntro: 'Add a pet profile to keep care records together.', cattleIntro: 'Add a dairy-cattle profile, then assign it to a barn.', barns: 'Manage barns', backPets: 'All pets', backCattle: 'All cattle',
  INVALID_WORKSPACE: 'Choose at least one valid workspace and an enabled starting workspace.', ACCOUNT_UNAVAILABLE: 'Your account is unavailable. Please sign in again.',
}
const ur = {
  workspace: 'ورک اسپیس', workspaces: 'ورک اسپیس کا انتظام', choose: 'اپنی ورک اسپیس منتخب کریں', chooseHint: 'پالتو جانوروں، مویشیوں یا دونوں کے لیے ایک اکاؤنٹ استعمال کریں۔ بعد میں بدل سکتے ہیں۔',
  placeholder: 'ورک اسپیس منتخب کریں', PETS: 'پالتو جانور', LIVESTOCK: 'مویشی', BOTH: 'پالتو جانور اور مویشی',
  petsHint: 'پالتو جانوروں کے پروفائل، دیکھ بھال کے ریکارڈ، یاددہانیاں اور اے آئی چیٹ۔', livestockHint: 'مویشیوں کے پروفائل، باڑے، دودھ کی پیداوار اور فارم کے حسابات۔',
  active: 'ابتدائی ورک اسپیس', enableHint: 'ضرورت کی ورک اسپیس منتخب کریں۔ غیر فعال کرنے سے اس کے لنکس چھپ جائیں گے؛ موجودہ ریکارڈ محفوظ رہیں گے۔',
  save: 'ورک اسپیس محفوظ کریں', saved: 'ورک اسپیس کی ترجیحات محفوظ ہو گئیں۔', saving: 'محفوظ ہو رہا ہے…', loading: 'آپ کی ورک اسپیس لوڈ ہو رہی ہے…', failed: 'ورک اسپیس لوڈ یا تبدیل نہیں ہوئی۔ دوبارہ کوشش کریں۔', retry: 'دوبارہ کوشش کریں',
  none: 'کم از کم ایک ورک اسپیس فعال رکھیں۔', notActive: 'یہ صفحہ {workspace} کی ورک اسپیس میں ہے۔', open: '{workspace} کھولیں', enable: '{workspace} فعال کریں',
  yourPets: 'آپ کے پالتو جانور', yourCattle: 'آپ کے مویشی', addPet: 'پالتو جانور شامل کریں', addCattle: 'مویشی شامل کریں', emptyPets: 'اپنے پہلے پالتو جانور سے شروع کریں', emptyCattle: 'اپنے پہلے مویشی کے پروفائل سے شروع کریں',
  petIntro: 'دیکھ بھال کے ریکارڈ رکھنے کے لیے پالتو جانور کا پروفائل شامل کریں۔', cattleIntro: 'ڈیری مویشی کا پروفائل شامل کر کے اسے باڑے میں رکھیں۔', barns: 'باڑوں کا انتظام', backPets: 'تمام پالتو جانور', backCattle: 'تمام مویشی',
  INVALID_WORKSPACE: 'کم از کم ایک درست ورک اسپیس اور فعال ابتدائی ورک اسپیس منتخب کریں۔', ACCOUNT_UNAVAILABLE: 'اکاؤنٹ دستیاب نہیں۔ دوبارہ لاگ ان کریں۔',
}
export function workspaceText(language, key, params = {}) {
  return ((language === 'ur' ? ur[key] : en[key]) ?? en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
}
