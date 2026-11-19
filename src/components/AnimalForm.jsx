import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

const species = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'dairy-cattle', 'other']

export default function AnimalForm({ form, setForm, onSubmit, busy, onCancel, allowedSpecies = species }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const update = field => event => setForm(current => ({ ...current, [field]: event.target.value }))
  return (
    <form onSubmit={onSubmit} className="grid gap-5 text-ink p-7 bg-surface border border-line rounded-panel [&_label]:grid [&_label]:gap-2
              [&_label]:min-w-0 [&_label]:text-[14px] [&_label]:font-medium [&_:is(input,select,textarea)]:block
              [&_:is(input,select,textarea)]:w-full [&_:is(input,select,textarea)]:min-w-0
              [&_:is(input,select,textarea)]:min-h-12 [&_:is(input,select,textarea)]:py-[11px]
              [&_:is(input,select,textarea)]:px-[13px] [&_:is(input,select,textarea)]:text-ink
              [&_:is(input,select,textarea)]:bg-canvas [&_:is(input,select,textarea)]:border
              [&_:is(input,select,textarea)]:border-line [&_:is(input,select,textarea)]:rounded-xl
              [&_:is(input,select,textarea)]:[font-family:inherit] [&_:is(input,select,textarea)]:text-[16px]
              [&_:is(input,select,textarea)]:font-normal [&_:is(input,select,textarea)]:leading-[1.5] [&_textarea]:resize-y
              [&_textarea]:min-h-26 [&>div:last-child]:pt-3 [&>div:last-child]:border-t [&>div:last-child]:border-line
              max-md:py-5 max-md:px-4 max-md:gap-4.5">
      <label><span>{t('animalName')} <span aria-hidden="true">*</span></span>
        <input autoComplete="off" name="animal-name" value={form.name} onChange={update('name')} required />
      </label>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 max-md:gap-4.5">
        <label><span>{t('species')} <span aria-hidden="true">*</span></span>
          <select value={form.species} onChange={update('species')} required>
            {!allowedSpecies.includes(form.species) && <option value={form.species}>{form.species}</option>}
            {allowedSpecies.map(value => <option key={value} value={value}>{t(value)}</option>)}
          </select>
        </label>
        <label>{t('gender')}
          <select value={form.gender} onChange={update('gender')}>
            <option value="">{t('unknownValue')}</option>
            {['male', 'female'].map(value => <option key={value} value={value}>{t(value)}</option>)}
          </select>
        </label>
      </div>
      <label>{t('breed')}
        <input value={form.breed} onChange={update('breed')} />
      </label>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 max-md:gap-4.5">
        <label>{t('ageYears')}
          <input type="number" min="0" step="1" inputMode="numeric" value={form.age} onChange={update('age')} />
        </label>
        <label>{t('weightKg')}
          <input type="number" min="0" step="0.1" inputMode="decimal" value={form.weight} onChange={update('weight')} />
        </label>
      </div>
      <label>{t('notes')}
        <textarea rows={4} value={form.notes} onChange={update('notes')} />
      </label>
      <div className="flex flex-wrap justify-end gap-2.5 max-md:[&>button]:flex-1">
        <button type="button" onClick={onCancel} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('cancel')}</button>
        <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t(busy ? 'saving' : 'saveProfile')}</button>
      </div>
    </form>
  )
}
