import { Base } from '$layout/Base'
import { Html } from '@elysiajs/html'
export const LinkPage = ({ email, token }) => {
  const clientScript = `
    document.addEventListener('musickitloaded', async function () {
      const musicKit = await MusicKit.configure({
        developerToken: "${token}",
        app: {
          name: "Apple Music GitHub Profile",
          build: "1.0.0",
        },
      });
      
      const buttonElement = document.getElementById("connect-button");
      const errorAlertElement = document.getElementById("error-alert");
      const errorContentElement = document.getElementById("error-content");

      buttonElement.removeAttribute("disabled");
      buttonElement.textContent = "Connect with Apple Music";
      buttonElement.addEventListener("click", async function () {     
        buttonElement.setAttribute("disabled", "true");
        errorAlertElement.classList.add("hidden");

        try {
          const userToken = await musicKit.authorize()
          
          console.log(userToken)
          
          try {
            await fetch("/connect", {
              method: "POST",
              body: JSON.stringify({
                userToken: userToken,
              }),
              headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
              },
            }).then(async o => {
              if (!o.ok)
                throw new Error(await o.text())
            })
            
            window.location.href = "/dashboard"
          } catch (e) {
            console.error(e)
            errorContentElement.textContent = e.message ?? "Unexpected error occurred";
            errorAlertElement.classList.remove("hidden");
          }
        } catch (e) {
          console.error(e)
          errorContentElement.textContent = "Unable to authorized access to Apple Music";
          errorAlertElement.classList.remove("hidden");
        } finally {
          buttonElement.removeAttribute("disabled");
        }
      })
    })
  `
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
        Html.createElement(
          'h2',
          { class: 'card-title' },
          'Connect with Apple Music'
        ),
        Html.createElement(
          'p',
          null,
          'Now, you need to authorize access to your Apple Music to be able to obtain your recently played music.'
        ),
        Html.createElement(
          'div',
          { role: 'alert', class: 'alert alert-warning' },
          Html.createElement(
            'span',
            null,
            "You've already connected with Apple Music before. If you're having a trouble with the card, try to reconnect by connect with Apple Music again."
          )
        ),
        Html.createElement(
          'div',
          {
            id: 'error-alert',
            role: 'alert',
            class: 'alert alert-error hidden',
          },
          Html.createElement('span', { id: 'error-content' })
        ),
        Html.createElement(
          'button',
          { id: 'connect-button', class: 'btn', disabled: true },
          'Loading MusicKit...'
        )
      )
    ),
    Html.createElement('script', {
      src: 'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
      'data-web-components': true,
      async: true,
    }),
    Html.createElement('script', null, clientScript)
  )
}
