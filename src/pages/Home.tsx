import { Capabilities } from '../sections/Capabilities'
import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'

export function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Capabilities />
      <Contact />
    </>
  )
}
