const DISABLE_TRANSITIONS_CSS = `
  *,
  *::before,
  *::after {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    -ms-transition: none !important;
    transition: none !important;
  }
`

export const withTransitionsDisabled = (update: () => void) => {
  const stylesheet = document.createElement("style")
  stylesheet.textContent = DISABLE_TRANSITIONS_CSS
  document.head.append(stylesheet)

  try {
    update()

    // Force the new theme to paint while the temporary stylesheet is active.
    void window.getComputedStyle(stylesheet).opacity
  } finally {
    stylesheet.remove()
  }
}
