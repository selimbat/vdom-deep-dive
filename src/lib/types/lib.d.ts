export { }

declare global {
    namespace JSX {
        interface IntrinsicElements {
            li: any,
            button: any,
            span: any
        }
    }
}