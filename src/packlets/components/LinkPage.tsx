import { Base } from '$layout/Base'
import { Html } from '@elysiajs/html'

interface Props {
  email: string
  token: string
  isConnected: boolean
}

export const LinkPage = ({ email, token, isConnected }: Props) => {
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
  return (
    <Base>
      <div class="card card-border bg-base-100 max-w-lg w-full mx-auto">
        <div class="card-body">
          <p>
            Logged in as <b>{email}</b>
          </p>
          <h2 class="card-title">Connect with Apple Music</h2>
          <p>
            Now, you need to authorize access to your Apple Music to be able to
            obtain your recently played music.
          </p>
          {isConnected && (
            <div role="alert" class="alert alert-warning">
              <span>
                You've already connected with Apple Music before. If you're having
                a trouble with the card, try to reconnect by connect with Apple
                Music again.
              </span>
            </div>
          )}
          <div id="error-alert" role="alert" class="alert alert-error hidden">
            <span id="error-content"></span>
          </div>
          <button id={'connect-button'} class={'btn'} disabled>
            Loading MusicKit...
          </button>
        </div>
      </div>
      <script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        data-web-components
        async
      ></script>
      <script>{clientScript}</script>
    </Base>
  )
}
