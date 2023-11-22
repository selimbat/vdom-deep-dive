import { createComponent } from "../lib/component"
import { renderDOM } from "../lib/render"
import App from "./components/App"
import TestReveal from "./components/TestReveal"

renderDOM('root', createComponent(TestReveal, { key: 'root' }))
