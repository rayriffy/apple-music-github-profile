import { Base } from '$layout/Base'
import { Html } from '@elysiajs/html'
import { Theme } from '$types/Theme'
import { CardPreview } from '$components/CardPreview'

interface Props {
  uid: string
  email: string
  theme: Theme
  themes: Theme[]
}

export const DashboardPage = ({ email, uid, theme, themes }: Props) => {
  return (
    <Base>
      <div class="card card-border bg-base-100 max-w-lg w-full mx-auto">
        <div class="card-body">
          <p>
            Logged in as <b>{email}</b>
          </p>
          <h2 class="card-title">Connected!</h2>
          <p>
            Congrats 🎉 You're ready to use the card! Choose card theme of your
            choice and copy following Markdown snippet into your GitHub profile.
          </p>
          <p>
            Having issue with the card?{' '}
            <a href={'/dashboard/link'} class={'text-blue-500'}>
              Try reconnecting it
            </a>{' '}
            or{' '}
            <a href={'/logout'} class={'text-blue-500'}>
              Logout
            </a>
          </p>
          <CardPreview uid={uid} theme={theme} themes={themes} />
        </div>
      </div>
    </Base>
  )
}
