import { Base } from '../layout/Base'
import { Html } from '@elysiajs/html'

interface Props {
  authorizationUrl: string
}

export const LoginPage = ({ authorizationUrl }: Props) => {
  return (
    <Base>
      <div class="card card-border bg-base-100 max-w-lg w-full mx-auto">
        <div class="card-body">
          <p>Not logged in</p>
          <h2 class="card-title">Music profile</h2>
          <p>
            This web application will be able to create you a card showing most
            recent song you listened to on Apple Music.
          </p>
          <div class="card-actions justify-center pt-4">
            <a href={authorizationUrl} class="btn btn-neutral">
              Sign in with Apple
            </a>
            <form action={'/callback'} method={'POST'}>
              <button type="submit" class="btn btn-primary">
                Callback
              </button>
            </form>
          </div>
        </div>
      </div>
    </Base>
  )
}
