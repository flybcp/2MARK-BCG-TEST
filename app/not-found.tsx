import Link from "next/link";
import { homepageDestinations } from "@/content/homepage";
import { site } from "@/content/site";

const featured = homepageDestinations.slice(0, 4);

export default function NotFound() {
  return (
    <main id="main-content" className="bg-surface px-4 pb-24 pt-10 md:pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary md:text-4xl">
          This page is away on a layover
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
          The URL may have changed or the page may not exist. Head home to request
          a callback, or jump to a popular destination below.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Return home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Contact {site.shortName}
          </Link>
        </div>
      </div>

      <section
        className="mx-auto mt-16 max-w-5xl"
        aria-labelledby="not-found-destinations"
      >
        <h2
          id="not-found-destinations"
          className="text-center text-xl font-semibold text-text-primary md:text-2xl"
        >
          Popular destinations
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-text-tertiary">
          Browse a popular route below, or head home to request a callback for any
          city.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((d) => (
            <li key={d.city}>
              <Link
                href={d.href}
                className="flex min-h-[44px] items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 text-left transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                <span>
                  <span className="block text-xs uppercase tracking-wider text-text-tertiary">
                    Business class to
                  </span>
                  <span className="text-lg font-semibold text-text-primary">
                    {d.city}
                  </span>
                </span>
                <span className="text-sm font-medium text-brand" aria-hidden>
                  View
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
