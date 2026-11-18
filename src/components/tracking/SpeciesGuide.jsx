import { recordText } from '../../lib/recordLanguage'

const entries = [
  {
    species: 'cat', breed: 'maine coon', title: 'Maine Coon',
    en: 'The Maine Coon is a longhaired breed. Regular combing helps manage its coat and shedding.',
    ur: 'مین کون لمبے بالوں والی نسل ہے۔ باقاعدگی سے کنگھی کرنے سے بال سنبھالنے اور جھڑنے کو کم کرنے میں مدد ملتی ہے۔',
    source: 'Cat Fanciers’ Association', url: 'https://cfa.org/breed/maine-coon-cat/',
  },
  {
    species: 'dairy-cattle', title: 'Dairy cattle',
    en: 'Keep an individual record of breeding and calving dates, and log milk yield periodically.',
    ur: 'ہر جانور کی افزائش اور بچھڑے کی پیدائش کی تاریخیں محفوظ کریں اور وقفے وقفے سے دودھ کی پیداوار درج کریں۔',
    source: 'Jamaica Dairy Development Board', url: 'https://www.jddb.gov.jm/page/record-keeping',
  },
  {
    species: 'dairy-cattle', breed: 'holstein', title: 'Holstein',
    en: 'Holstein is a dairy breed known for high milk production. Use the individual animal’s records to track its actual yield.',
    ur: 'ہولسٹین دودھ کی زیادہ پیداوار کے لیے مشہور نسل ہے۔ اصل پیداوار جاننے کے لیے ہر جانور کے اپنے ریکارڈ استعمال کریں۔',
    source: 'Holstein Association USA', url: 'https://www.holsteinusa.com/holstein_breed/holstein101.html',
  },
]

export default function SpeciesGuide({ pet, language }) {
  const breed = pet.breed?.trim().toLowerCase()
  const matches = entries.filter(entry => entry.species === pet.species && (!entry.breed || entry.breed === breed))
  return (
    <section className="space-y-4 text-gray-900 dark:text-gray-100">
      <h3 className="font-semibold">{recordText(language, 'guide')}</h3>
      {!matches.length && <p className="text-sm">{recordText(language, 'noGuide')}</p>}
      {matches.map(entry => (
        <article key={entry.url} className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <h4 className="font-medium">{entry.title}</h4>
          <p className="text-sm">{entry[language]}</p>
          <a className="text-sm text-violet-700 underline dark:text-violet-300" href={entry.url}>{entry.source}</a>
        </article>
      ))}
    </section>
  )
}
