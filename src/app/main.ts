import { createComponent } from "../lib/component"
import { renderDOM } from "../lib/render"
import App from "./components/App"

renderDOM('root', createComponent(App, { key: 'root' }))
