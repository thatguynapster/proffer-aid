import { Button } from '../../components/ui/button'
import { Container } from '../../components/ui/container'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <Container width="narrow" className="py-24 text-center sm:py-32">
      <p className="font-display text-display-lg leading-none text-gold-500">404</p>

      <h1 className="mt-6 font-display text-display-sm text-navy-600 sm:text-display-md">
        We can&rsquo;t find that page
      </h1>

      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-navy-600/70">
        It may have moved, or it may not be published yet. The links below cover most of
        what people are looking for.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/updates" variant="secondary">
          Read our updates
        </Button>
        <Button href="/contact" variant="ghost">
          Contact us
        </Button>
      </div>
    </Container>
  )
}
