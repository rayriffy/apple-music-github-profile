import { Base } from '../layout/Base'
import { Html } from '@elysiajs/html'
export const LoginPage = ({ authorizationUrl }) => {
  return Html.createElement(
    Base,
    null,
    Html.createElement(
      'div',
      { class: 'card card-border bg-base-100 max-w-lg w-full mx-auto' },
      Html.createElement(
        'div',
        { class: 'card-body' },
        Html.createElement('p', null, 'Not logged in'),
        Html.createElement('h2', { class: 'card-title' }, 'Music profile'),
        Html.createElement(
          'p',
          null,
          'This web application will be able to create you a card showing most recent song you listened to on Apple Music.'
        ),
        Html.createElement(
          'div',
          { class: 'card-actions justify-center pt-4' },
          Html.createElement(
            'a',
            { href: authorizationUrl, class: 'btn btn-neutral' },
            'Sign in with Apple'
          ),
          Html.createElement(
            'form',
            { action: '/callback', method: 'POST' },
            Html.createElement(
              'button',
              { type: 'submit', class: 'btn btn-primary' },
              'Callback'
            )
          )
        )
      )
    )
  )
}
