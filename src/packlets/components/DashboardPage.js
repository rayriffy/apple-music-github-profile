import { Base } from '$layout/Base'
import { Html } from '@elysiajs/html'
import { CardPreview } from '$components/CardPreview'
export const DashboardPage = ({ email, uid, theme, themes }) => {
  return Html.createElement(
    Base,
    null,
    Html.createElement(
      'div',
      { class: 'card card-border bg-base-100 max-w-lg w-full mx-auto' },
      Html.createElement(
        'div',
        { class: 'card-body' },
        Html.createElement(
          'p',
          null,
          'Logged in as ',
          Html.createElement('b', null, email)
        ),
        Html.createElement('h2', { class: 'card-title' }, 'Connected!'),
        Html.createElement(
          'p',
          null,
          "Congrats \uD83C\uDF89 You're ready to use the card! Choose card theme of your choice and copy following Markdown snippet into your GitHub profile."
        ),
        Html.createElement(
          'p',
          null,
          'Having issue with the card? ',
          Html.createElement(
            'a',
            { href: '/dashboard/link', class: 'text-blue-500' },
            'Try reconnecting it'
          ),
          ' or ',
          Html.createElement(
            'a',
            { href: '/logout', class: 'text-blue-500' },
            'Logout'
          )
        ),
        Html.createElement(CardPreview, {
          uid: uid,
          theme: theme,
          themes: themes,
        })
      )
    )
  )
}
