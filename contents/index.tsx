import { useEffect, useRef, useState } from "react"
import type {
  PlasmoCSConfig,
  PlasmoGetOverlayAnchor,
  PlasmoWatchOverlayAnchor
} from "plasmo/dist/type"

import styleText from "data-text:./style/index.css"
import type { PlasmoGetStyle } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.ifood.com.br/*"],
}

export const watchOverlayAnchor: PlasmoWatchOverlayAnchor = (
  updatePosition
) => {
  const interval = setInterval(() => {
    updatePosition()
  }, 200)

  // Clear the interval when unmounted
  return () => {
    clearInterval(interval)
  }
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector("[data-test-id='checkout-payment-submit']")

const OrderBarrier = () => {
  const barrierRef = useRef<HTMLDivElement>(null);
  const [checkboxesChecked, setCheckboxesChecked] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (barrierRef.current) {
        barrierRef.current.remove();
      }
    }, 300000)

    return () => {
      clearTimeout(timeoutId);
    }
  }, []);

  const checkboxes = [
    "Você tá com fome mesmo?",
    "Você tem dinheiro pra pagar? Se for no crédito não vale",
    "Você não tem mais nada pra comer em casa?",
    "Dá pra economizar indo no mercado comprar alguma coisa gostosa?"
  ].map((label, index) => {
    return (
      <li key={label + index}>
        <label>
          <input type="checkbox" onChange={(event) => {
            if (event.target.checked) {
              setCheckboxesChecked(checkboxesChecked + 1)
            } else {
              setCheckboxesChecked(checkboxesChecked - 1)
            }
          }} />
          {label}
        </label>
      </li>
    )
  })

  return (
    <div ref={barrierRef} className="container">
      <div className="barrier">
        <div id="wait-to-order-bar" className="animate"><span></span></div>
        <span id="wait-to-order-text">Você quer mesmo pedir comida?</span>
      </div>

      <div className="checklist">
        <span>Checklist pra botar a mão na consciência:</span>
        <ul>
          {checkboxes.map((checkbox) => checkbox)}
        </ul>
        {checkboxesChecked === checkboxes.length &&
          <button onClick={() => {
            barrierRef.current.remove()
          }} >
            Deixa eu pedir logo
          </button>}
      </div>
    </div>
  )
}

export default OrderBarrier
