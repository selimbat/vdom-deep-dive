export { }

declare global {
    namespace JSX {

        type IntrinsicElementsTags = keyof HTMLElementTagNameMap;

        type IntrinsicElements = {
            [tag in IntrinsicElementsTags]: any; // TODO type this properly
        }
    }
}