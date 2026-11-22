import { Link } from 'react-router-dom'
import FarmCard from '../components/farms/FarmCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { FARMS } from '../data/seedFarms'
import useDocumentTitle from '../hooks/useDocumentTitle'

const STEPS = [
  {
    title: 'Find a plot that fits',
    body: 'Filter by county, size, water source and the crops you want to grow. Every listing shows what the land has actually produced.',
  },
  {
    title: 'Agree clear terms',
    body: 'Rent, season length, permitted crops and who handles what - written down before anyone puts a spade in the ground.',
  },
  {
    title: 'Farm the season',
    body: 'Follow the crop calendar for your county, log progress, and settle at harvest without guesswork on either side.',
  },
]

const REGIONS = [
  {
    name: 'Central Highlands',
    counties: 'Kiambu, Murang’a, Nyeri, Meru',
    crops: 'Coffee, tea, avocado, potatoes, horticulture',
  },
  {
    name: 'Western & Nyanza',
    counties: 'Kakamega, Bungoma, Kisumu',
    crops: 'Maize, beans, sugarcane, bananas, sweet potatoes',
  },
  {
    name: 'ASAL & Coast',
    counties: 'Kajiado, Machakos, Kilifi',
    crops: 'Sorghum, millet, cowpeas, mango, fodder',
  },
]

const TARGETS = [
  { value: '500', label: 'acres activated by year two' },
  { value: '1,200', label: 'seasonal leases signed' },
  { value: '300', label: 'youth jobs in farm services' },
  { value: '40%', label: 'average yield lift on leased plots' },
]

export default function Home() {
  useDocumentTitle('Lease land, grow food, earn from your shamba')

  const featured = FARMS.filter((farm) => farm.verified).slice(0, 3)

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-primary-tint/60 to-paper">
        <div className="section grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <Badge tone="primary">Built for Kenyan land and Kenyan seasons</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Land, put to work.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
              Farming Nyumbani connects landowners with people who want to farm. Lease a plot by the
              season, see what the soil and rainfall will actually support, and agree terms you can
              both point to later.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/farms" variant="accent" size="lg">
                Find a farm
              </Button>
              <Button to="/crops" variant="outline" size="lg">
                What grows in my county
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Landowners keep the title. Tenants get a season, a plan and a market.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Verified plots', value: 'Documents, boundaries and water checked before listing' },
              { label: 'Crop guidance', value: 'Altitude and rainfall matched to what you intend to grow' },
              { label: 'Season pricing', value: 'Rent quoted per season in shillings, not vague promises' },
              { label: 'Two-sided reviews', value: 'Landlord and tenant history follow the plot' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-surface p-5 shadow-card">
                <p className="font-display text-sm font-semibold text-primary-dark">{item.label}</p>
                <p className="mt-2 text-sm text-muted">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section scroll-mt-20 py-16 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">How it works</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Three steps, in the order they actually happen on the ground.
        </p>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-line bg-surface p-6 shadow-card">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-accent-tint font-display text-sm font-semibold text-accent-dark"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section pb-16 lg:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Farms available now</h2>
            <p className="mt-2 text-sm text-muted">A sample of the listings in the current season.</p>
          </div>
          <Link to="/farms" className="text-sm font-medium text-primary hover:text-primary-dark">
            See all farms →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="section">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">What grows where</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Kenya farms across very different rainfall and altitude bands. Plant for the land you
            have, not the land in the brochure.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REGIONS.map((region) => (
              <div key={region.name} className="rounded-xl border border-line bg-paper p-6">
                <h3 className="font-display text-base font-semibold">{region.name}</h3>
                <p className="mt-1 text-xs text-muted">{region.counties}</p>
                <p className="mt-4 text-sm text-ink">{region.crops}</p>
              </div>
            ))}
          </div>
          <Button to="/crops" variant="primary" className="mt-8">
            Check your county
          </Button>
        </div>
      </section>

      <section id="impact" className="section scroll-mt-20 py-16 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Why it matters</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Idle land and unemployed youth sit in the same country. Every season we measure four
          things - these are the pilot targets for the first two years.
        </p>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TARGETS.map((target) => (
            <div
              key={target.label}
              className="flex flex-col-reverse gap-2 rounded-xl border border-line bg-primary-tint/50 p-6"
            >
              <dt className="text-sm text-muted">{target.label}</dt>
              <dd className="font-display text-3xl font-semibold text-primary-dark">{target.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted">
          Targets, not results. This is a capstone build; figures are illustrative.
        </p>
      </section>

      <section className="section pb-20">
        <div className="rounded-2xl bg-ink px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-2xl font-semibold text-surface sm:text-3xl">
            Have land sitting idle this season?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-surface/70">
            List it once, set your season rent, and choose who farms it. You keep the title and the
            final say.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/farms" variant="accent" size="lg">
              See how listings work
            </Button>
            <Button to="/crops" variant="outline" size="lg">
              Browse the crop guide
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}